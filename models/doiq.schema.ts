import { Schema, model, models, Document, Types } from 'mongoose';

export enum EDoiq {
  doiq = "doiq",
  doiqQuestion = "doiq?",
  doiqExclamation = "doiq!"
}

export interface DoiqDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userFid: string;
  doiqValue: EDoiq;
  doiqAnswer: EDoiq;
  createdAt: string;
  updatedAt: string;
}

// Create a schema corresponding to the document interface
const doiqSchema = new Schema<DoiqDocument>({
  userId: { type: Schema.Types.ObjectId, required: true },
  userFid: { type: String, required: true },
  doiqValue: { type: String, enum: Object.values(EDoiq), required: true },
  doiqAnswer: { type: String, enum: Object.values(EDoiq), required: true },
}, {
  timestamps: true, // Automatically create createdAt and updatedAt fields
});

// Create and export the model
export const Doiq = models?.Doiq || model<DoiqDocument>('Doiq', doiqSchema);
