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
  ctx.session.current_generation.prompt = ctx.message?.text || '';

  await redirect_handler(ctx, 'play/negative_prompt');
}

const _request_prompt = async (ctx) => {

  ctx.text_buttons.clean();
  ctx.expected_input = 'play/prompt given';


  return await ctx.telegram.sendMessage(
    ctx.from.id,
    ctx.templates.message(),
    {
      parse_mode: 'HTML',
      ...Markup.removeKeyboard(),
    }
  );
}

