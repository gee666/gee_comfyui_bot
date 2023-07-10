import _ from 'lodash';
import { TelegramSession } from '../source/classes/TelegramSession';

export default async (ctx, next) => {
  if (!ctx.from) {
    await next();
    return;
  }
  const session = new TelegramSession(ctx.from.id);
  await session.load();

  ctx.session = session.data;
  ctx.keyboard = session.keyboard;
  ctx.handler_history = session.handler_history;
  ctx.expected_input = session.expected_input;

  await next();

  session.data = ctx.session;
  session.keyboard = ctx.keyboard;
  session.handler_history = ctx.handler_history;
  session.expected_input = ctx.expected_input;

  await session.save();
}

