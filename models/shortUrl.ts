import mongoose from 'mongoose';

const shortUrlSchema = new mongoose.Schema({
  fullurl: {
    type: String,
    required: true
  },
  shorturl: {
    type: String,
    requred: true,
    unique: true
  },
  userId: {
    type: String
  },
  linkpass: {
    type: String
  },
  maxclicks: {
    type: Number
  },
  since: {
    type: Number
  },
  till: {
    type: Number
  },
  clicks: {
    type: Array,
    default: []
  }
});

const ShortUrl =
  mongoose.models.ShortUrl || mongoose.model('ShortUrl', shortUrlSchema);

export default ShortUrl;
