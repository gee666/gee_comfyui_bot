import dotenv from 'dotenv';
dotenv.config();


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

  SD_MODELS: [
    'stabilityAI\\v1-5-pruned.ckpt',
    'stabilityAI\\v2-1_512-ema-pruned.ckpt',
    'rpg_V4.safetensors',
    'revAnimated_v122.safetensors',
    'reliberate_v10.safetensors',
    'realisticVisionV30_v30VAE.safetensors',
    'realisticVisionV20_v20.safetensors',
    'icbinpICantBelieveIts_final.safetensors',
    'icbinpICantBelieveIts_afterburn.safetensors',
    'henmixReal_v40.safetensors',
    'f222.safetensors',
    'dreamshaper_7.safetensors',
    'deliberate_v2.safetensors',
    'cyberrealistic_v30.safetensors',
    'analogMadness_v40.safetensors',
  ],
};

export default config;
