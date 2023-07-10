import { redirect_handler } from "../../middleware/apply_handler";

export default async (ctx) => {
  if (ctx.session.current_generation) {
    await redirect_handler(ctx, 'play/generate');
    return;
  }

  await redirect_handler(ctx, 'play');
}