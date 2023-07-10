import { Markup } from 'telegraf';
import { redirect_handler } from '../../middleware/apply_handler';

export default async (ctx) => {
  await ctx.telegram.sendMessage(
    ctx.from.id,
    ctx.templates.message(),
    {
      parse_mode: 'HTML',
      ...Markup.removeKeyboard(),
    }
  );

}