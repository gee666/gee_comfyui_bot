import { redirect_handler } from '../../middleware/apply_handler';

export default async (ctx) => {
  const startarg = ctx.handler.args[0];

  ctx.text_buttons.clean();
  ctx.text_buttons.add("Let's play!", 'play');

  await ctx.telegram.sendMessage(
    ctx.from.id,
    ctx.templates.message(),
    {
      parse_mode: 'HTML',
      ...ctx.text_buttons.get(),
    }
  );

}
