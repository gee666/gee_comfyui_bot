import { Markup } from 'telegraf';
import config from "../../../../config";
import { redirect_handler } from '../../../middleware/apply_handler';

export default async (ctx) => {
  const is_given_number = ctx.handler.args[0] === 'given';

  const current_command_index = ctx.session.current_generation.workflow.request_user_index;
  const current_user_request = ctx.session.current_generation.workflow.request_user_for[current_command_index];

  if (!is_given_number || !ctx.message?.text) {
    return await _request_number(ctx);
  }

  const number = parseFloat(ctx.message?.text);
  if (isNaN(number)) {
    return await _request_number(ctx, "This doesn't look like a number");
  }

  const min = current_user_request.min || -Infinity;
  const max = current_user_request.max || Infinity;
  if (number < min || number > max) {
    return await _request_number(ctx, `Please choose a number between ${min} and ${max}`);
  }

  if (!ctx.session.current_generation) {
    ctx.session.current_generation = {};
  }

  ctx.session.current_generation.workflow.request_user_index = current_command_index + 1;

  ctx.session.current_generation[current_user_request.key || 'number'] = ctx.message?.text || '';

  const next_command = ctx.session.current_generation?.workflow?.request_user_for[current_command_index + 1]?.command || 'generate';
  await redirect_handler(ctx, `play/${next_command}`);
}

const _request_number = async (ctx, error_message) => {

  const current_command_index = ctx.session.current_generation.workflow.request_user_index;
  const current_user_request = ctx.session.current_generation.workflow.request_user_for[current_command_index];

  let message_template = '';
  if (error_message) {
    message_template += `${error_message}\n\n`;
  }

  message_template += current_user_request.message || 'Write number for your image';

  ctx.text_buttons.clean();
  ctx.expected_input = 'play/number given';


  return await ctx.telegram.sendMessage(
    ctx.from.id,
    message_template,
    {
      parse_mode: 'HTML',
      ...Markup.removeKeyboard(),
    }
  );
}

