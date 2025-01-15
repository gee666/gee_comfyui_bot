import config from "../../../../config";
import crypto from 'crypto';

export const params = {
  title: 'Basic SDXL workflow',
  description: 'Here you can try the good variaty of SDXL based fine tuned models for every taste.',
  request_user_for: [
    {
      command: 'model',
      key: 'model',
      load_models_args: { model_folder: 'checkpoints', base_model: 'sdxl', is_inpaint: false },
      message: 'Choose a model you want to play with',
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
      message: `Tell me now what you don't want to see (negative prompt). SDXL doesn't reallu like long negative prompts, so try to keep it short and simple. If you don't know, try this one:
      <pre><code>text, watermark</code></pre>
      `
      },
  ]
};

/**
 *
 * @param {Object} params
 * @param {string} params.model
 * @param {string} params.ar
 * @param {string} params.prompt
 * @param {string} params.negative_prompt
 * @param {string} params.client_id
 * @param {number} params.seed
 */
export const make_query_object = (params) => {
  const {
    model = 'sdxl/SDXL.safetensors',
    ar = 'square',
    prompt = '',
    negative_prompt = 'text, watermark',
    client_id = crypto.randomUUID(),
    seed = Math.floor(Math.random() * 1000000000),
  } = params;


  let width = 1024;
  let height = 1024;

  switch (ar) {
    case 'vertical':
      width = 896;
      height = 1152;
      break;
    case 'horizontal':
      width = 1152;
      height = 896;
      break;
  }



  return ({
    "1": {
      "inputs": {
        "ckpt_name": model
      },
      "class_type": "CheckpointLoaderSimple",
      "_meta": {
        "title": "Load Checkpoint"
      }
    },
    "3": {
      "inputs": {
        "width": width,
        "height": height,
        "crop_w": 0,
        "crop_h": 0,
        "target_width": width,
        "target_height": height,
        "text_g": prompt,
        "text_l": prompt,
        "clip": [
          "1",
          1
        ]
      },
      "class_type": "CLIPTextEncodeSDXL",
      "_meta": {
        "title": "CLIPTextEncodeSDXL"
      }
    },
    "5": {
      "inputs": {
        "seed": seed,
        "steps": 25,
        "cfg": 8,
        "sampler_name": "dpmpp_sde",
        "scheduler": "karras",
        "denoise": 1,
        "model": [
          "1",
          0
        ],
        "positive": [
          "3",
          0
        ],
        "negative": [
          "6",
          0
        ],
        "latent_image": [
          "7",
          0
        ]
      },
      "class_type": "KSampler",
      "_meta": {
        "title": "KSampler"
      }
    },
    "6": {
      "inputs": {
        "width": width,
        "height": height,
        "crop_w": 0,
        "crop_h": 0,
        "target_width": width,
        "target_height": height,
        "text_g": negative_prompt,
        "text_l": negative_prompt,
        "clip": [
          "1",
          1
        ]
      },
      "class_type": "CLIPTextEncodeSDXL",
      "_meta": {
        "title": "CLIPTextEncodeSDXL"
      }
    },
    "7": {
      "inputs": {
        "width": width,
        "height": height,
        "batch_size": 1
      },
      "class_type": "EmptyLatentImage",
      "_meta": {
        "title": "Empty Latent Image"
      }
    },
    "8": {
      "inputs": {
        "samples": [
          "5",
          0
        ],
        "vae": [
          "1",
          2
        ]
      },
      "class_type": "VAEDecode",
      "_meta": {
        "title": "VAE Decode"
      }
    },
    "9": {
      "inputs": {
        "filename_prefix": "comfy_bot_sdxl_basic",
        "images": [
          "8",
          0
        ]
      },
      "class_type": "SaveImage",
      "_meta": {
        "title": "Save Image"
      }
    }
  });

};
