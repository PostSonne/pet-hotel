import { model, Schema, Document } from 'mongoose';
import { Hotel } from '../interfaces/hotel.interface';

const hotelSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  fullAddress: {
    type: String,
    required: true,
  },
  geo: {
    type: Object,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  description: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  externalId: {
    type: String,
  },
  rating: {
    type: Number,
  },
  reviewsCount: {
    type: Number,
  },
});

const hotelModel = model<Hotel & Document>('Hotel', hotelSchema);

export default hotelModel;
