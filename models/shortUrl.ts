import mongoose from 'mongoose';

const shortUrlSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  fullurl: {
    type: String,
    required: true
  },
  shorturl: {
    type: String,
    requred: true,
    unique: true
  },
  guestId: {
    type: String
  },
  creatorIp: {
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
  clicks: [
    {
      date: {
        type: Date,
        default: Date.now
      },
      userdata: {
        browser: String,
        os: String,
        platform: String,
        device: String,
        country: String,
        region: String,
        city: String,
        district: String,
        ip: String
      },
      referrer: {
        type: String
      }
    }
  ]
});

const ShortUrl =
  mongoose.models.ShortUrl || mongoose.model('ShortUrl', shortUrlSchema);

export default ShortUrl;
