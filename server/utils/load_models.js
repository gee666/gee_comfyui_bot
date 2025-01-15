import axios from 'axios';
import config from '../../config';

const models_cache = {};

export const load_models = async ({ model_folder = 'checkpoints', base_model, is_inpaint, filter_path_regex } = {}) => {
  let models = [];
  if (models_cache[model_folder] && models_cache[model_folder].timestamp > Date.now() - 1000 * 60 * 30) {
    models = models_cache[model_folder].models;
  } else {
    const response = await axios.get(`http://${config.COMFY_UI_URL}/api/etn/model_info/${model_folder}`);

    for (const model_path in response.data) {
      const model = response.data[model_path];
      models.push({
        name: model_path.split('/').pop().split('\\').pop(),
        path: model_path,
        base_model: model.base_model,
        is_inpaint: model.is_inpaint,
      });
    }

    models_cache[model_folder] = {
      models: models,
      timestamp: Date.now(),
    };
  }

  models = models.filter((model) => (!base_model || model.base_model === base_model) && Boolean(model.is_inpaint) === Boolean(is_inpaint));

  if (filter_path_regex) {
    models = models.filter((model) => model.path.match(filter_path_regex));
  }

  return models;
}
