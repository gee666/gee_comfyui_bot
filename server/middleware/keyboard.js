import { TextButtons } from '../source/classes/TextButtons';

export default async (ctx, next) => {
  ctx.text_buttons = new TextButtons(ctx.keyboard);

  await next();

  ctx.keyboard = ctx.text_buttons.keyboard;

}

