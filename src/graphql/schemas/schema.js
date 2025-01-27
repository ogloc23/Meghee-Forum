import { gql } from 'apollo-server-express';

const typeDefs = gql`
  scalar ObjectId

  type User {
    id: ObjectId!
    username: String!
    email: String!
    role: String!
    createdAt: String!
  }

  type Topic {
    id: ID!
    title: String!
    description: String!
    createdBy: ID!
    createdAt: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    createdBy: User!
    topic: Topic!
    createdAt: String!
  }

  type Comment {
    id: ObjectId!
    content: String!
    createdBy: User!
    post: Post!
    createdAt: String!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input TopicInput {
    title: String!
    description: String!
  }

  input PostInput {
    title: String!
    content: String!
    topicId: ID!
    createdBy: ID!
  }

  input CommentInput {
    content: String!
    postId: ObjectId!
  }

  type Query {
    getUser(id: ObjectId!): User
    getAllUsers: [User]
    getAllTopics: [Topic]
    getTopic(id: ObjectId!): Topic
    getPostsByTopic(topicId: ObjectId!): [Post]
    getCommentsByPost(postId: ObjectId!): [Comment]
  }

  type Mutation {
    register(input: RegisterInput): User
    login(input: LoginInput): String  # Returns JWT token
    createTopic(input: TopicInput): Topic
    createPost(input: PostInput): Post
    createComment(input: CommentInput): Comment
    replyToComment(input: CommentInput): Comment
  }
`;


export default typeDefs;
