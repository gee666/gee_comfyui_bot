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
    { "name": "rpg_V4", "path": "1.5 based\\rpg_V4.safetensors" },
    { "name": "revAnimated_v122", "path": "1.5 based\\revAnimated_v122.safetensors" },
    { "name": "reliberate_v10", "path": "1.5 based\\reliberate_v10.safetensors" },
    { "name": "photon_v1", "path": "1.5 based\\photon_v1.safetensors" },
    { "name": "realisticVisionV51_v51VAE", "path": "1.5 based\\realisticVisionV51_v51VAE.safetensors" },
    { "name": "icbinpICantBelieveIts_seco", "path": "1.5 based\\icbinpICantBelieveIts_seco.safetensors" },
    { "name": "icbinpICantBelieveIts_final", "path": "1.5 based\\icbinpICantBelieveIts_final.safetensors" },
    { "name": "icbinpICantBelieveIts_afterburn", "path": "1.5 based\\icbinpICantBelieveIts_afterburn.safetensors" },
    { "name": "henmixReal_v40", "path": "1.5 based\\henmixReal_v40.safetensors" },
    { "name": "dreamshaper_8", "path": "1.5 based\\dreamshaper_8.safetensors" },
    { "name": "deliberate_v3", "path": "1.5 based\\deliberate_v3.safetensors" },
    { "name": "cyberrealistic_v40", "path": "1.5 based\\cyberrealistic_v40.safetensors" },
    { "name": "analogMadness_v60", "path": "1.5 based\\analogMadness_v60.safetensors" },
    { "name": "analogMadness_v70", "path": "1.5 based\\analogMadness_v70.safetensors" },
    { "name": "v1-5", "path": "stabilityAI\\v1-5-pruned.ckpt" },
    { "name": "v2-1", "path": "stabilityAI\\v2-1_512-ema-pruned.ckpt" }
  ]


};

export default config;
