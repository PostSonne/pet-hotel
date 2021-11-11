import { model, Schema, Document } from 'mongoose';
import { SitterService } from '../interfaces/sitter.services.interface';

const sitterServiceSchema: Schema = new Schema({
  url: {
    type: String,
    required: true,
    unique: true,
  },
  method: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
  },
  headers: {
    type: Object,
  },
});

const sitterServiceModel = model<SitterService & Document>('SitterService', sitterServiceSchema);

export default sitterServiceModel;
