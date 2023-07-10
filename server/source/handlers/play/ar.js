import { Markup } from 'telegraf';
import config from "../../../../config";
import { redirect_handler } from '../../../middleware/apply_handler';

export default async (ctx) => {
  const width = ctx.handler.args[0];
  const height = ctx.handler.args[1];

  if (!width || isNaN(width) || !height || isNaN(height)) {
    return await _request_ar(ctx);
  }

  if (!ctx.session.current_generation) {
    ctx.session.current_generation = {};
  }
  ctx.session.current_generation.width = width;
  ctx.session.current_generation.height = height;

  await redirect_handler(ctx, 'play/prompt');
}

const _request_ar = async (ctx) => {

  ctx.text_buttons.clean();
  ctx.text_buttons.add('square', `play/ar 512 512`);
  ctx.text_buttons.add('vertical', `play/ar 512 768`);
  ctx.text_buttons.add('horizontal', `play/ar 768 512`);


  return await ctx.telegram.sendMessage(
    ctx.from.id,
    ctx.templates.message(),
    {
      parse_mode: 'HTML',
      ...ctx.text_buttons.get({ columns: 3 }),
    }
  );
}

