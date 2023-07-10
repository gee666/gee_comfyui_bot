import config from "../../../../config";
import crypto from 'crypto';

export const params = {
  title: 'SD XL 0.9',
  description: 'Play with early bare SD XL 0.9 model',
  request_user_for: [
    'ar',
    'prompt',
    'negative_prompt',
  ]
};

/**
 *
 * @param {Object} params
 * @param {number} params.width
 * @param {number} params.hight
 * @param {string} params.prompt
 * @param {string} params.negative_prompt
 * @param {string} params.client_id
 * @param {number} params.seed
 */
export const make_query_object = (params) => {
  const {
    ar = 'square',
    prompt = '',
    negative_prompt = '',
    client_id = crypto.randomUUID(),
    seed = Math.floor(Math.random() * 1000000000),
  } = params;


  let width = 1024;
  let height = 1024;

  switch (ar) {
    case 'vertical':
      width = 768;
      height = 1128;
      break;
    case 'horizontal':
      width = 1128;
      height = 768;
      break;
  }

  return ({
    "client_id": client_id,
    "prompt": {
      "4": {
        "inputs": { "ckpt_name": "stabilityAI\\sd_xl_base_0.9.safetensors" },
        "class_type": "CheckpointLoaderSimple"
      },
      "5": {
        "inputs": { "width": width, "height": height, "batch_size": 1 },
        "class_type": "EmptyLatentImage"
      },
      "11": {
        "inputs": { "ckpt_name": "stabilityAI\\sd_xl_refiner_0.9.safetensors" },
        "class_type": "CheckpointLoaderSimple"
      },
      "50": {
        "inputs": {
          "width": 3072,
          "height": 4096,
          "crop_w": 0,
          "crop_h": 0,
          "target_width": 768,
          "target_height": 1024,
          "text_g": prompt,
          "text_l": prompt,
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncodeSDXL"
      },
      "65": {
        "inputs": {
          "width": 3072,
          "height": 4096,
          "crop_w": 0,
          "crop_h": 0,
          "target_width": 768,
          "target_height": 1024,
          "text_g": negative_prompt,
          "text_l": negative_prompt,
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncodeSDXL"
      },
      "70": {
        "inputs": {
          "ascore": 6,
          "width": 3072,
          "height": 4096,
          "text": prompt,
          "clip": ["11", 1]
        },
        "class_type": "CLIPTextEncodeSDXLRefiner"
      },
      "71": {
        "inputs": {
          "ascore": 6,
          "width": 3072,
          "height": 4096,
          "text": negative_prompt,
          "clip": ["11", 1]
        },
        "class_type": "CLIPTextEncodeSDXLRefiner"
      },
      "139": {
        "inputs": {
          "add_noise": "enable",
          "noise_seed": seed,
          "steps": 20,
          "cfg": 8,
          "sampler_name": "euler",
          "scheduler": "normal",
          "start_at_step": 0,
          "end_at_step": 12,
          "return_with_leftover_noise": "enable",
          "model": ["4", 0],
          "positive": ["50", 0],
          "negative": ["65", 0],
          "latent_image": ["5", 0]
        },
        "class_type": "KSamplerAdvanced"
      },
      "142": {
        "inputs": {
          "add_noise": "disable",
          "noise_seed": seed,
          "steps": 20,
          "cfg": 8,
          "sampler_name": "euler",
          "scheduler": "normal",
          "start_at_step": 12,
          "end_at_step": 1000,
          "return_with_leftover_noise": "disable",
          "model": ["11", 0],
          "positive": ["70", 0],
          "negative": ["71", 0],
          "latent_image": ["139", 0]
        },
        "class_type": "KSamplerAdvanced"
      },
      "146": {
        "inputs": { "samples": ["142", 0], "vae": ["11", 2] },
        "class_type": "VAEDecode"
      },
      "182": {
        "inputs": { "filename_prefix": "ComfyUI", "images": ["146", 0] },
        "class_type": "SaveImage"
      }
    },
    "extra_data": {
      "extra_pnginfo": {
        "workflow": {
          "last_node_id": 182,
          "last_link_id": 277,
          "nodes": [
            {
              "id": 61,
              "type": "Reroute",
              "pos": [296.74521962890657, -139.64623145263693],
              "size": [75, 26],
              "flags": {},
              "order": 12,
              "mode": 0,
              "inputs": [
                { "name": "", "type": "*", "link": 154, "slot_index": 0 }
              ],
              "outputs": [
                {
                  "name": "",
                  "type": "CLIP",
                  "links": [93, 126],
                  "slot_index": 0
                }
              ],
              "properties": { "showOutputText": false, "horizontal": false }
            },
            {
              "id": 39,
              "type": "Reroute",
              "pos": [307.4488777871096, -545.0383872500009],
              "size": [75, 26],
              "flags": {},
              "order": 10,
              "mode": 0,
              "inputs": [{ "name": "", "type": "*", "link": 65 }],
              "outputs": [
                { "name": "", "type": "VAE", "links": [130], "slot_index": 0 }
              ],
              "properties": { "showOutputText": false, "horizontal": false }
            },
            {
              "id": 31,
              "type": "Reroute",
              "pos": [299.74521962890657, -228.646231452637],
              "size": [75, 26],
              "flags": {},
              "order": 11,
              "mode": 0,
              "inputs": [
                { "name": "", "type": "*", "link": 153, "slot_index": 0 }
              ],
              "outputs": [
                { "name": "", "type": "MODEL", "links": [227], "slot_index": 0 }
              ],
              "properties": { "showOutputText": false, "horizontal": false }
            },
            {
              "id": 157,
              "type": "Reroute",
              "pos": [303, 440],
              "size": [75, 26],
              "flags": {},
              "order": 7,
              "mode": 0,
              "inputs": [{ "name": "", "type": "*", "link": 230 }],
              "outputs": [
                { "name": "", "type": "LATENT", "links": [231], "slot_index": 0 }
              ],
              "properties": { "showOutputText": false, "horizontal": false }
            },
            {
              "id": 158,
              "type": "Reroute",
              "pos": [620, 439],
              "size": [75, 26],
              "flags": {},
              "order": 13,
              "mode": 0,
              "inputs": [{ "name": "", "type": "*", "link": 231 }],
              "outputs": [
                { "name": "", "type": "LATENT", "links": [232], "slot_index": 0 }
              ],
              "properties": { "showOutputText": false, "horizontal": false }
            },
            {
              "id": 5,
              "type": "EmptyLatentImage",
              "pos": [-321.6479746093749, 263.95654614257796],
              "size": { "0": 455.73504638671875, "1": 106 },
              "flags": {},
              "order": 0,
              "mode": 0,
              "inputs": [],
              "outputs": [
                {
                  "name": "LATENT",
                  "type": "LATENT",
                  "links": [230],
                  "slot_index": 0
                }
              ],
              "title": "Image and batch size",
              "properties": { "Node name for S&R": "EmptyLatentImage" },
              "widgets_values": [width, height, 1]
            },
            {
              "id": 38,
              "type": "Reroute",
              "pos": [298.4488777871096, -953.0383872500028],
              "size": [75, 26],
              "flags": {},
              "order": 8,
              "mode": 0,
              "inputs": [{ "name": "", "type": "*", "link": 61 }],
              "outputs": [
                { "name": "", "type": "MODEL", "links": [207], "slot_index": 0 }
              ],
              "properties": { "showOutputText": false, "horizontal": false }
            },
            {
              "id": 40,
              "type": "Reroute",
              "pos": [1092, -528],
              "size": [75, 26],
              "flags": {},
              "order": 16,
              "mode": 0,
              "inputs": [
                { "name": "", "type": "*", "link": 130, "slot_index": 0 }
              ],
              "outputs": [
                { "name": "", "type": "VAE", "links": [222], "slot_index": 0 }
              ],
              "properties": { "showOutputText": false, "horizontal": false }
            },
            {
              "id": 73,
              "type": "Reroute",
              "pos": [295.4488777871096, -883.0383872500029],
              "size": [75, 26],
              "flags": {},
              "order": 9,
              "mode": 0,
              "inputs": [{ "name": "", "type": "*", "link": 129 }],
              "outputs": [
                {
                  "name": "",
                  "type": "CLIP",
                  "links": [127, 128],
                  "slot_index": 0
                }
              ],
              "properties": { "showOutputText": false, "horizontal": false }
            },
            {
              "id": 71,
              "type": "CLIPTextEncodeSDXLRefiner",
              "pos": [440, -700],
              "size": { "0": 232.16049194335938, "1": 135.14903259277344 },
              "flags": {},
              "order": 15,
              "mode": 0,
              "inputs": [
                { "name": "clip", "type": "CLIP", "link": 128 },
                {
                  "name": "text",
                  "type": "STRING",
                  "link": 120,
                  "widget": {
                    "name": "text",
                    "config": ["STRING", { "multiline": true }]
                  }
                }
              ],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [209],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "CLIPTextEncodeSDXLRefiner" },
              "widgets_values": [
                6,
                3072,
                4096,
                negative_prompt
              ]
            },
            {
              "id": 70,
              "type": "CLIPTextEncodeSDXLRefiner",
              "pos": [447, -888],
              "size": { "0": 242.90916442871094, "1": 126 },
              "flags": {},
              "order": 14,
              "mode": 0,
              "inputs": [
                { "name": "clip", "type": "CLIP", "link": 127 },
                {
                  "name": "text",
                  "type": "STRING",
                  "link": 116,
                  "widget": {
                    "name": "text",
                    "config": ["STRING", { "multiline": true }]
                  }
                }
              ],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [241],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "CLIPTextEncodeSDXLRefiner" },
              "widgets_values": [
                6,
                3072,
                4096,
                prompt
              ]
            },
            {
              "id": 16,
              "type": "PrimitiveNode",
              "pos": [-298, -73],
              "size": { "0": 434.15277099609375, "1": 152.36099243164062 },
              "flags": {},
              "order": 1,
              "mode": 0,
              "outputs": [
                {
                  "name": "STRING",
                  "type": "STRING",
                  "links": [120, 139, 146],
                  "slot_index": 0,
                  "widget": {
                    "name": "text",
                    "config": ["STRING", { "multiline": true }]
                  }
                }
              ],
              "title": "Negative Prompt",
              "properties": {},
              "widgets_values": [
                negative_prompt
              ],
              "color": "#322",
              "bgcolor": "#533"
            },
            {
              "id": 152,
              "type": "PrimitiveNode",
              "pos": [-323.6479746093749, 135.9565461425784],
              "size": { "0": 210, "1": 82 },
              "flags": {},
              "order": 2,
              "mode": 0,
              "outputs": [
                {
                  "name": "INT",
                  "type": "INT",
                  "links": [225, 226],
                  "slot_index": 0,
                  "widget": {
                    "name": "steps",
                    "config": ["INT", { "default": 20, "min": 1, "max": 10000 }]
                  }
                }
              ],
              "title": "Total Steps",
              "properties": {},
              "widgets_values": [20, "fixed"]
            },
            {
              "id": 142,
              "type": "KSamplerAdvanced",
              "pos": [780, -940],
              "size": { "0": 315, "1": 334 },
              "flags": {},
              "order": 21,
              "mode": 0,
              "inputs": [
                { "name": "model", "type": "MODEL", "link": 207 },
                { "name": "positive", "type": "CONDITIONING", "link": 241 },
                { "name": "negative", "type": "CONDITIONING", "link": 209 },
                { "name": "latent_image", "type": "LATENT", "link": 224 },
                {
                  "name": "steps",
                  "type": "INT",
                  "link": 226,
                  "widget": {
                    "name": "steps",
                    "config": ["INT", { "default": 20, "min": 1, "max": 10000 }]
                  }
                },
                {
                  "name": "start_at_step",
                  "type": "INT",
                  "link": 229,
                  "widget": {
                    "name": "start_at_step",
                    "config": ["INT", { "default": 0, "min": 0, "max": 10000 }]
                  }
                }
              ],
              "outputs": [
                {
                  "name": "LATENT",
                  "type": "LATENT",
                  "links": [217],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "KSamplerAdvanced" },
              "widgets_values": [
                "disable",
                seed,
                "fixed",
                20,
                8,
                "euler",
                "normal",
                12,
                1000,
                "disable"
              ]
            },
            {
              "id": 15,
              "type": "PrimitiveNode",
              "pos": [-325, -304],
              "size": { "0": 431.4493408203125, "1": 188.83541870117188 },
              "flags": {},
              "order": 3,
              "mode": 0,
              "outputs": [
                {
                  "name": "STRING",
                  "type": "STRING",
                  "links": [116, 183, 184],
                  "widget": {
                    "name": "text",
                    "config": ["STRING", { "multiline": true }]
                  },
                  "slot_index": 0
                }
              ],
              "title": "Positive Prompt",
              "properties": {},
              "widgets_values": [
                prompt
              ],
              "color": "#232",
              "bgcolor": "#353"
            },
            {
              "id": 155,
              "type": "PrimitiveNode",
              "pos": [-73.64797460937497, 137.95654614257836],
              "size": { "0": 210, "1": 82 },
              "flags": {},
              "order": 4,
              "mode": 0,
              "outputs": [
                {
                  "name": "INT",
                  "type": "INT",
                  "links": [228, 229],
                  "slot_index": 0,
                  "widget": {
                    "name": "end_at_step",
                    "config": [
                      "INT",
                      { "default": 10000, "min": 0, "max": 10000 }
                    ]
                  }
                }
              ],
              "title": "Steps On Base Model",
              "properties": {},
              "widgets_values": [12, "fixed"]
            },
            {
              "id": 11,
              "type": "CheckpointLoaderSimple",
              "pos": [-261.23625561523403, -757.4411538085951],
              "size": { "0": 384.4734802246094, "1": 98 },
              "flags": {},
              "order": 5,
              "mode": 0,
              "outputs": [
                {
                  "name": "MODEL",
                  "type": "MODEL",
                  "links": [61],
                  "shape": 3,
                  "slot_index": 0
                },
                {
                  "name": "CLIP",
                  "type": "CLIP",
                  "links": [129],
                  "shape": 3,
                  "slot_index": 1
                },
                {
                  "name": "VAE",
                  "type": "VAE",
                  "links": [65],
                  "shape": 3,
                  "slot_index": 2
                }
              ],
              "properties": { "Node name for S&R": "CheckpointLoaderSimple" },
              "widgets_values": ["stabilityAI\\sd_xl_refiner_0.9.safetensors"]
            },
            {
              "id": 4,
              "type": "CheckpointLoaderSimple",
              "pos": [-259.236255615234, -611.441153808595],
              "size": { "0": 379.6711730957031, "1": 98 },
              "flags": {},
              "order": 6,
              "mode": 0,
              "outputs": [
                {
                  "name": "MODEL",
                  "type": "MODEL",
                  "links": [153],
                  "slot_index": 0
                },
                {
                  "name": "CLIP",
                  "type": "CLIP",
                  "links": [154],
                  "slot_index": 1
                },
                { "name": "VAE", "type": "VAE", "links": [], "slot_index": 2 }
              ],
              "properties": { "Node name for S&R": "CheckpointLoaderSimple" },
              "widgets_values": ["stabilityAI\\sd_xl_base_0.9.safetensors"]
            },
            {
              "id": 50,
              "type": "CLIPTextEncodeSDXL",
              "pos": [467, -159],
              "size": { "0": 210, "1": 220.56224060058594 },
              "flags": { "collapsed": false },
              "order": 17,
              "mode": 0,
              "inputs": [
                { "name": "clip", "type": "CLIP", "link": 93 },
                {
                  "name": "text_g",
                  "type": "STRING",
                  "link": 183,
                  "widget": {
                    "name": "text_g",
                    "config": [
                      "STRING",
                      { "multiline": true, "default": "CLIP_G" }
                    ]
                  },
                  "slot_index": 1
                },
                {
                  "name": "text_l",
                  "type": "STRING",
                  "link": 184,
                  "widget": {
                    "name": "text_l",
                    "config": [
                      "STRING",
                      { "multiline": true, "default": "CLIP_L" }
                    ]
                  }
                }
              ],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [242],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "CLIPTextEncodeSDXL" },
              "widgets_values": [
                3072,
                4096,
                0,
                0,
                768,
                1024,
                prompt,
                prompt
              ]
            },
            {
              "id": 65,
              "type": "CLIPTextEncodeSDXL",
              "pos": [467, 175],
              "size": { "0": 210, "1": 220.56224060058594 },
              "flags": { "collapsed": false },
              "order": 18,
              "mode": 0,
              "inputs": [
                { "name": "clip", "type": "CLIP", "link": 126 },
                {
                  "name": "text_g",
                  "type": "STRING",
                  "link": 139,
                  "widget": {
                    "name": "text_g",
                    "config": [
                      "STRING",
                      { "multiline": true, "default": "CLIP_G" }
                    ]
                  }
                },
                {
                  "name": "text_l",
                  "type": "STRING",
                  "link": 146,
                  "widget": {
                    "name": "text_l",
                    "config": [
                      "STRING",
                      { "multiline": true, "default": "CLIP_L" }
                    ]
                  }
                }
              ],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [200],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "CLIPTextEncodeSDXL" },
              "widgets_values": [
                3072,
                4096,
                0,
                0,
                768,
                1024,
                negative_prompt,
                negative_prompt
              ]
            },
            {
              "id": 41,
              "type": "Reroute",
              "pos": [785, -410],
              "size": [75, 26],
              "flags": {},
              "order": 20,
              "mode": 0,
              "inputs": [{ "name": "", "type": "*", "link": 234 }],
              "outputs": [
                { "name": "", "type": "LATENT", "links": [224], "slot_index": 0 }
              ],
              "properties": { "showOutputText": false, "horizontal": false }
            },
            {
              "id": 139,
              "type": "KSamplerAdvanced",
              "pos": [840, -146],
              "size": { "0": 315, "1": 334 },
              "flags": {},
              "order": 19,
              "mode": 0,
              "inputs": [
                { "name": "model", "type": "MODEL", "link": 227 },
                { "name": "positive", "type": "CONDITIONING", "link": 242 },
                { "name": "negative", "type": "CONDITIONING", "link": 200 },
                { "name": "latent_image", "type": "LATENT", "link": 232 },
                {
                  "name": "steps",
                  "type": "INT",
                  "link": 225,
                  "widget": {
                    "name": "steps",
                    "config": ["INT", { "default": 20, "min": 1, "max": 10000 }]
                  }
                },
                {
                  "name": "end_at_step",
                  "type": "INT",
                  "link": 228,
                  "widget": {
                    "name": "end_at_step",
                    "config": [
                      "INT",
                      { "default": 10000, "min": 0, "max": 10000 }
                    ]
                  }
                }
              ],
              "outputs": [
                {
                  "name": "LATENT",
                  "type": "LATENT",
                  "links": [234],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "KSamplerAdvanced" },
              "widgets_values": [
                "enable",
                seed,
                "fixed",
                20,
                8,
                "euler",
                "normal",
                0,
                12,
                "enable"
              ]
            },
            {
              "id": 146,
              "type": "VAEDecode",
              "pos": [1220, -940],
              "size": { "0": 210, "1": 46 },
              "flags": {},
              "order": 22,
              "mode": 0,
              "inputs": [
                { "name": "samples", "type": "LATENT", "link": 217 },
                { "name": "vae", "type": "VAE", "link": 222 }
              ],
              "outputs": [
                {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [277],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "VAEDecode" }
            },
            {
              "id": 182,
              "type": "SaveImage",
              "pos": [1517, -994],
              "size": [644.6737358398427, 897.4098990234368],
              "flags": {},
              "order": 23,
              "mode": 0,
              "inputs": [{ "name": "images", "type": "IMAGE", "link": 277 }],
              "properties": {},
              "widgets_values": ["ComfyUI"]
            }
          ],
          "links": [
            [61, 11, 0, 38, 0, "*"],
            [65, 11, 2, 39, 0, "*"],
            [93, 61, 0, 50, 0, "CLIP"],
            [116, 15, 0, 70, 1, "STRING"],
            [120, 16, 0, 71, 1, "STRING"],
            [126, 61, 0, 65, 0, "CLIP"],
            [127, 73, 0, 70, 0, "CLIP"],
            [128, 73, 0, 71, 0, "CLIP"],
            [129, 11, 1, 73, 0, "*"],
            [130, 39, 0, 40, 0, "*"],
            [139, 16, 0, 65, 1, "STRING"],
            [146, 16, 0, 65, 2, "STRING"],
            [153, 4, 0, 31, 0, "*"],
            [154, 4, 1, 61, 0, "*"],
            [183, 15, 0, 50, 1, "STRING"],
            [184, 15, 0, 50, 2, "STRING"],
            [200, 65, 0, 139, 2, "CONDITIONING"],
            [207, 38, 0, 142, 0, "MODEL"],
            [209, 71, 0, 142, 2, "CONDITIONING"],
            [217, 142, 0, 146, 0, "LATENT"],
            [222, 40, 0, 146, 1, "VAE"],
            [224, 41, 0, 142, 3, "LATENT"],
            [225, 152, 0, 139, 4, "INT"],
            [226, 152, 0, 142, 4, "INT"],
            [227, 31, 0, 139, 0, "MODEL"],
            [228, 155, 0, 139, 5, "INT"],
            [229, 155, 0, 142, 5, "INT"],
            [230, 5, 0, 157, 0, "*"],
            [231, 157, 0, 158, 0, "*"],
            [232, 158, 0, 139, 3, "LATENT"],
            [234, 139, 0, 41, 0, "*"],
            [241, 70, 0, 142, 1, "CONDITIONING"],
            [242, 50, 0, 139, 1, "CONDITIONING"],
            [277, 146, 0, 182, 0, "IMAGE"]
          ],
          "groups": [
            {
              "title": "Base Stage",
              "bounding": [273, -302, 1208, 826],
              "color": "#3f789e"
            },
            {
              "title": "Refiner Stage",
              "bounding": [276, -1043, 1209, 718],
              "color": "#3f789e"
            },
            {
              "title": "Input",
              "bounding": [-354, -396, 520, 808],
              "color": "#3f789e"
            },
            {
              "title": "Models",
              "bounding": [-284, -844, 442, 369],
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
