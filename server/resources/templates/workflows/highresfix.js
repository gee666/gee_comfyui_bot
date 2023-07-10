import config from "../../../../config";
import crypto from 'crypto';

export const params = {
  title: 'HighRes Fix',
  description: 'Here you can try the good variaty of 1.5 based fine tuned models for every taste. This workflow will generate a low resolution picture, then upscale it, so in the end you have a fine detailed picture',
  request_user_for: [
    {
      command: 'model',
      key: 'model',
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
      message: 'Write me the prompt for your masterpiece',
    },
    {
      command: 'prompt',
      key: 'negative_prompt',
      message: "Tell me now what you don't want to see (negative prompt)",
    },
  ]
};

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
    ar = 'square',
    prompt = '',
    negative_prompt = '',
    client_id = crypto.randomUUID(),
    seed = Math.floor(Math.random() * 1000000000),
  } = params;

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
    },
    "extra_data": {
      "extra_pnginfo": {
        "workflow": {
          "last_node_id": 17,
          "last_link_id": 23,
          "nodes": [
            {
              "id": 11,
              "type": "UpscaleModelLoader",
              "pos": [562.0226195656951, 711.9927644851751],
              "size": { "0": 315, "1": 58 },
              "flags": {},
              "order": 0,
              "mode": 0,
              "outputs": [
                {
                  "name": "UPSCALE_MODEL",
                  "type": "UPSCALE_MODEL",
                  "links": [10],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "UpscaleModelLoader" },
              "widgets_values": ["4x-UltraSharp.pth"]
            },
            {
              "id": 14,
              "type": "ImageScaleBy",
              "pos": [903.0226195656933, 708.9927644851751],
              "size": { "0": 315, "1": 82 },
              "flags": {},
              "order": 8,
              "mode": 0,
              "inputs": [{ "name": "image", "type": "IMAGE", "link": 12 }],
              "outputs": [
                {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [13],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "ImageScaleBy" },
              "widgets_values": ["nearest-exact", 0.5]
            },
            {
              "id": 7,
              "type": "CLIPTextEncode",
              "pos": [58, 297],
              "size": { "0": 425.27801513671875, "1": 180.6060791015625 },
              "flags": {},
              "order": 4,
              "mode": 0,
              "inputs": [{ "name": "clip", "type": "CLIP", "link": 5 }],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [6, 17],
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "CLIPTextEncode" },
              "widgets_values": [
                negative_prompt
              ],
              "color": "#322",
              "bgcolor": "#533"
            },
            {
              "id": 3,
              "type": "KSampler",
              "pos": [548, 77],
              "size": { "0": 335.5650634765625, "1": 262 },
              "flags": {},
              "order": 5,
              "mode": 0,
              "inputs": [
                { "name": "model", "type": "MODEL", "link": 1 },
                { "name": "positive", "type": "CONDITIONING", "link": 4 },
                { "name": "negative", "type": "CONDITIONING", "link": 6 },
                { "name": "latent_image", "type": "LATENT", "link": 2 }
              ],
              "outputs": [
                {
                  "name": "LATENT",
                  "type": "LATENT",
                  "links": [7],
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "KSampler" },
              "widgets_values": [
                690987526183768,
                "randomize",
                40,
                7,
                "dpmpp_sde",
                "normal",
                1
              ]
            },
            {
              "id": 10,
              "type": "ImageUpscaleWithModel",
              "pos": [652.1999145507814, 614.9999389648445],
              "size": { "0": 241.79998779296875, "1": 46 },
              "flags": {},
              "order": 7,
              "mode": 0,
              "inputs": [
                { "name": "upscale_model", "type": "UPSCALE_MODEL", "link": 10 },
                { "name": "image", "type": "IMAGE", "link": 11 }
              ],
              "outputs": [
                {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [12],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "ImageUpscaleWithModel" }
            },
            {
              "id": 13,
              "type": "VAEEncode",
              "pos": [944.1999145507814, 617.9999389648445],
              "size": { "0": 210, "1": 46 },
              "flags": {},
              "order": 9,
              "mode": 0,
              "inputs": [
                { "name": "pixels", "type": "IMAGE", "link": 13 },
                { "name": "vae", "type": "VAE", "link": 14 }
              ],
              "outputs": [
                {
                  "name": "LATENT",
                  "type": "LATENT",
                  "links": [18],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "VAEEncode" }
            },
            {
              "id": 15,
              "type": "VAEDecode",
              "pos": [1039, 392],
              "size": { "0": 210, "1": 46 },
              "flags": {},
              "order": 11,
              "mode": 0,
              "inputs": [
                { "name": "samples", "type": "LATENT", "link": 19 },
                { "name": "vae", "type": "VAE", "link": 21 }
              ],
              "outputs": [
                {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [20],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "VAEDecode" }
            },
            {
              "id": 6,
              "type": "CLIPTextEncode",
              "pos": [61, 79],
              "size": { "0": 422.84503173828125, "1": 164.31304931640625 },
              "flags": {},
              "order": 3,
              "mode": 0,
              "inputs": [{ "name": "clip", "type": "CLIP", "link": 3 }],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [4, 16],
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "CLIPTextEncode" },
              "widgets_values": [
                prompt
              ],
              "color": "#232",
              "bgcolor": "#353"
            },
            {
              "id": 8,
              "type": "VAEDecode",
              "pos": [715, 391],
              "size": { "0": 210, "1": 46 },
              "flags": {},
              "order": 6,
              "mode": 0,
              "inputs": [
                { "name": "samples", "type": "LATENT", "link": 7 },
                { "name": "vae", "type": "VAE", "link": 8 }
              ],
              "outputs": [
                {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [11],
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "VAEDecode" }
            },
            {
              "id": 12,
              "type": "KSampler",
              "pos": [914, 74],
              "size": { "0": 315, "1": 262 },
              "flags": {},
              "order": 10,
              "mode": 0,
              "inputs": [
                { "name": "model", "type": "MODEL", "link": 15 },
                { "name": "positive", "type": "CONDITIONING", "link": 16 },
                { "name": "negative", "type": "CONDITIONING", "link": 17 },
                { "name": "latent_image", "type": "LATENT", "link": 18 }
              ],
              "outputs": [
                {
                  "name": "LATENT",
                  "type": "LATENT",
                  "links": [19],
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "KSampler" },
              "widgets_values": [
                925835369165493,
                "randomize",
                15,
                7,
                "dpmpp_sde",
                "karras",
                0.4
              ]
            },
            {
              "id": 4,
              "type": "CheckpointLoaderSimple",
              "pos": [66, 528],
              "size": { "0": 411.48260498046875, "1": 123.60426330566406 },
              "flags": {},
              "order": 1,
              "mode": 0,
              "outputs": [
                {
                  "name": "MODEL",
                  "type": "MODEL",
                  "links": [1, 15],
                  "slot_index": 0
                },
                {
                  "name": "CLIP",
                  "type": "CLIP",
                  "links": [3, 5],
                  "slot_index": 1
                },
                {
                  "name": "VAE",
                  "type": "VAE",
                  "links": [8, 14, 21],
                  "slot_index": 2
                }
              ],
              "properties": { "Node name for S&R": "CheckpointLoaderSimple" },
              "widgets_values": [model]
            },
            {
              "id": 5,
              "type": "EmptyLatentImage",
              "pos": [72, 717],
              "size": { "0": 404.7110595703125, "1": 107.35943603515625 },
              "flags": {},
              "order": 2,
              "mode": 0,
              "outputs": [
                {
                  "name": "LATENT",
                  "type": "LATENT",
                  "links": [2],
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "EmptyLatentImage" },
              "widgets_values": [width, height, 1]
            },
            {
              "id": 9,
              "type": "SaveImage",
              "pos": [1292, 77],
              "size": { "0": 668.30126953125, "1": 735.3182373046875 },
              "flags": {},
              "order": 12,
              "mode": 0,
              "inputs": [{ "name": "images", "type": "IMAGE", "link": 20 }],
              "title": "High Res Save Image",
              "properties": {},
              "widgets_values": ["highres"]
            }
          ],
          "links": [
            [1, 4, 0, 3, 0, "MODEL"],
            [2, 5, 0, 3, 3, "LATENT"],
            [3, 4, 1, 6, 0, "CLIP"],
            [4, 6, 0, 3, 1, "CONDITIONING"],
            [5, 4, 1, 7, 0, "CLIP"],
            [6, 7, 0, 3, 2, "CONDITIONING"],
            [7, 3, 0, 8, 0, "LATENT"],
            [8, 4, 2, 8, 1, "VAE"],
            [10, 11, 0, 10, 0, "UPSCALE_MODEL"],
            [11, 8, 0, 10, 1, "IMAGE"],
            [12, 10, 0, 14, 0, "IMAGE"],
            [13, 14, 0, 13, 0, "IMAGE"],
            [14, 4, 2, 13, 1, "VAE"],
            [15, 4, 0, 12, 0, "MODEL"],
            [16, 6, 0, 12, 1, "CONDITIONING"],
            [17, 7, 0, 12, 2, "CONDITIONING"],
            [18, 13, 0, 12, 3, "LATENT"],
            [19, 12, 0, 15, 0, "LATENT"],
            [20, 15, 0, 9, 0, "IMAGE"],
            [21, 4, 2, 15, 1, "VAE"]
          ],
          "groups": [
            {
              "title": "HiResFix",
              "bounding": [544, 539, 726, 273],
              "color": "#3f789e"
            }
          ],
          "config": {},
          "extra": {},
          "version": 0.4
        }
      }
    }
  });

};
