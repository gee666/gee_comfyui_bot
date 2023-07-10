import { redirect_handler } from "../../../middleware/apply_handler";

export default async (ctx) => {
  await redirect_handler(ctx, 'play/model');
}