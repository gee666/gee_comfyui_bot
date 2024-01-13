import config from "../../../../config";
import crypto from 'crypto';

export const params = {
  title: 'Area Composition Horizontal',
  description: 'Here you can compose a horizontal image from 4 different ptompts, one prompt for each area of the image from left to right, this way you can have better control of the image composition, but most interestingly the image looks much more rich and detailed.',
  request_user_for: [
    {
      command: 'model',
      key: 'model_base',
      message: '<b>BASE MODEL</b>\n\nChoose a base model. This model will define the primary composition of the image. Evem if you want a realistic image I find it better to use a more artistic or universal model like DreamShaper or RevAnimated, as they are more flexible and easier follow your different promps.',
    },
    {
      command: 'model',
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
        "inputs": { "vae_name": "vae-ft-mse-840000-ema-pruned.ckpt" },
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
    "extra_data": {
      "extra_pnginfo": {
        "workflow": {
          "last_node_id": 30,
          "last_link_id": 46,
          "nodes": [
            {
              "id": 3,
              "type": "CLIPTextEncode",
              "pos": [-812.4973481399987, 385.41009769999977],
              "size": { "0": 446.56036376953125, "1": 154.70550537109375 },
              "flags": {},
              "order": 9,
              "mode": 0,
              "inputs": [{ "name": "clip", "type": "CLIP", "link": 8 }],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [2],
                  "slot_index": 0
                }
              ],
              "title": "MID-LEFT - 2/4 : Prompt",
              "properties": { "Node name for S&R": "CLIPTextEncode" },
              "widgets_values": [
                prompt2
              ],
              "color": "#322",
              "bgcolor": "#533"
            },
            {
              "id": 5,
              "type": "CLIPTextEncode",
              "pos": [-814.4973481399987, 597.4100976999994],
              "size": { "0": 446.56036376953125, "1": 154.70550537109375 },
              "flags": {},
              "order": 10,
              "mode": 0,
              "inputs": [
                { "name": "clip", "type": "CLIP", "link": 9, "slot_index": 0 }
              ],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [3],
                  "slot_index": 0
                }
              ],
              "title": "MID-RIGHT 3/4 : Prompt",
              "properties": { "Node name for S&R": "CLIPTextEncode" },
              "widgets_values": [
                prompt3
              ],
              "color": "#322",
              "bgcolor": "#533"
            },
            {
              "id": 7,
              "type": "CLIPTextEncode",
              "pos": [-814.4973481399987, 808.4100976999985],
              "size": { "0": 446.56036376953125, "1": 154.70550537109375 },
              "flags": {},
              "order": 8,
              "mode": 0,
              "inputs": [{ "name": "clip", "type": "CLIP", "link": 7 }],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [4],
                  "slot_index": 0
                }
              ],
              "title": "RIGHT 4/4 : Prompt",
              "properties": { "Node name for S&R": "CLIPTextEncode" },
              "widgets_values": [
                prompt4
              ],
              "color": "#322",
              "bgcolor": "#533"
            },
            {
              "id": 1,
              "type": "CLIPTextEncode",
              "pos": [-805, 179],
              "size": { "0": 446.56036376953125, "1": 154.70550537109375 },
              "flags": {},
              "order": 11,
              "mode": 0,
              "inputs": [
                { "name": "clip", "type": "CLIP", "link": 10, "slot_index": 0 }
              ],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [1],
                  "slot_index": 0
                }
              ],
              "title": "LEFT - 1/4 : Prompt",
              "properties": { "Node name for S&R": "CLIPTextEncode" },
              "widgets_values": [
                prompt1
              ],
              "color": "#322",
              "bgcolor": "#533"
            },
            {
              "id": 10,
              "type": "CLIPTextEncode",
              "pos": [-822, 1029],
              "size": { "0": 444.1192932128906, "1": 182.81419372558594 },
              "flags": {},
              "order": 6,
              "mode": 0,
              "inputs": [{ "name": "clip", "type": "CLIP", "link": 5 }],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [25],
                  "slot_index": 0
                }
              ],
              "title": "Prompt - Main",
              "properties": { "Node name for S&R": "CLIPTextEncode" },
              "widgets_values": [
                prompt
              ],
              "color": "#432",
              "bgcolor": "#653"
            },
            {
              "id": 14,
              "type": "ConditioningCombine",
              "pos": [-8, 278],
              "size": { "0": 342.5999755859375, "1": 46 },
              "flags": {},
              "order": 17,
              "mode": 0,
              "inputs": [
                { "name": "conditioning_1", "type": "CONDITIONING", "link": 14 },
                {
                  "name": "conditioning_2",
                  "type": "CONDITIONING",
                  "link": 15,
                  "slot_index": 1
                }
              ],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [16],
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "ConditioningCombine" },
              "color": "#322",
              "bgcolor": "#533"
            },
            {
              "id": 15,
              "type": "ConditioningCombine",
              "pos": [367, 580],
              "size": { "0": 342.5999755859375, "1": 46 },
              "flags": {},
              "order": 18,
              "mode": 0,
              "inputs": [
                { "name": "conditioning_1", "type": "CONDITIONING", "link": 16 },
                { "name": "conditioning_2", "type": "CONDITIONING", "link": 17 }
              ],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [24],
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "ConditioningCombine" },
              "color": "#322",
              "bgcolor": "#533"
            },
            {
              "id": 16,
              "type": "ConditioningCombine",
              "pos": [199, 803],
              "size": { "0": 342.5999755859375, "1": 46 },
              "flags": {},
              "order": 16,
              "mode": 0,
              "inputs": [
                {
                  "name": "conditioning_1",
                  "type": "CONDITIONING",
                  "link": 22,
                  "slot_index": 0
                },
                {
                  "name": "conditioning_2",
                  "type": "CONDITIONING",
                  "link": 25,
                  "slot_index": 1
                }
              ],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [26],
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "ConditioningCombine" },
              "color": "#322",
              "bgcolor": "#533"
            },
            {
              "id": 11,
              "type": "CLIPTextEncode",
              "pos": [-820, 1430],
              "size": { "0": 444.36114501953125, "1": 185.03204345703125 },
              "flags": {},
              "order": 7,
              "mode": 0,
              "inputs": [{ "name": "clip", "type": "CLIP", "link": 6 }],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [12],
                  "slot_index": 0
                }
              ],
              "title": "Negative Prompt - Main",
              "properties": { "Node name for S&R": "CLIPTextEncode" },
              "widgets_values": [
                negative_prompt
              ],
              "color": "#432",
              "bgcolor": "#653"
            },
            {
              "id": 2,
              "type": "ConditioningSetArea",
              "pos": [-346, 179],
              "size": { "0": 317.4000244140625, "1": 154 },
              "flags": {},
              "order": 15,
              "mode": 0,
              "inputs": [
                { "name": "conditioning", "type": "CONDITIONING", "link": 1 }
              ],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [14],
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "ConditioningSetArea" },
              "widgets_values": [384, 704, 0, 0, 1],
              "color": "#322",
              "bgcolor": "#533"
            },
            {
              "id": 4,
              "type": "ConditioningSetArea",
              "pos": [-349, 386],
              "size": { "0": 317.4000244140625, "1": 154 },
              "flags": {},
              "order": 13,
              "mode": 0,
              "inputs": [
                {
                  "name": "conditioning",
                  "type": "CONDITIONING",
                  "link": 2,
                  "slot_index": 0
                }
              ],
              "outputs": [
                { "name": "CONDITIONING", "type": "CONDITIONING", "links": [15] }
              ],
              "properties": { "Node name for S&R": "ConditioningSetArea" },
              "widgets_values": [384, 704, 320, 0, 1],
              "color": "#322",
              "bgcolor": "#533"
            },
            {
              "id": 6,
              "type": "ConditioningSetArea",
              "pos": [-354, 599],
              "size": { "0": 317.4000244140625, "1": 154 },
              "flags": {},
              "order": 14,
              "mode": 0,
              "inputs": [
                { "name": "conditioning", "type": "CONDITIONING", "link": 3 }
              ],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [17],
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "ConditioningSetArea" },
              "widgets_values": [384, 704, 512, 0, 1],
              "color": "#322",
              "bgcolor": "#533"
            },
            {
              "id": 8,
              "type": "ConditioningSetArea",
              "pos": [-357, 810],
              "size": { "0": 317.4000244140625, "1": 154 },
              "flags": {},
              "order": 12,
              "mode": 0,
              "inputs": [
                {
                  "name": "conditioning",
                  "type": "CONDITIONING",
                  "link": 4,
                  "slot_index": 0
                }
              ],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [22],
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "ConditioningSetArea" },
              "widgets_values": [384, 704, 704, 0, 1],
              "color": "#322",
              "bgcolor": "#533"
            },
            {
              "id": 21,
              "type": "CLIPTextEncode",
              "pos": [523, -92],
              "size": { "0": 444.1192932128906, "1": 182.81419372558594 },
              "flags": {},
              "order": 4,
              "mode": 0,
              "inputs": [{ "name": "clip", "type": "CLIP", "link": 39 }],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [31],
                  "slot_index": 0
                }
              ],
              "title": "Prompt - Final",
              "properties": { "Node name for S&R": "CLIPTextEncode" },
              "widgets_values": [
                prompt
              ],
              "color": "#232",
              "bgcolor": "#353"
            },
            {
              "id": 22,
              "type": "CLIPTextEncode",
              "pos": [518, 190],
              "size": { "0": 444.36114501953125, "1": 185.03204345703125 },
              "flags": {},
              "order": 5,
              "mode": 0,
              "inputs": [
                { "name": "clip", "type": "CLIP", "link": 40, "slot_index": 0 }
              ],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [32],
                  "slot_index": 0
                }
              ],
              "title": "Negative Prompt - Final",
              "properties": { "Node name for S&R": "CLIPTextEncode" },
              "widgets_values": [
                negative_prompt
              ],
              "color": "#232",
              "bgcolor": "#353"
            },
            {
              "id": 27,
              "type": "CheckpointLoader",
              "pos": [8, -263],
              "size": { "0": 315, "1": 122 },
              "flags": {},
              "order": 0,
              "mode": 0,
              "outputs": [
                {
                  "name": "MODEL",
                  "type": "MODEL",
                  "links": [38],
                  "slot_index": 0
                },
                {
                  "name": "CLIP",
                  "type": "CLIP",
                  "links": [39, 40],
                  "slot_index": 1
                },
                { "name": "VAE", "type": "VAE", "links": null }
              ],
              "properties": { "Node name for S&R": "CheckpointLoader" },
              "widgets_values": [
                "v1-inference_clip_skip_2.yaml",
                model_refine
              ],
              "color": "#232",
              "bgcolor": "#353"
            },
            {
              "id": 17,
              "type": "ConditioningCombine",
              "pos": [674, 796],
              "size": { "0": 342.5999755859375, "1": 46 },
              "flags": {},
              "order": 19,
              "mode": 0,
              "inputs": [
                { "name": "conditioning_1", "type": "CONDITIONING", "link": 24 },
                { "name": "conditioning_2", "type": "CONDITIONING", "link": 26 }
              ],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [27],
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "ConditioningCombine" },
              "color": "#322",
              "bgcolor": "#533"
            },
            {
              "id": 13,
              "type": "EmptyLatentImage",
              "pos": [385, 1291],
              "size": { "0": 315, "1": 106 },
              "flags": {},
              "order": 1,
              "mode": 0,
              "outputs": [{ "name": "LATENT", "type": "LATENT", "links": [13] }],
              "properties": { "Node name for S&R": "EmptyLatentImage" },
              "widgets_values": [1280, 704, 1],
              "color": "#432",
              "bgcolor": "#653"
            },
            {
              "id": 18,
              "type": "VAELoader",
              "pos": [918, 1356],
              "size": { "0": 339.6770935058594, "1": 58 },
              "flags": {},
              "order": 2,
              "mode": 0,
              "outputs": [
                { "name": "VAE", "type": "VAE", "links": [36], "slot_index": 0 }
              ],
              "properties": { "Node name for S&R": "VAELoader" },
              "widgets_values": ["vae-ft-mse-840000-ema-pruned.ckpt"],
              "color": "#432",
              "bgcolor": "#653"
            },
            {
              "id": 26,
              "type": "SaveImage",
              "pos": [1619, 599],
              "size": [1982.5354379453129, 1167.3952913574221],
              "flags": {},
              "order": 24,
              "mode": 0,
              "inputs": [
                { "name": "images", "type": "IMAGE", "link": 46, "slot_index": 0 }
              ],
              "title": "MAIN - Area Composition",
              "properties": {},
              "widgets_values": ["MAIN - Area Composition - Atlas"],
              "color": "#232",
              "bgcolor": "#353"
            },
            {
              "id": 12,
              "type": "KSampler",
              "pos": [911, 977],
              "size": { "0": 316.89642333984375, "1": 262 },
              "flags": { "collapsed": false },
              "order": 20,
              "mode": 0,
              "inputs": [
                { "name": "model", "type": "MODEL", "link": 11, "slot_index": 0 },
                { "name": "positive", "type": "CONDITIONING", "link": 27 },
                { "name": "negative", "type": "CONDITIONING", "link": 12 },
                {
                  "name": "latent_image",
                  "type": "LATENT",
                  "link": 13,
                  "slot_index": 3
                }
              ],
              "outputs": [
                {
                  "name": "LATENT",
                  "type": "LATENT",
                  "links": [44],
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "KSampler" },
              "widgets_values": [
                914392068593733,
                "randomize",
                20,
                8.5,
                "dpmpp_sde",
                "normal",
                1
              ],
              "color": "#432",
              "bgcolor": "#653"
            },
            {
              "id": 30,
              "type": "LatentUpscale",
              "pos": [997, 378],
              "size": { "0": 315, "1": 130 },
              "flags": {},
              "order": 21,
              "mode": 0,
              "inputs": [{ "name": "samples", "type": "LATENT", "link": 44 }],
              "outputs": [
                {
                  "name": "LATENT",
                  "type": "LATENT",
                  "links": [45],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "LatentUpscale" },
              "widgets_values": ["nearest-exact", 1920, 1088, "disabled"]
            },
            {
              "id": 25,
              "type": "VAEDecode",
              "pos": [1336, 212],
              "size": { "0": 342.2445983886719, "1": 60.61756134033203 },
              "flags": {},
              "order": 23,
              "mode": 0,
              "inputs": [
                { "name": "samples", "type": "LATENT", "link": 35 },
                { "name": "vae", "type": "VAE", "link": 36 }
              ],
              "outputs": [
                {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [46],
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "VAEDecode" },
              "color": "#232",
              "bgcolor": "#353"
            },
            {
              "id": 9,
              "type": "CheckpointLoader",
              "pos": [-1458, 1401],
              "size": { "0": 315, "1": 122 },
              "flags": {},
              "order": 3,
              "mode": 0,
              "outputs": [
                {
                  "name": "MODEL",
                  "type": "MODEL",
                  "links": [11],
                  "slot_index": 0
                },
                {
                  "name": "CLIP",
                  "type": "CLIP",
                  "links": [5, 6, 7, 8, 9, 10],
                  "slot_index": 1
                },
                { "name": "VAE", "type": "VAE", "links": null }
              ],
              "properties": { "Node name for S&R": "CheckpointLoader" },
              "widgets_values": [
                "v1-inference_clip_skip_2.yaml",
                model_base
              ],
              "color": "#432",
              "bgcolor": "#653"
            },
            {
              "id": 23,
              "type": "KSampler",
              "pos": [1096, -164],
              "size": { "0": 318.0801086425781, "1": 262 },
              "flags": {},
              "order": 22,
              "mode": 0,
              "inputs": [
                { "name": "model", "type": "MODEL", "link": 38 },
                { "name": "positive", "type": "CONDITIONING", "link": 31 },
                { "name": "negative", "type": "CONDITIONING", "link": 32 },
                { "name": "latent_image", "type": "LATENT", "link": 45 }
              ],
              "outputs": [
                {
                  "name": "LATENT",
                  "type": "LATENT",
                  "links": [35],
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "KSampler" },
              "widgets_values": [
                386370727581338,
                "randomize",
                20,
                7,
                "dpmpp_2m",
                "simple",
                0.4
              ],
              "color": "#232",
              "bgcolor": "#353"
            }
          ],
          "links": [
            [1, 1, 0, 2, 0, "CONDITIONING"],
            [2, 3, 0, 4, 0, "CONDITIONING"],
            [3, 5, 0, 6, 0, "CONDITIONING"],
            [4, 7, 0, 8, 0, "CONDITIONING"],
            [5, 9, 1, 10, 0, "CLIP"],
            [6, 9, 1, 11, 0, "CLIP"],
            [7, 9, 1, 7, 0, "CLIP"],
            [8, 9, 1, 3, 0, "CLIP"],
            [9, 9, 1, 5, 0, "CLIP"],
            [10, 9, 1, 1, 0, "CLIP"],
            [11, 9, 0, 12, 0, "MODEL"],
            [12, 11, 0, 12, 2, "CONDITIONING"],
            [13, 13, 0, 12, 3, "LATENT"],
            [14, 2, 0, 14, 0, "CONDITIONING"],
            [15, 4, 0, 14, 1, "CONDITIONING"],
            [16, 14, 0, 15, 0, "CONDITIONING"],
            [17, 6, 0, 15, 1, "CONDITIONING"],
            [22, 8, 0, 16, 0, "CONDITIONING"],
            [24, 15, 0, 17, 0, "CONDITIONING"],
            [25, 10, 0, 16, 1, "CONDITIONING"],
            [26, 16, 0, 17, 1, "CONDITIONING"],
            [27, 17, 0, 12, 1, "CONDITIONING"],
            [31, 21, 0, 23, 1, "CONDITIONING"],
            [32, 22, 0, 23, 2, "CONDITIONING"],
            [35, 23, 0, 25, 0, "LATENT"],
            [36, 18, 0, 25, 1, "VAE"],
            [38, 27, 0, 23, 0, "MODEL"],
            [39, 27, 1, 21, 0, "CLIP"],
            [40, 27, 1, 22, 0, "CLIP"],
            [44, 12, 0, 30, 0, "LATENT"],
            [45, 30, 0, 23, 3, "LATENT"],
            [46, 25, 0, 26, 0, "IMAGE"]
          ],
          "groups": [],
          "config": {},
          "extra": {},
          "version": 0.4
        }
      }
    }
  });

};
