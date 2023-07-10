import { Markup } from 'telegraf';
import config from "../../../../config";
import { redirect_handler } from '../../../middleware/apply_handler';

export default async (ctx) => {
  const is_given_prompt = ctx.handler.args[0] === 'given';

  if (!is_given_prompt) {
    return await _request_prompt(ctx);
  }

  if (!ctx.session.current_generation) {
    ctx.session.current_generation = {};
  }

  const current_command_index = ctx.session.current_generation.workflow.request_user_index;
  const current_user_request = ctx.session.current_generation.workflow.request_user_for[current_command_index];
  ctx.session.current_generation.workflow.request_user_index = current_command_index + 1;

  ctx.session.current_generation[current_user_request.key || 'prompt'] = ctx.message?.text || '';

  const next_command = ctx.session.current_generation?.workflow?.request_user_for[current_command_index + 1]?.command || 'generate';
  await redirect_handler(ctx, `play/${next_command}`);
}

const _request_prompt = async (ctx) => {

  const current_command_index = ctx.session.current_generation.workflow.request_user_index;
  const current_user_request = ctx.session.current_generation.workflow.request_user_for[current_command_index];
  const message_template = current_user_request.message || 'Write propmpt for your image';

  ctx.text_buttons.clean();
  ctx.expected_input = 'play/prompt given';


  return await ctx.telegram.sendMessage(
    ctx.from.id,
    message_template,
    {
      parse_mode: 'HTML',
      ...Markup.removeKeyboard(),
    }
  );
}

