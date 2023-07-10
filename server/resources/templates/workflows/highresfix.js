import config from "../../../../config";
import crypto from 'crypto';

/**
 *
 * @param {Object} params
 * @param {string} params.model
 * @param {number} params.width
 * @param {number} params.hight
 * @param {string} params.prompt
 * @param {string} params.negative_prompt
 * @param {string} params.client_id
 * @param {number} params.seed
 */
export const make_query_object = (params) => {
  const {
    model = config.SD_MODELS[0],
    width = 512,
    height = 512,
    prompt = '',
    negative_prompt = '',
    client_id = crypto.randomUUID(),
    seed = Math.floor(Math.random() * 1000000000),
  } = params;


  return ({
    "client_id": client_id,
    "prompt": {
      "3": {
        "inputs": {
          "seed": seed,
          "steps": 40,
          "cfg": 7,
          "sampler_name": "dpmpp_sde",
          "scheduler": "normal",
          "denoise": 1,
          "model": ["4", 0],
          "positive": ["6", 0],
          "negative": ["7", 0],
          "latent_image": ["5", 0]
        },
        "class_type": "KSampler"
      },
      "4": {
        "inputs": { "ckpt_name": model },
        "class_type": "CheckpointLoaderSimple"
      },
      "5": {
        "inputs": { "width": width, "height": height, "batch_size": 1 },
        "class_type": "EmptyLatentImage"
      },
      "6": {
        "inputs": {
          "text": prompt,
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "7": {
        "inputs": {
          "text": negative_prompt,
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "8": {
        "inputs": { "samples": ["3", 0], "vae": ["4", 2] },
        "class_type": "VAEDecode"
      },
      "9": {
        "inputs": { "filename_prefix": "highres", "images": ["15", 0] },
        "class_type": "SaveImage"
      },
      "10": {
        "inputs": { "upscale_model": ["11", 0], "image": ["8", 0] },
        "class_type": "ImageUpscaleWithModel"
      },
      "11": {
        "inputs": { "model_name": "4x-UltraSharp.pth" },
        "class_type": "UpscaleModelLoader"
      },
      "12": {
        "inputs": {
          "seed": seed,
          "steps": 15,
          "cfg": 7,
          "sampler_name": "dpmpp_sde",
          "scheduler": "karras",
          "denoise": 0.4,
          "model": ["4", 0],
          "positive": ["6", 0],
          "negative": ["7", 0],
          "latent_image": ["13", 0]
        },
        "class_type": "KSampler"
      },
      "13": {
        "inputs": { "pixels": ["14", 0], "vae": ["4", 2] },
        "class_type": "VAEEncode"
      },
      "14": {
        "inputs": {
          "upscale_method": "nearest-exact",
          "scale_by": 0.5,
          "image": ["10", 0]
        },
        "class_type": "ImageScaleBy"
      },
      "15": {
        "inputs": { "samples": ["12", 0], "vae": ["4", 2] },
        "class_type": "VAEDecode"
      }
    }
  });

};
