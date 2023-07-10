import { Markup } from 'telegraf';
import config from "../../../../config";
import { redirect_handler } from '../../../middleware/apply_handler';

export default async (ctx) => {
  const ar = ctx.handler.args[0];

  if (!ar) {
    return await _request_ar(ctx);
  }

  if (!ctx.session.current_generation) {
    ctx.session.current_generation = {};
  }
  ctx.session.current_generation.ar = ar;

  const current_command_index = ctx.session.current_generation.workflow.request_user_index;
  ctx.session.current_generation.workflow.request_user_index = current_command_index + 1;
  const next_command = ctx.session.current_generation?.workflow?.request_user_for[current_command_index + 1] || 'generate';

  await redirect_handler(ctx, `play/${next_command}`);
}

const _request_ar = async (ctx) => {

  ctx.text_buttons.clean();
  ctx.text_buttons.add('square', `play/ar square`);
  ctx.text_buttons.add('vertical', `play/ar vertical`);
  ctx.text_buttons.add('horizontal', `play/ar horizontal`);


  return await ctx.telegram.sendMessage(
    ctx.from.id,
    ctx.templates.message(),
    {
      parse_mode: 'HTML',
      ...ctx.text_buttons.get({ columns: 3 }),
    }
  );
}

