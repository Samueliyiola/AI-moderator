import mongoose, { Schema, Document } from 'mongoose';
import { PostStatus } from '../../../core/types'; 


export interface IPost extends Document {
  content: string;
  authorId: string;
  status: PostStatus;
  flaggedReason?: Record<string, any>; // Stores AI details (e.g., { hate: true })
  createdAt: Date;
  updatedAt: Date;
}


const PostSchema: Schema = new Schema(
  {
    content: { 
      type: String, 
      required: [true, 'Content is required'],
      trim: true 
    },
    authorId: { 
      type: String, 
      required: [true, 'Author ID is required'] 
    },
    status: {
      type: String,
      enum: Object.values(PostStatus), 
      default: PostStatus.PENDING,     
    },
    flaggedReason: {
      type: Object,
      default: {},
    },
  },
  { 
    timestamps: true 
  }
);


export const Post = mongoose.model<IPost>('Post', PostSchema);