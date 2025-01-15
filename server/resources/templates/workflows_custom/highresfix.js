import config from "../../../../config";
import crypto from 'crypto';

export const params = {
  title: 'Basic SD 1.5 workflow',
  description: 'Here you can try the good variaty of 1.5 based fine tuned models for every taste. This workflow will generate a low resolution picture, then upscale it, so in the end you have a fine detailed picture',
  request_user_for: [
    {
      command: 'model',
      key: 'model',
      load_models_args: { model_folder: 'checkpoints', base_model: 'sd15', is_inpaint: false },
      message: 'Choose a model you want to play with. If you doubt, start with Photon v1',
    },
    {
      command: 'model',
      key: 'upscale_model',
      load_models_args: { model_folder: 'upscale_models', base_model: null, is_inpaint: null },
      message: 'Choose a model to upscale your image. If you doubt, take 4x-UltraSharp model',
    },
    {
      command: 'ar',
      key: 'ar',
      message: 'Choose aspect ratio for your image',
    },
    {
      command: 'prompt',
      key: 'prompt',
      message: `Write me the prompt for your masterpiece. If you don't know, try this one:
      <pre><code>Art-photo, masterpiece, close-up portrait of a woman with long black hair, deep black eyes, wearing a sexy small yellow summer dress, in a beautiful room with a lot of flowers</code></pre>
      `,
    },
    {
      command: 'prompt',
      key: 'negative_prompt',
      message: `Tell me now what you don't want to see (negative prompt). If you don't know, try this one:
      <pre><code>bad anatomy, bad proportions, disfigured, extra limbs, missing limbs, deformed, extra limbs, poorly drawn face, blurry, low quality, watermark, text, logo, signature</code></pre>
      `
      },
  ]
};

/**
 *
 * @param {Object} params
 * @param {string} params.model
 * @param {string} params.upscale_model
 * @param {number} params.width
 * @param {number} params.hight
 * @param {string} params.prompt
 * @param {string} params.negative_prompt
 * @param {string} params.client_id
 * @param {number} params.seed
 */
export const make_query_object = (params) => {
  const {
    model = 'sd15/sd15.safetensors',
    upscale_model = '4x-UltraSharp.pth',
    ar = 'square',
    prompt = '',
    negative_prompt = 'bad anatomy, bad proportions, deformed, disfigured, extra limbs, missing limbs, poorly drawn face, poorly drawn hands, fused fingers, too many fingers, long neck, blurry, low quality, watermark, text, logo, signature, cropped, out of frame, jpeg artifacts, grainy, low resolution, overexposed, underexposed, oversaturated, undersaturated, bad composition, mutated hands, extra fingers, missing fingers, cloned face, distorted face, ugly, tiling, mutation, morbid, mutilated, deformed body features, poorly rendered hands, poorly rendered face, extra arms, extra legs, fused limbs, malformed limbs, missing arms, missing legs, extra digits, fewer digits, bad art, beginner, amateur, username, distorted, error, low contrast, bad illustration, bad proportions, beyond the borders, blank background, body out of frame, boring background, branding, cut off, dismembered, disproportioned, draft, duplicated features, fault, flaw, grains, hazy, identifying mark, improper scale, incorrect physiology, incorrect ratio, indistinct, kitsch, low resolution, macabre, malformed, mark, misshapen, mistake, morbid, mutilated, off-screen, outside the picture, poorly drawn feet, printed words, render, repellent, replicate, reproduce, revolting dimensions, script, shortened, sign, split image, squint, storyboard, tiling, trimmed, unfocused, unattractive, unnatural pose, unreal engine, unsightly, written language',
    client_id = crypto.randomUUID(),
    seed = Math.floor(Math.random() * 1000000000),
  } = params;

  let scale_by = 1;
  const scaleRegEx = /(?:(\d+)x)|(?:X(\d+))/i;
  const scaleMatch = upscale_model.match(scaleRegEx);
  if (scaleMatch) {
    scale_by = 2 / parseInt(scaleMatch[1]);
  }


  let width = 512;
  let height = 512;

  switch (ar) {
    case 'vertical':
      width = 512;
      height = 768;
      break;
    case 'horizontal':
      width = 768;
      height = 512;
      break;
  }


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
        "inputs": { "model_name": upscale_model },
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
          "upscale_method": "lanczos",
          "scale_by": scale_by,
          "image": ["10", 0]
        },
        "class_type": "ImageScaleBy"
      },
      "15": {
        "inputs": { "samples": ["12", 0], "vae": ["4", 2] },
        "class_type": "VAEDecode"
      }
    },
  });

};
