import _ from 'lodash';
import config from '../../config';
import { Markup } from 'telegraf';
import { message } from '../resources/templates/messages/auth';

export default async (ctx, next) => {
  if (!ctx.from) {
    await _forbidden(ctx);
    return;
  }
  const user_id = (config.ALLOWED_USERS || []).find(id => id === ctx.from.id);

  if (!user_id) {
    await _forbidden(ctx);
    return;
  }

  ctx.user = { id: user_id };
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
