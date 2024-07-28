import { Schema, model, models, Document, Types } from 'mongoose';
import { DoiqDocument } from './doiq.schema';

export interface UserDocument extends Document {
  _id: string;
  fid: string;
  username: string;
  doiqCount: number;
  displayName: string;
  ethAddress: string;
  solAddress: string;
  doiqs: [Types.ObjectId];
  createdAt: string;
  updatedAt: string;
}

// Create a schema corresponding to the document interface
const userSchema = new Schema<UserDocument>({
  fid: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  doiqCount: { type: Number, required: true, default: 0 },
  displayName: { type: String },
  doiqs: [{ type: Schema.Types.ObjectId, ref: 'Doiq' }],
  ethAddress: { type: String, unique: true },
  solAddress: { type: String, unique: true },
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
const User = model<UserDocument>('User', userSchema);

export default User;