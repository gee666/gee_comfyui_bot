import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const sdmodels_path = path.resolve(__dirname, 'SD_MODELS.json');
const sdmodels = JSON.parse(fs.readFileSync(sdmodels_path, 'utf8'));

const config = {
  MODE: process.env.NODE_ENV,
  DEBUG: Boolean(Number(process.env.NODE_DEBUG)),
  COMFY_UI_URL: process.env.COMFY_UI_URL,
  AXIOS: {
    rejectUnauthorized: Boolean(Number(process.env.AXIOS_TLS_REJECT_UNAUTHORIZED)),
  },
  TELEGRAM_BOTS: {
    thebot: process.env.TELEGRAM_TOCKEN,
  },
  ALLOWED_USERS: JSON.parse(process.env.ALLOWED_USERS),
  DISABLE_CACHE: Boolean(Number(process.env.DISABLE_CACHE)),

  SD_MODELS: sdmodels
};

export default config;
