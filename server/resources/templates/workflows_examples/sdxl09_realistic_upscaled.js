import config from "../../../../config";
import crypto from 'crypto';

export const params = {
  title: 'SD XL 0.9 realistic',
  description: 'More in-depth right workflow for the SD XL 0.9 model + using additional prompts for refining realistic images and an apscale model to add details to the image',
  request_user_for: [
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
 * @param {number} params.ar
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
        "inputs": { "width": 1024, "height": 1024, "batch_size": 1 },
        "class_type": "EmptyLatentImage"
      },
      "11": {
        "inputs": { "ckpt_name": "stabilityAI\\sd_xl_refiner_0.9.safetensors" },
        "class_type": "CheckpointLoaderSimple"
      },
      "50": {
        "inputs": {
          "width": 4096,
          "height": 4096,
          "crop_w": 0,
          "crop_h": 0,
          "target_width": 4096,
          "target_height": 4096,
          "text_g": prompt,
          "text_l": "detailed photo, wide angle shot, realistic, 8k uhd, high quality, 8k, high resolution, masterpiece, best quality, high quality, very detailed, insanely detailed, professional light, canon photography, very high quality, very detailed, a lot of detail\n",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncodeSDXL"
      },
      "65": {
        "inputs": {
          "width": 4096,
          "height": 4096,
          "crop_w": 0,
          "crop_h": 0,
          "target_width": 4096,
          "target_height": 4096,
          "text_g": negative_prompt,
          "text_l": "cloned face, poorly drawn face, extra arms, extra fingers, extra legs, extra limb, floating limbs, fused fingers, malformed limbs, missing arms, missing legs, mutated hands, poorly drawn hands, malformed hands, bad anatomy, bad proportions, gross proportions, long body, long neck, blurry, cropped, dehydrated, jpeg artifacts, low quality, low-res, out of frame, worst quality, deformed, disfigured, mutilated, mangled, unrealistic, duplicate, morbid, mutation, poorly drawn, signature, text, too many fingers, ugly, username, watermark, photoshop, airbrush, kitsch, oversaturated, disgusting, conjoined twins, meme, elongated, strabismus, heterochromia",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncodeSDXL"
      },
      "70": {
        "inputs": {
          "ascore": 6,
          "width": 4096,
          "height": 4096,
          "text": "detailed photo, wide angle shot, realistic, 8k uhd, high quality",
          "clip": ["11", 1]
        },
        "class_type": "CLIPTextEncodeSDXLRefiner"
      },
      "71": {
        "inputs": {
          "ascore": 2.5,
          "width": 4096,
          "height": 4096,
          "text": "3d render, anime, smooth, plastic, blurry, grainy, low-resolution, deep-fried, oversaturated",
          "clip": ["11", 1]
        },
        "class_type": "CLIPTextEncodeSDXLRefiner"
      },
      "139": {
        "inputs": {
          "add_noise": "enable",
          "noise_seed": seed,
          "steps": 80,
          "cfg": 7,
          "sampler_name": "dpmpp_2m",
          "scheduler": "karras",
          "start_at_step": 0,
          "end_at_step": 60,
          "return_with_leftover_noise": "enable",
          "model": ["4", 0],
          "positive": ["50", 0],
          "negative": ["65", 0],
          "latent_image": ["5", 0]
        },
        "class_type": "KSamplerAdvanced"
      },
      "140": {
        "inputs": { "samples": ["139", 0], "vae": ["4", 2] },
        "class_type": "VAEDecode"
      },
      "142": {
        "inputs": {
          "add_noise": "disable",
          "noise_seed": seed,
          "steps": 80,
          "cfg": 6,
          "sampler_name": "dpmpp_2m",
          "scheduler": "karras",
          "start_at_step": 60,
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
      "190": {
        "inputs": {
          "filename_prefix": "UpScaled\\Upscaled_SDXL09_",
          "images": ["199", 0]
        },
        "class_type": "SaveImage"
      },
      "191": {
        "inputs": { "upscale_model": ["192", 0], "image": ["193", 0] },
        "class_type": "ImageUpscaleWithModel"
      },
      "192": {
        "inputs": { "model_name": "4x-UltraSharp.pth" },
        "class_type": "UpscaleModelLoader"
      },
      "193": {
        "inputs": { "upscale_model": ["194", 0], "image": ["146", 0] },
        "class_type": "ImageUpscaleWithModel"
      },
      "194": {
        "inputs": { "model_name": "x1_ITF_SkinDiffDetail_Lite_v1.pth" },
        "class_type": "UpscaleModelLoader"
      },
      "199": {
        "inputs": {
          "upscale_method": "nearest-exact",
          "scale_by": 0.35,
          "image": ["191", 0]
        },
        "class_type": "ImageScaleBy"
      }
    },
    "extra_data": {
      "extra_pnginfo": {
        "workflow": {
          "last_node_id": 199,
          "last_link_id": 279,
          "nodes": [
            {
              "id": 61,
              "type": "Reroute",
              "pos": [300.18724792968777, -51.4902242993166],
              "size": [75, 26],
              "flags": {},
              "order": 20,
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
              "id": 73,
              "type": "Reroute",
              "pos": [282.6807645839848, -810.0925368593781],
              "size": [75, 26],
              "flags": {},
              "order": 17,
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
              "id": 38,
              "type": "Reroute",
              "pos": [285.6807645839848, -880.092536859378],
              "size": [75, 26],
              "flags": {},
              "order": 16,
              "mode": 0,
              "inputs": [{ "name": "", "type": "*", "link": 61 }],
              "outputs": [
                { "name": "", "type": "MODEL", "links": [207], "slot_index": 0 }
              ],
              "properties": { "showOutputText": false, "horizontal": false }
            },
            {
              "id": 39,
              "type": "Reroute",
              "pos": [294.6807645839848, -472.09253685937585],
              "size": [75, 26],
              "flags": {},
              "order": 18,
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
              "pos": [303.18724792968777, -140.49022429931668],
              "size": [75, 26],
              "flags": {},
              "order": 19,
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
              "id": 5,
              "type": "EmptyLatentImage",
              "pos": [-320.71976328124936, 108.68898811523421],
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
              "widgets_values": [1024, 1024, 1]
            },
            {
              "id": 157,
              "type": "Reroute",
              "pos": [306.4420283007812, 528.1560071533203],
              "size": [75, 26],
              "flags": {},
              "order": 15,
              "mode": 0,
              "inputs": [{ "name": "", "type": "*", "link": 230 }],
              "outputs": [
                { "name": "", "type": "LATENT", "links": [231], "slot_index": 0 }
              ],
              "properties": { "showOutputText": false, "horizontal": false }
            },
            {
              "id": 32,
              "type": "Reroute",
              "pos": [338.4420283007812, 447.1560071533201],
              "size": [75, 26],
              "flags": {},
              "order": 21,
              "mode": 0,
              "inputs": [{ "name": "", "type": "*", "link": 57 }],
              "outputs": [
                { "name": "", "type": "VAE", "links": [233], "slot_index": 0 }
              ],
              "properties": { "showOutputText": false, "horizontal": false }
            },
            {
              "id": 158,
              "type": "Reroute",
              "pos": [623.4420283007812, 527.1560071533203],
              "size": [75, 26],
              "flags": {},
              "order": 22,
              "mode": 0,
              "inputs": [{ "name": "", "type": "*", "link": 231 }],
              "outputs": [
                { "name": "", "type": "LATENT", "links": [232], "slot_index": 0 }
              ],
              "properties": { "showOutputText": false, "horizontal": false }
            },
            {
              "id": 44,
              "type": "Reroute",
              "pos": [1011.4420283007812, 449.1560071533201],
              "size": [75, 26],
              "flags": {},
              "order": 28,
              "mode": 0,
              "inputs": [{ "name": "", "type": "*", "link": 233 }],
              "outputs": [
                { "name": "", "type": "VAE", "links": [203], "slot_index": 0 }
              ],
              "properties": { "showOutputText": false, "horizontal": false }
            },
            {
              "id": 40,
              "type": "Reroute",
              "pos": [1000.2318867968752, -473.054149609375],
              "size": [75, 26],
              "flags": {},
              "order": 25,
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
              "id": 142,
              "type": "KSamplerAdvanced",
              "pos": [776.6956603906256, -876.4961168750002],
              "size": { "0": 315, "1": 334 },
              "flags": {},
              "order": 32,
              "mode": 0,
              "inputs": [
                { "name": "model", "type": "MODEL", "link": 207 },
                { "name": "positive", "type": "CONDITIONING", "link": 208 },
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
                },
                {
                  "name": "noise_seed",
                  "type": "INT",
                  "link": 236,
                  "widget": {
                    "name": "noise_seed",
                    "config": [
                      "INT",
                      { "default": 0, "min": 0, "max": 18446744073709552000 }
                    ]
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
                630095409893141,
                "fixed",
                80,
                6,
                "dpmpp_2m",
                "karras",
                60,
                1000,
                "disable"
              ]
            },
            {
              "id": 139,
              "type": "KSamplerAdvanced",
              "pos": [766.4472528125001, -132.77022368896507],
              "size": { "0": 315, "1": 334 },
              "flags": {},
              "order": 29,
              "mode": 0,
              "inputs": [
                { "name": "model", "type": "MODEL", "link": 227 },
                { "name": "positive", "type": "CONDITIONING", "link": 199 },
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
                },
                {
                  "name": "noise_seed",
                  "type": "INT",
                  "link": 235,
                  "widget": {
                    "name": "noise_seed",
                    "config": [
                      "INT",
                      { "default": 0, "min": 0, "max": 18446744073709552000 }
                    ]
                  },
                  "slot_index": 6
                },
                {
                  "name": "cfg",
                  "type": "FLOAT",
                  "link": 237,
                  "widget": {
                    "name": "cfg",
                    "config": ["FLOAT", { "default": 8, "min": 0, "max": 100 }]
                  },
                  "slot_index": 7
                }
              ],
              "outputs": [
                {
                  "name": "LATENT",
                  "type": "LATENT",
                  "links": [202, 234],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "KSamplerAdvanced" },
              "widgets_values": [
                "enable",
                630095409893141,
                "fixed",
                80,
                7,
                "dpmpp_2m",
                "karras",
                0,
                60,
                "enable"
              ]
            },
            {
              "id": 41,
              "type": "Reroute",
              "pos": [872.2318867968752, -348.0541496093749],
              "size": [75, 26],
              "flags": {},
              "order": 31,
              "mode": 0,
              "inputs": [{ "name": "", "type": "*", "link": 234 }],
              "outputs": [
                { "name": "", "type": "LATENT", "links": [224], "slot_index": 0 }
              ],
              "properties": { "showOutputText": false, "horizontal": false }
            },
            {
              "id": 50,
              "type": "CLIPTextEncodeSDXL",
              "pos": [426.18724792968777, -52.4902242993166],
              "size": { "0": 210, "1": 220.56224060058594 },
              "flags": { "collapsed": false },
              "order": 26,
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
                  "link": 253,
                  "widget": {
                    "name": "text_l",
                    "config": [
                      "STRING",
                      { "multiline": true, "default": "CLIP_L" }
                    ]
                  },
                  "slot_index": 2
                }
              ],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [199],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "CLIPTextEncodeSDXL" },
              "widgets_values": [
                4096,
                4096,
                0,
                0,
                4096,
                4096,
                prompt,
                "detailed photo, wide angle shot, realistic, 8k uhd, high quality, 8k, high resolution, masterpiece, best quality, high quality, very detailed, insanely detailed, professional light, canon photography, very high quality, very detailed, a lot of detail\n"
              ]
            },
            {
              "id": 174,
              "type": "PrimitiveNode",
              "pos": [-357, 568],
              "size": { "0": 508.0962829589844, "1": 103.75114440917969 },
              "flags": {},
              "order": 1,
              "mode": 0,
              "outputs": [
                {
                  "name": "STRING",
                  "type": "STRING",
                  "links": [253],
                  "widget": {
                    "name": "text_l",
                    "config": [
                      "STRING",
                      { "multiline": true, "default": "CLIP_L" }
                    ]
                  }
                }
              ],
              "title": "Positive L",
              "properties": {},
              "widgets_values": [
                "detailed photo, wide angle shot, realistic, 8k uhd, high quality, 8k, high resolution, masterpiece, best quality, high quality, very detailed, insanely detailed, professional light, canon photography, very high quality, very detailed, a lot of detail\n"
              ],
              "color": "#232",
              "bgcolor": "#353"
            },
            {
              "id": 65,
              "type": "CLIPTextEncodeSDXL",
              "pos": [426.4420283007812, 211.15600715332033],
              "size": { "0": 210, "1": 220.56224060058594 },
              "flags": { "collapsed": false },
              "order": 27,
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
                  "link": 254,
                  "widget": {
                    "name": "text_l",
                    "config": [
                      "STRING",
                      { "multiline": true, "default": "CLIP_L" }
                    ]
                  },
                  "slot_index": 2
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
                4096,
                4096,
                0,
                0,
                4096,
                4096,
                negative_prompt,
                "cloned face, poorly drawn face, extra arms, extra fingers, extra legs, extra limb, floating limbs, fused fingers, malformed limbs, missing arms, missing legs, mutated hands, poorly drawn hands, malformed hands, bad anatomy, bad proportions, gross proportions, long body, long neck, blurry, cropped, dehydrated, jpeg artifacts, low quality, low-res, out of frame, worst quality, deformed, disfigured, mutilated, mangled, unrealistic, duplicate, morbid, mutation, poorly drawn, signature, text, too many fingers, ugly, username, watermark, photoshop, airbrush, kitsch, oversaturated, disgusting, conjoined twins, meme, elongated, strabismus, heterochromia"
              ]
            },
            {
              "id": 71,
              "type": "CLIPTextEncodeSDXLRefiner",
              "pos": [424.2318867968752, -640.0541496093753],
              "size": { "0": 232.16049194335938, "1": 135.14903259277344 },
              "flags": {},
              "order": 24,
              "mode": 0,
              "inputs": [
                { "name": "clip", "type": "CLIP", "link": 128 },
                {
                  "name": "text",
                  "type": "STRING",
                  "link": 255,
                  "widget": {
                    "name": "text",
                    "config": ["STRING", { "multiline": true }]
                  },
                  "slot_index": 1
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
                2.5,
                4096,
                4096,
                "3d render, anime, smooth, plastic, blurry, grainy, low-resolution, deep-fried, oversaturated"
              ]
            },
            {
              "id": 70,
              "type": "CLIPTextEncodeSDXLRefiner",
              "pos": [417.6807645839847, -813.0925368593781],
              "size": { "0": 242.90916442871094, "1": 126 },
              "flags": {},
              "order": 23,
              "mode": 0,
              "inputs": [
                { "name": "clip", "type": "CLIP", "link": 127 },
                {
                  "name": "text",
                  "type": "STRING",
                  "link": 256,
                  "widget": {
                    "name": "text",
                    "config": ["STRING", { "multiline": true }]
                  },
                  "slot_index": 1
                }
              ],
              "outputs": [
                {
                  "name": "CONDITIONING",
                  "type": "CONDITIONING",
                  "links": [208],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "CLIPTextEncodeSDXLRefiner" },
              "widgets_values": [
                6,
                4096,
                4096,
                "detailed photo, wide angle shot, realistic, 8k uhd, high quality"
              ]
            },
            {
              "id": 175,
              "type": "PrimitiveNode",
              "pos": [-354, 717],
              "size": { "0": 504.7550048828125, "1": 109.0289535522461 },
              "flags": {},
              "order": 2,
              "mode": 0,
              "outputs": [
                {
                  "name": "STRING",
                  "type": "STRING",
                  "links": [254],
                  "widget": {
                    "name": "text_l",
                    "config": [
                      "STRING",
                      { "multiline": true, "default": "CLIP_L" }
                    ]
                  }
                }
              ],
              "title": "Negative L",
              "properties": {},
              "widgets_values": [
                "cloned face, poorly drawn face, extra arms, extra fingers, extra legs, extra limb, floating limbs, fused fingers, malformed limbs, missing arms, missing legs, mutated hands, poorly drawn hands, malformed hands, bad anatomy, bad proportions, gross proportions, long body, long neck, blurry, cropped, dehydrated, jpeg artifacts, low quality, low-res, out of frame, worst quality, deformed, disfigured, mutilated, mangled, unrealistic, duplicate, morbid, mutation, poorly drawn, signature, text, too many fingers, ugly, username, watermark, photoshop, airbrush, kitsch, oversaturated, disgusting, conjoined twins, meme, elongated, strabismus, heterochromia"
              ],
              "color": "#322",
              "bgcolor": "#533"
            },
            {
              "id": 16,
              "type": "PrimitiveNode",
              "pos": [-327.30505996093643, -228.36920099609384],
              "size": { "0": 434.15277099609375, "1": 152.36099243164062 },
              "flags": {},
              "order": 3,
              "mode": 0,
              "outputs": [
                {
                  "name": "STRING",
                  "type": "STRING",
                  "links": [139],
                  "slot_index": 0,
                  "widget": {
                    "name": "text_g",
                    "config": [
                      "STRING",
                      { "multiline": true, "default": "CLIP_G" }
                    ]
                  }
                }
              ],
              "title": "Negative Prompt",
              "properties": {},
              "widgets_values": [negative_prompt],
              "color": "#322",
              "bgcolor": "#533"
            },
            {
              "id": 140,
              "type": "VAEDecode",
              "pos": [1231.4472528125004, 19.22977631103504],
              "size": { "0": 210, "1": 46 },
              "flags": {},
              "order": 30,
              "mode": 0,
              "inputs": [
                { "name": "samples", "type": "LATENT", "link": 202 },
                { "name": "vae", "type": "VAE", "link": 203 }
              ],
              "outputs": [
                { "name": "IMAGE", "type": "IMAGE", "links": [], "slot_index": 0 }
              ],
              "properties": { "Node name for S&R": "VAEDecode" }
            },
            {
              "id": 146,
              "type": "VAEDecode",
              "pos": [1206.6956603906256, -872.4961168750002],
              "size": { "0": 210, "1": 46 },
              "flags": {},
              "order": 33,
              "mode": 0,
              "inputs": [
                { "name": "samples", "type": "LATENT", "link": 217 },
                { "name": "vae", "type": "VAE", "link": 222 }
              ],
              "outputs": [
                {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [273],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "VAEDecode" }
            },
            {
              "id": 160,
              "type": "PrimitiveNode",
              "pos": [-317.07178867187446, 266.7324419726565],
              "size": [446.734808691405, 82],
              "flags": {},
              "order": 4,
              "mode": 0,
              "outputs": [
                {
                  "name": "FLOAT",
                  "type": "FLOAT",
                  "links": [237],
                  "widget": {
                    "name": "cfg",
                    "config": ["FLOAT", { "default": 8, "min": 0, "max": 100 }]
                  }
                }
              ],
              "title": "CFG Scale",
              "properties": {},
              "widgets_values": [7, "fixed"],
              "color": "#323",
              "bgcolor": "#535"
            },
            {
              "id": 152,
              "type": "PrimitiveNode",
              "pos": [-322.71976328124936, -19.311011884765403],
              "size": { "0": 210, "1": 82 },
              "flags": {},
              "order": 5,
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
              "widgets_values": [80, "fixed"],
              "color": "#233",
              "bgcolor": "#355"
            },
            {
              "id": 155,
              "type": "PrimitiveNode",
              "pos": [-72.71976328125001, -17.31101188476542],
              "size": { "0": 210, "1": 82 },
              "flags": {},
              "order": 6,
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
              "widgets_values": [60, "fixed"],
              "color": "#2a363b",
              "bgcolor": "#3f5159"
            },
            {
              "id": 15,
              "type": "PrimitiveNode",
              "pos": [-324, -459],
              "size": { "0": 431.4493408203125, "1": 188.83541870117188 },
              "flags": {},
              "order": 7,
              "mode": 0,
              "outputs": [
                {
                  "name": "STRING",
                  "type": "STRING",
                  "links": [183],
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
              "id": 190,
              "type": "SaveImage",
              "pos": [1539, -1006],
              "size": [738.6558729730464, 774.6571067828122],
              "flags": {},
              "order": 37,
              "mode": 0,
              "inputs": [{ "name": "images", "type": "IMAGE", "link": 279 }],
              "title": "Save Upscaled Image",
              "properties": {},
              "widgets_values": ["UpScaled\\Upscaled_SDXL09_"],
              "color": "#232",
              "bgcolor": "#353"
            },
            {
              "id": 11,
              "type": "CheckpointLoaderSimple",
              "pos": [-323.85592955078044, -865.250719316406],
              "size": [441.58146208984266, 98],
              "flags": {},
              "order": 8,
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
              "pos": [-321.8559295507804, -719.2507193164059],
              "size": [434.7499320898427, 100.20097404296826],
              "flags": {},
              "order": 9,
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
                { "name": "VAE", "type": "VAE", "links": [57], "slot_index": 2 }
              ],
              "properties": { "Node name for S&R": "CheckpointLoaderSimple" },
              "widgets_values": ["stabilityAI\\sd_xl_base_0.9.safetensors"]
            },
            {
              "id": 159,
              "type": "PrimitiveNode",
              "pos": [-319, 400],
              "size": [446.00102001953053, 82],
              "flags": {},
              "order": 10,
              "mode": 0,
              "outputs": [
                {
                  "name": "INT",
                  "type": "INT",
                  "links": [235, 236],
                  "widget": {
                    "name": "noise_seed",
                    "config": [
                      "INT",
                      { "default": 0, "min": 0, "max": 18446744073709552000 }
                    ]
                  },
                  "slot_index": 0
                }
              ],
              "title": "Seed",
              "properties": {},
              "widgets_values": [seed, "randomize"],
              "color": "#432",
              "bgcolor": "#653"
            },
            {
              "id": 193,
              "type": "ImageUpscaleWithModel",
              "pos": [739, -1203],
              "size": { "0": 241.79998779296875, "1": 46 },
              "flags": {},
              "order": 34,
              "mode": 0,
              "inputs": [
                { "name": "upscale_model", "type": "UPSCALE_MODEL", "link": 272 },
                { "name": "image", "type": "IMAGE", "link": 273 }
              ],
              "outputs": [
                {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [274],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "ImageUpscaleWithModel" }
            },
            {
              "id": 194,
              "type": "UpscaleModelLoader",
              "pos": [300, -1211],
              "size": [389.74306286621027, 58.569458984374705],
              "flags": {},
              "order": 11,
              "mode": 0,
              "outputs": [
                {
                  "name": "UPSCALE_MODEL",
                  "type": "UPSCALE_MODEL",
                  "links": [272],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "UpscaleModelLoader" },
              "widgets_values": ["x1_ITF_SkinDiffDetail_Lite_v1.pth"]
            },
            {
              "id": 192,
              "type": "UpscaleModelLoader",
              "pos": [287, -1091],
              "size": { "0": 405.3124084472656, "1": 58 },
              "flags": {},
              "order": 12,
              "mode": 0,
              "outputs": [
                {
                  "name": "UPSCALE_MODEL",
                  "type": "UPSCALE_MODEL",
                  "links": [269],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "UpscaleModelLoader" },
              "widgets_values": ["4x-UltraSharp.pth"]
            },
            {
              "id": 191,
              "type": "ImageUpscaleWithModel",
              "pos": [729, -1079],
              "size": { "0": 241.79998779296875, "1": 46 },
              "flags": {},
              "order": 35,
              "mode": 0,
              "inputs": [
                { "name": "upscale_model", "type": "UPSCALE_MODEL", "link": 269 },
                { "name": "image", "type": "IMAGE", "link": 274 }
              ],
              "outputs": [
                {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [278],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "ImageUpscaleWithModel" },
              "color": "#232",
              "bgcolor": "#353"
            },
            {
              "id": 177,
              "type": "PrimitiveNode",
              "pos": [-346, -1260],
              "size": [491.2381248789384, 127.56422512590393],
              "flags": {},
              "order": 13,
              "mode": 0,
              "outputs": [
                {
                  "name": "STRING",
                  "type": "STRING",
                  "links": [256],
                  "widget": {
                    "name": "text",
                    "config": ["STRING", { "multiline": true }]
                  }
                }
              ],
              "title": "Positive R",
              "properties": {},
              "widgets_values": [
                "detailed photo, wide angle shot, realistic, 8k uhd, high quality"
              ],
              "color": "#232",
              "bgcolor": "#353"
            },
            {
              "id": 176,
              "type": "PrimitiveNode",
              "pos": [-340, -1089],
              "size": [479.6265546310045, 116.06835735730874],
              "flags": {},
              "order": 14,
              "mode": 0,
              "outputs": [
                {
                  "name": "STRING",
                  "type": "STRING",
                  "links": [255],
                  "widget": {
                    "name": "text",
                    "config": ["STRING", { "multiline": true }]
                  }
                }
              ],
              "title": "Negative R",
              "properties": {},
              "widgets_values": [
                "3d render, anime, smooth, plastic, blurry, grainy, low-resolution, deep-fried, oversaturated"
              ],
              "color": "#322",
              "bgcolor": "#533"
            },
            {
              "id": 199,
              "type": "ImageScaleBy",
              "pos": [1088, -1145],
              "size": { "0": 315, "1": 82 },
              "flags": {},
              "order": 36,
              "mode": 0,
              "inputs": [{ "name": "image", "type": "IMAGE", "link": 278 }],
              "outputs": [
                {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [279],
                  "shape": 3,
                  "slot_index": 0
                }
              ],
              "properties": { "Node name for S&R": "ImageScaleBy" },
              "widgets_values": ["nearest-exact", 0.35]
            }
          ],
          "links": [
            [57, 4, 2, 32, 0, "*"],
            [61, 11, 0, 38, 0, "*"],
            [65, 11, 2, 39, 0, "*"],
            [93, 61, 0, 50, 0, "CLIP"],
            [126, 61, 0, 65, 0, "CLIP"],
            [127, 73, 0, 70, 0, "CLIP"],
            [128, 73, 0, 71, 0, "CLIP"],
            [129, 11, 1, 73, 0, "*"],
            [130, 39, 0, 40, 0, "*"],
            [139, 16, 0, 65, 1, "STRING"],
            [153, 4, 0, 31, 0, "*"],
            [154, 4, 1, 61, 0, "*"],
            [183, 15, 0, 50, 1, "STRING"],
            [199, 50, 0, 139, 1, "CONDITIONING"],
            [200, 65, 0, 139, 2, "CONDITIONING"],
            [202, 139, 0, 140, 0, "LATENT"],
            [203, 44, 0, 140, 1, "VAE"],
            [207, 38, 0, 142, 0, "MODEL"],
            [208, 70, 0, 142, 1, "CONDITIONING"],
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
            [233, 32, 0, 44, 0, "*"],
            [234, 139, 0, 41, 0, "*"],
            [235, 159, 0, 139, 6, "INT"],
            [236, 159, 0, 142, 6, "INT"],
            [237, 160, 0, 139, 7, "FLOAT"],
            [253, 174, 0, 50, 2, "STRING"],
            [254, 175, 0, 65, 2, "STRING"],
            [255, 176, 0, 71, 1, "STRING"],
            [256, 177, 0, 70, 1, "STRING"],
            [269, 192, 0, 191, 0, "UPSCALE_MODEL"],
            [272, 194, 0, 193, 0, "UPSCALE_MODEL"],
            [273, 146, 0, 193, 1, "IMAGE"],
            [274, 193, 0, 191, 1, "IMAGE"],
            [278, 191, 0, 199, 0, "IMAGE"],
            [279, 199, 0, 190, 0, "IMAGE"]
          ],
          "groups": [
            {
              "title": "Base Stage",
              "bounding": [276, -214, 1208, 826],
              "color": "#3f789e"
            },
            {
              "title": "Refiner Stage",
              "bounding": [263, -970, 1209, 718],
              "color": "#3f789e"
            },
            {
              "title": "Input",
              "bounding": [-353, -552, 511, 1053],
              "color": "#3f789e"
            },
            {
              "title": "Models",
              "bounding": [-346, -952, 494, 373],
              "color": "#3f789e"
            },
            {
              "title": "Group",
              "bounding": [262, -1285, 1219, 286],
              "color": "#a1309b"
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
