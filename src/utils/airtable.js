import axios from 'axios';
import dayjs from 'dayjs';
import User from '../models/User.js';

const TOKEN_URL = 'https://airtable.com/oauth2/v1/token';

export async function ensureFreshToken(user) {
  if (!user?.airtable?.access_token) throw new Error('User has no Airtable token');

  const exp = user.airtable.expires_at ? dayjs(user.airtable.expires_at) : null;
  if (exp && exp.isAfter(dayjs().add(60, 'second'))) return user.airtable.access_token;

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: user.airtable.refresh_token,
    client_id: process.env.AIRTABLE_CLIENT_ID,
    client_secret: process.env.AIRTABLE_CLIENT_SECRET,
  });

  const { data } = await axios.post(TOKEN_URL, body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  user.airtable.access_token = data.access_token;
  user.airtable.refresh_token = data.refresh_token ?? user.airtable.refresh_token;
  user.airtable.token_type = data.token_type;
  user.airtable.scope = data.scope;
  user.airtable.expires_at = new Date(Date.now() + data.expires_in * 1000);
  await user.save();

  return user.airtable.access_token;
}

export function airtableClient(token) {
  return axios.create({
    baseURL: 'https://api.airtable.com/v0',
    headers: { Authorization: `Bearer ${token}` }
  });
}

const SUPPORTED = new Set(['singleLineText', 'multilineText', 'singleSelect', 'multipleSelects', 'multipleAttachments']);
export function isSupportedField(t) {
  return SUPPORTED.has(t);
}