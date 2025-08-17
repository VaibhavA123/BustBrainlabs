import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

  email: { type: String, unique: true, sparse: true },
  passwordHash: { type: String },

  // airtable oauth
  airtable: {
    access_token: String,
    refresh_token: String,
    token_type: String,
    expires_at: Date, // computed
    scope: String,
    profile: {
      id: String,
      email: String,
      name: String
    }
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
