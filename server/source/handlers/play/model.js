import { Markup } from 'telegraf';
import config from "../../../../config";
import { number_2_emoji, get_random_emoji_type } from '../../../utils/number_2_emoji';
import { redirect_handler } from '../../../middleware/apply_handler';

export default async (ctx) => {
  const model_index = ctx.handler.args[0];

  if (!config.SD_MODELS || !config.SD_MODELS.length) {
    return await _no_models(ctx);
  }

  if (!model_index || !config.SD_MODELS[model_index]) {
    return await _request_model(ctx);
  }

  const model = config.SD_MODELS[model_index];
  if (!ctx.session.current_generation) {
    ctx.session.current_generation = {};
  }

  const current_command_index = ctx.session.current_generation.workflow.request_user_index;
  const current_user_request = ctx.session.current_generation.workflow.request_user_for[current_command_index];
  ctx.session.current_generation.workflow.request_user_index = current_command_index + 1;

  ctx.session.current_generation[current_user_request.key || 'model'] = model.path;

  const next_command = ctx.session.current_generation?.workflow?.request_user_for[current_command_index + 1]?.command || 'generate';
  await redirect_handler(ctx, `play/${next_command}`);
}

const _request_model = async (ctx) => {
  let _models_message = [];

  ctx.text_buttons.clean();

  const emoji_type = get_random_emoji_type();
  config.SD_MODELS.forEach((model, i) => {
    const model_number = number_2_emoji(i+1, emoji_type);

    _models_message.push(`${model_number} - ${model.name}`);

    ctx.text_buttons.add(model_number, `play/model ${i}`);
  });

  _models_message = _models_message.join('\n');

  const current_command_index = ctx.session.current_generation.workflow.request_user_index;
  const current_user_request = ctx.session.current_generation.workflow.request_user_for[current_command_index];

  const message_template = `
    ${current_user_request?.message || 'Choose model'}:

${_models_message}
  `;

  return await ctx.telegram.sendMessage(
    ctx.from.id,
    message_template,
    {
      parse_mode: 'HTML',
      ...ctx.text_buttons.get({ columns: 5 }),
    }
  );
}

const _no_models = async (ctx) => {
  return await ctx.telegram.sendMessage(
    ctx.from.id,
    ctx.templates.message_no_models(),
    {
      parse_mode: 'HTML',
      ...Markup.removeKeyboard(),
    }
  );
};
