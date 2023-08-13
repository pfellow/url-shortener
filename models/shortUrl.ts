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
  clicks: {
    type: [
      {
        date: {
          type: Date,
          default: Date.now
        },
        useragent: {
          type: String
        },
        userdata: {
          country: String,
          regionName: String,
          city: String,
          district: String,
          ip: String
        },
        referrer: {
          type: String
        }
      }
    ],
    default: []
  }
});

const ShortUrl =
  mongoose.models.ShortUrl || mongoose.model('ShortUrl', shortUrlSchema);

export default ShortUrl;
