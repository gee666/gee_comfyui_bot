import { redirect_handler } from "../../middleware/apply_handler";

export default async (ctx) => {
  if (ctx.session.current_generation) {
    await redirect_handler(ctx, 'play/generate');
    return;
  }

  ctx.text_buttons.clean();
  ctx.text_buttons.add("Let's play!", 'play');

  return await ctx.telegram.sendMessage(
    ctx.from.id,
    ctx.templates.message_no_data(),
    {
      parse_mode: 'HTML',
      ...ctx.text_buttons.get(),
    }
  );
}