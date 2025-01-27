import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken'; // Ensure jwt is imported
import typeDefs from './src/graphql/schemas/schema.js';
import resolvers from './src/graphql/resolvers/index.js';
import authMiddleware from './src/middleware/authMiddleware.js'; // Import your custom middleware

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// MongoDB connection
const mongoUri = process.env.MONGO_URI;

mongoose
  .connect(mongoUri, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // If the user has been authenticated by middleware, we can directly access `req.user`
    let user = req.user || null;

    // In case the user is not already set (for example, if the middleware didn't run properly)
    // Decode the token and fetch the user manually
    const token = req.headers.authorization || '';

    if (!user && token && token.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET || 'vybz_kartel_2003');
        // Fetch user from the database based on the decoded token
        user = await user.findById(decoded.id);  // Ensure User model is imported correctly
      } catch (err) {
        console.error('Error validating token:', err);
      }
    }

    return { user }; // Return the user in the context for access in resolvers
  },
});

// Apply authentication middleware to Express app before Apollo server middleware
app.use(cors()); // Allow cross-origin requests if necessary (e.g., from Insomnia)
app.use(authMiddleware); // Ensure this is before Apollo server middleware

// Start the server
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('Server running on http://localhost:4000/graphql');
  });
}

startServer();
