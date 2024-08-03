import { Schema, model, models, Document, Types } from 'mongoose';
import { DoiqDocument } from './doiq.schema';

export interface UserDocument extends Document {
  _id: string;
  fid: string;
  username: string;
  displayName: string;
  doiqs: Types.ObjectId[];
  doiqValue?: string;
  doiqAnswer?: string;
  createdAt: string;
  updatedAt: string;
}

// Create a schema corresponding to the document interface
const userSchema = new Schema<UserDocument>({
  fid: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  displayName: { type: String },
  doiqs: [{ type: Schema.Types.ObjectId, ref: 'Doiq' }],
}, {
  timestamps: true, // Automatically create createdAt and updatedAt fields
});

// Create a virtual property 'doiqs' to reference the Doiq model
userSchema.virtual("virtualDoiqs", {
  ref: 'Doiq',
  localField: '_id',
  foreignField: 'userId',
});

// Ensure virtual fields are included when the schema is converted to JSON
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

// Create and export the model
export const User = models.User || model<UserDocument>('User', userSchema);

