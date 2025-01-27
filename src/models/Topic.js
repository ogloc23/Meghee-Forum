import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
  }
);

// Add virtual field for 'id' to represent the _id field as 'id' for GraphQL
topicSchema.virtual('id').get(function () {
  return this._id.toString();
});

// Ensure the 'id' field is included when the document is serialized
topicSchema.set('toJSON', { virtuals: true });

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;
