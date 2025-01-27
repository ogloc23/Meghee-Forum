import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import Topic from '../../models/Topic.js';
import Post from '../../models/Post.js';
import Comment from '../../models/Comment.js';

const SECRET_KEY = process.env.JWT_SECRET || 'vybz_kartel_2003';

const resolvers = {
  Query: {
    async getUser(_, { id }) {
      return User.findById(id);
    },
    async getAllUsers() {
      return User.find();
    },
    async getAllTopics() {
      return Topic.find();
    },
    async getTopic(_, { id }) {
      return Topic.findById(id);
    },
    async getPostsByTopic(_, { topicId }) {
      return Post.find({ topic: topicId });
    },
    async getCommentsByPost(_, { postId }) {
      return Comment.find({ post: postId });
    },
  },

  Mutation: {
    register: async (_, { input }) => {
        const { username, email, password } = input;
  
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Create a new user in the database
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
          role: "user",
        });
  
        await newUser.save();

        console.log('Saved User:', newUser);
  
        // Return the created user (or any success message)
        return {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt,
        };
      },

    async login(_, { input }) {
      const { email, password } = input;

      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid credentials.');
      }

      // Compare the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials.');
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
      return token ; // Return token to the user
    },

    createTopic: async (_, { input }, { user }) => {
        if (!user) {
          throw new Error('Authentication required'); // If no user in context, throw an error
        }
      
        // Proceed with creating the topic using `user.id`
        const newTopic = new Topic({
          ...input,
          createdBy: user.id, // Use the user's ID (which is an ObjectId)
          createdAt: new Date().toISOString(), // Use current date for creation
        });
      
        // Save the topic to the database
        const savedTopic = await newTopic.save();
      
        // Return the saved topic with the createdBy ID as a string
        return {
          id: savedTopic._id.toString(), // Explicitly set 'id' from '_id' as a string
          ...savedTopic.toObject(),      // Convert the saved topic to a plain JavaScript object
          createdBy: savedTopic.createdBy.toString(), // Convert the ObjectId to a string
        };
      },

      createPost : async (_, { input }) => {
        try {
          const { title, content, topicId, createdBy } = input;
      
          const post = new Post({
            title,
            content,
            topic: topicId,
            createdBy: createdBy,
          });
      
          const savedPost = await post.save();
      
          return {
            id: savedPost._id.toString(), // Convert _id to string
            title: savedPost.title,
            content: savedPost.content,
            topic: savedPost.topic.toString(), // Convert topic to string
            createdBy: savedPost.createdBy.toString(), // Convert createdBy to string
            createdAt: savedPost.createdAt.toISOString(),
          };
        } catch (error) {
          throw new Error('Error creating post: ' + error.message);
        }
      },
      
      
      

    async createComment(_, { input }, { user }) {
      if (!user) {
        throw new Error('Authentication required');
      }

      const comment = new Comment({
        ...input,
        createdBy: user._id,
      });
      await comment.save();
      return comment;
    },

    async replyToComment(_, { input }, { user }) {
      if (!user) {
        throw new Error('Authentication required');
      }

      const comment = new Comment({
        ...input,
        createdBy: user._id,
      });
      await comment.save();
      return comment;
    },
  },
};

export default resolvers;
