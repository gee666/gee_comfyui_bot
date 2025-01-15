import { execSync } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

let comfyui_url = process.env.COMFY_UI_URL;
if (comfyui_url.indexOf("PARENT_WINDOWSIP") !== -1) {
  try {
    const windows_ip = execSync("ip route | awk '/^default/{print $3}'", { encoding: "utf-8" }).trim();
    comfyui_url = comfyui_url.replace("PARENT_WINDOWSIP", windows_ip);
  } catch (error) {
    console.error("Failed to get Windows IP address:", error);
  }
}

const config = {
  MODE: process.env.NODE_ENV,
  DEBUG: Boolean(Number(process.env.NODE_DEBUG)),
  COMFY_UI_URL: comfyui_url,
  AXIOS: {
    rejectUnauthorized: Boolean(Number(process.env.AXIOS_TLS_REJECT_UNAUTHORIZED)),
  },
  TELEGRAM_BOTS: {
    thebot: process.env.TELEGRAM_TOCKEN,
  },
  ALLOWED_USERS: JSON.parse(process.env.ALLOWED_USERS),
  DISABLE_CACHE: Boolean(Number(process.env.DISABLE_CACHE)),
};

export default config;
