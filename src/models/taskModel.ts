import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  taskName: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  assignedUser: mongoose.Schema.Types.ObjectId;
  isEnabled: boolean;
  completionDate?: Date;
}

const TaskSchema: Schema = new Schema({
  taskName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxlength: 1250,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  assignedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  completionDate: {
    type: Date,
  },
});

export default mongoose.model<ITask>("Task", TaskSchema);
