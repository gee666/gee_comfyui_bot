import _ from 'lodash';
import config from '../../config';
import { Markup } from 'telegraf';
import { message } from '../resources/templates/messages/auth';

export default async (ctx, next) => {
  if (!ctx.from) {
    await _forbidden(ctx);
    return;
  }
  const user = _.find(config.ALLOWED_USERS, { id: ctx.from.id });

  if (!user?.id) {
    await _forbidden(ctx);
    return;
  }

  ctx.user = user;
  await next();
}

const _forbidden = async (ctx) => {
  await ctx.telegram.sendMessage(
    ctx.from.id,
    message({ id: ctx.from.id }),
    {
      parse_mode: 'HTML',
      ...Markup.removeKeyboard(),
    }
  );
}
