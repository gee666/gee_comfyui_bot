import config from "../../../../config";
import crypto from 'crypto';

export const params = {
  title: 'Area Composition Horizontal',
  description: 'Here you can compose a horizontal image from 4 different ptompts, one prompt for each area of the image from left to right, this way you can have better control of the image composition, but most interestingly the image looks much more rich and detailed.',
  request_user_for: [
    {
      command: 'model',
      load_models_args: { model_folder: 'checkpoints', base_model: 'sd15', is_inpaint: false },
      key: 'model_base',
      message: '<b>BASE MODEL</b>\n\nChoose a base model. This model will define the primary composition of the image. Evem if you want a realistic image I find it better to use a more artistic or universal model like DreamShaper or RevAnimated, as they are more flexible and easier follow your different promps.',
    },
    {
      command: 'model',
      load_models_args: { model_folder: 'checkpoints', base_model: 'sd15', is_inpaint: false },
      key: 'model_refine',
      message: '<b>REFINE MODEL</b>\n\nChoose a refine model, which will work on the almost ready image, define last fine details and overall image style. Here a realistic model may work very well like Realistic Vision or Reliberate',
    },
    {
      command: 'prompt',
      key: 'prompt',
      message: 'Enter a main prompt, describing the full image. Mention in this prompt everything you want to be on the image in the end.',
    },
    {
      command: 'prompt',
      key: 'negative_prompt',
      message: 'Send me a main negative prompt for the entire image',
    },
    {
      command: 'prompt',
      key: 'prompt1',
      message: 'Give me now the prompt for the left area of the image',
    },
    {
      command: 'prompt',
      key: 'prompt2',
      message: 'Now the prompt for the left-middle area',
    },
    {
      command: 'prompt',
      key: 'prompt3',
      message: 'Time for the right-middle area prompt',
    },
    {
      command: 'prompt',
      key: 'prompt4',
      message: 'And finally the last far right area image prompt',
    },
  ],
};

/**
 *
 * @param {Object} params
 * @param {string} params.model
 * @param {string} params.prompt
 * @param {string} params.negative_prompt
 * @param {string} params.prompt1
 * @param {string} params.prompt2
 * @param {string} params.prompt3
 * @param {string} params.prompt4
 * @param {string} params.client_id
 * @param {number} params.seed
 */
export const make_query_object = (params) => {
  const {
    model_base = "dreamshaper_7.safetensors",
    model_refine = config.SD_MODELS[0].path,
    prompt = '',
    negative_prompt = '',
    prompt1 = '',
    prompt2 = '',
    prompt3 = '',
    prompt4 = '',
    client_id = crypto.randomUUID(),
    seed = Math.floor(Math.random() * 1000000000),
  } = params;


  return ({
    "client_id": client_id,
    "prompt": {
      "1": {
        "inputs": {
          "text": prompt1,
          "clip": ["9", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "2": {
        "inputs": {
          "width": 384,
          "height": 704,
          "x": 0,
          "y": 0,
          "strength": 1,
          "conditioning": ["1", 0]
        },
        "class_type": "ConditioningSetArea"
      },
      "3": {
        "inputs": {
          "text": prompt2,
          "clip": ["9", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "4": {
        "inputs": {
          "width": 384,
          "height": 704,
          "x": 320,
          "y": 0,
          "strength": 1,
          "conditioning": ["3", 0]
        },
        "class_type": "ConditioningSetArea"
      },
      "5": {
        "inputs": {
          "text": prompt3,
          "clip": ["9", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "6": {
        "inputs": {
          "width": 384,
          "height": 704,
          "x": 512,
          "y": 0,
          "strength": 1,
          "conditioning": ["5", 0]
        },
        "class_type": "ConditioningSetArea"
      },
      "7": {
        "inputs": {
          "text": prompt4,
          "clip": ["9", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "8": {
        "inputs": {
          "width": 384,
          "height": 704,
          "x": 704,
          "y": 0,
          "strength": 1,
          "conditioning": ["7", 0]
        },
        "class_type": "ConditioningSetArea"
      },
      "9": {
        "inputs": {
          "config_name": "v1-inference_clip_skip_2.yaml",
          "ckpt_name": model_base
        },
        "class_type": "CheckpointLoader"
      },
      "10": {
        "inputs": {
          "text": prompt,
          "clip": ["9", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "11": {
        "inputs": {
          "text": negative_prompt,
          "clip": ["9", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "12": {
        "inputs": {
          "seed": seed,
          "steps": 20,
          "cfg": 8.5,
          "sampler_name": "dpmpp_sde",
          "scheduler": "normal",
          "denoise": 1,
          "model": ["9", 0],
          "positive": ["17", 0],
          "negative": ["11", 0],
          "latent_image": ["13", 0]
        },
        "class_type": "KSampler"
      },
      "13": {
        "inputs": { "width": 1280, "height": 704, "batch_size": 1 },
        "class_type": "EmptyLatentImage"
      },
      "14": {
        "inputs": { "conditioning_1": ["2", 0], "conditioning_2": ["4", 0] },
        "class_type": "ConditioningCombine"
      },
      "15": {
        "inputs": { "conditioning_1": ["14", 0], "conditioning_2": ["6", 0] },
        "class_type": "ConditioningCombine"
      },
      "16": {
        "inputs": { "conditioning_1": ["8", 0], "conditioning_2": ["10", 0] },
        "class_type": "ConditioningCombine"
      },
      "17": {
        "inputs": { "conditioning_1": ["15", 0], "conditioning_2": ["16", 0] },
        "class_type": "ConditioningCombine"
      },
      "18": {
        "inputs": { "vae_name": "vae-ft-mse-840000-ema-pruned.safetensors" },
        "class_type": "VAELoader"
      },
      "21": {
        "inputs": {
          "text": prompt,
          "clip": ["27", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "22": {
        "inputs": {
          "text": negative_prompt,
          "clip": ["27", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "23": {
        "inputs": {
          "seed": seed,
          "steps": 20,
          "cfg": 7,
          "sampler_name": "dpmpp_2m",
          "scheduler": "simple",
          "denoise": 0.4,
          "model": ["27", 0],
          "positive": ["21", 0],
          "negative": ["22", 0],
          "latent_image": ["30", 0]
        },
        "class_type": "KSampler"
      },
      "25": {
        "inputs": { "samples": ["23", 0], "vae": ["18", 0] },
        "class_type": "VAEDecode"
      },
      "26": {
        "inputs": {
          "filename_prefix": "MAIN - Area Composition - Atlas",
          "images": ["25", 0]
        },
        "class_type": "SaveImage"
      },
      "27": {
        "inputs": {
          "config_name": "v1-inference_clip_skip_2.yaml",
          "ckpt_name": model_refine
        },
        "class_type": "CheckpointLoader"
      },
      "30": {
        "inputs": {
          "upscale_method": "nearest-exact",
          "width": 1920,
          "height": 1088,
          "crop": "disabled",
          "samples": ["12", 0]
        },
        "class_type": "LatentUpscale"
      }
    },
  });

};
