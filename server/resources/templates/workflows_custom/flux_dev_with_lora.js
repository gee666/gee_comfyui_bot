import config from "../../../../config";
import crypto from 'crypto';

export const params = {
  title: 'Flux Dev with LoRa',
  description: 'Try the Flux Dev model! Choose from a variety of LoRas for any taste.',
  request_user_for: [
    {
      command: 'model',
      key: 'lora',
      load_models_args: { model_folder: 'loras', filter_path_regex: /^Flux1D.*/ },
      message: 'Choose a LoRa you want to play with. If you don\'t want to use any LoRa, in the next step choose the strength 0',
    },
    {
      command: 'number',
      min: 0,
      max: 1,
      key: 'lora_strength',
      message: 'Choose LoRa strength for your image - write a number from 0 to 1, for example 0.8. The higher the number, the stronger the LoRa. In the lora name there is a hint, which numbers work best with this particular LoRa.',
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
      <code>Art-photo, masterpiece, close-up portrait of a woman with long black hair, deep black eyes, wearing a sexy small yellow summer dress, in a beautiful room with a lot of flowers</code>
      `,
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
    lora = null,
    lora_strength = 0.6,
    ar = 'square',
    prompt = '',
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
    "client_id": client_id,
    "prompt": {
      "8": {
        "inputs": {
          "samples": [
            "13",
            0
          ],
          "vae": [
            "10",
            0
          ]
        },
        "class_type": "VAEDecode",
        "_meta": {
          "title": "VAE Decode"
        }
      },
      "9": {
        "inputs": {
          "filename_prefix": "comfy_bot_flux_unet_basic",
          "images": [
            "8",
            0
          ]
        },
        "class_type": "SaveImage",
        "_meta": {
          "title": "Save Image"
        }
      },
      "10": {
        "inputs": {
          "vae_name": "ae.sft"
        },
        "class_type": "VAELoader",
        "_meta": {
          "title": "Load VAE"
        }
      },
      "11": {
        "inputs": {
          "clip_name1": "SD 3\\t5xxl_fp16.safetensors",
          "clip_name2": "SD 3\\clip_l.safetensors",
          "type": "flux",
          "device": "default"
        },
        "class_type": "DualCLIPLoader",
        "_meta": {
          "title": "DualCLIPLoader"
        }
      },
      "12": {
        "inputs": {
          "unet_name": "flux1-dev.sft",
          "weight_dtype": "default"
        },
        "class_type": "UNETLoader",
        "_meta": {
          "title": "Load Diffusion Model"
        }
      },
      "13": {
        "inputs": {
          "noise": [
            "25",
            0
          ],
          "guider": [
            "22",
            0
          ],
          "sampler": [
            "16",
            0
          ],
          "sigmas": [
            "17",
            0
          ],
          "latent_image": [
            "27",
            0
          ]
        },
        "class_type": "SamplerCustomAdvanced",
        "_meta": {
          "title": "SamplerCustomAdvanced"
        }
      },
      "16": {
        "inputs": {
          "sampler_name": "euler"
        },
        "class_type": "KSamplerSelect",
        "_meta": {
          "title": "KSamplerSelect"
        }
      },
      "17": {
        "inputs": {
          "scheduler": "simple",
          "steps": 20,
          "denoise": 1,
          "model": [
            "74",
            0
          ]
        },
        "class_type": "BasicScheduler",
        "_meta": {
          "title": "BasicScheduler"
        }
      },
      "22": {
        "inputs": {
          "model": [
            "74",
            0
          ],
          "conditioning": [
            "55",
            0
          ]
        },
        "class_type": "BasicGuider",
        "_meta": {
          "title": "BasicGuider"
        }
      },
      "25": {
        "inputs": {
          "noise_seed": seed
        },
        "class_type": "RandomNoise",
        "_meta": {
          "title": "RandomNoise"
        }
      },
      "27": {
        "inputs": {
          "width": width,
          "height": height,
          "batch_size": 1
        },
        "class_type": "EmptySD3LatentImage",
        "_meta": {
          "title": "EmptySD3LatentImage"
        }
      },
      "55": {
        "inputs": {
          "clip_l": prompt,
          "t5xxl": prompt,
          "guidance": [
            "57",
            1
          ],
          "clip": [
            "11",
            0
          ]
        },
        "class_type": "CLIPTextEncodeFlux",
        "_meta": {
          "title": "CLIPTextEncodeFlux"
        }
      },
      "57": {
        "inputs": {
          "value": "2.2"
        },
        "class_type": "SimpleMath+",
        "_meta": {
          "title": "Guidance (CFG)"
        }
      },
      "74": {
        "inputs": {
          "lora_name": lora,
          "strength_model": lora_strength,
          "model": [
            "12",
            0
          ]
        },
        "class_type": "LoraLoaderModelOnly",
        "_meta": {
          "title": "LoraLoaderModelOnly"
        }
      }
    }});

};
