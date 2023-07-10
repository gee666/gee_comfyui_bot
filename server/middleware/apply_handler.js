import { _ } from 'lodash';
import path from 'path';
import regexps from '../utils/regexps';
import { _require } from '../utils/utils';

const ALLOWED_COMMANDS_FOR_USERS = [
  'start',
  'menu',
  'help',
  'feedback',
  'group_schedule',
  'festival',
  'guide',
  'id',
]

const MAX_handler_history_LENGTH = 5;


/**
 * Отправляет необработанные сообщения на обработчик unhandled_message.js
 */
export const apply_handler_to_unhandled_messages = async (ctx, next) => {
  // Если ввод уже был обработан другим обработчиком -
  // ничего не делаем
  if (!ctx.handler?.name) {
    _add_handler_to_ctx(ctx, 'unhandled_message', 'unhandled_message');
  }
  await next();
}


/**
 * Есди бот ожидает произовльного сообщения от пользователя
 * в session.expected_input записывается имя обработчика,
 * который готов обработать это сообщение.
 * записывает его в ctx.handlername и применяет
 */
export const apply_handler_to_expected_input = async (ctx, next) => {
  // Если ввод уже был обработан другим обработчиком -
  // ничего не делаем
  if (!ctx.handler?.name) {

    if (ctx.updateType === 'message') {
      _add_handler_to_ctx(ctx, ctx.expected_input, 'expected_input');
    }
  }

  ctx.expected_input = null;

  await next();
}


export const apply_handler_to_command = async (ctx, next) => {
  // Если ввод уже был обработан другим обработчиком -
  // ничего не делаем
  if (!ctx.handler?.name) {
    const is_command = (ctx?.message?.text || '').charAt(0) === '/';
    if (is_command) {
      const handlername = (ctx.message.text || '').slice(1);
      const commandname = handlername.replace(/^(\w+).*$/i, '$1');
      _add_handler_to_ctx(ctx, handlername, 'command');
    }
  }

  await next();
}

/**
 * При создании текстовой кнопки в session.keyboard
 * записывается соответствие текста и имени обработчика
 * находит имя обработчика, соответствующее полученному тексту,
 * записывает его в ctx.handlername и применяет
 */
export const apply_handler_to_text_button = async (ctx, next) => {
  // Если ввод уже был обработан другим обработчиком -
  // ничего не делаем
  if (!ctx.handler?.name) {
    const button = _.find((ctx.keyboard || []), {caption: ctx.message.text}) || {};

    _add_handler_to_ctx(ctx, button.action, 'text_button');
  };

  await next();
}

/**
 * Имя действия обратного вызова является именем обработчика,
 * записывает его в ctx.handlername и применяет
 */
export const apply_handler_to_action = async (ctx, next) => {
  // Если ввод уже был обработан другим обработчиком -
  // ничего не делаем
  if (!ctx.handler?.name) {
    _add_handler_to_ctx(ctx, ctx.match.input, 'callback_action');
  };
  await ctx.telegram.answerCbQuery(ctx.update.callback_query.id);
  await next();
}

/**
 * Применяет новый обработчик, предыдущие записывает в историю
 * @param {Context} ctx
 * @param {String} handlername
 */
 export const apply_handler_to_cron_task = async (ctx, handlername) => {
  _add_handler_to_ctx(ctx, handlername, 'cron');
  await run_handler(ctx);
}


/**
 * Применяет новый обработчик, предыдущие записывает в историю
 * @param {Context} ctx
 * @param {String} handlername
 */
export const redirect_handler = async (ctx, handlername) => {
  const  current_handler = ctx.handler;
  _add_handler_to_ctx(ctx, handlername, 'redirect');
  await run_handler(ctx);
  _add_handler_to_ctx(ctx, current_handler.name, current_handler.type);
}


export const run_handler = async (ctx, next) => {
  if (typeof ctx?.handler?.runner === 'function') {
    await ctx.handler.runner(ctx);
  }
  if (typeof next === 'function') await next();

  _add_handler_history(ctx);
}

/**
 *
 * @param {Object} ctx
 * добавляет текущий обработчик в историю обработчиков
 * которая сохраняется в сессии
 */
const _add_handler_history = (ctx) => {
  if (!ctx.handler) return;
  if (! ctx.handler_history) ctx.handler_history = [];

  ctx.handler_history.unshift({
    name: ctx.handler.name,
    type: ctx.handler.type,
    args: ctx.handler.args,
    data: ctx.handler_history_data,
  });

  if (ctx.handler_history.length > MAX_handler_history_LENGTH) {
    ctx.handler_history.splice(MAX_handler_history_LENGTH);
  }
}

/**
 * применяет обработчик из ctx.handler
 * если такого обработчика нет - ничего не делает
 *
 * В ctx.templates добавляются шаблоны сообщений с таким же именем, как у обработчика
 * в ctx.common_templates добавляются общие для всего бота шаблоны соощений
 * из файла /resources/templates/messages/common.js
 */
const _add_handler_to_ctx = (ctx, handlername, handlertype) => {
  const current = _parse_handlername(handlername, handlertype);
  if (!current.name) return;

  const handler_filepath = path.resolve(__dirname, '../source/handlers/', current.name + '.js');
  const handler_filepath_main = path.resolve(__dirname, '../source/handlers/', current.name + '/main.js');
  const handler_filepath_index = path.resolve(__dirname, '../source/handlers/', current.name + '/index.js');
  const handler =  _require(handler_filepath, handler_filepath_main, handler_filepath_index);


  if (typeof handler?.default === 'function') {
    if (!ctx.handler) ctx.handler = {};

    ctx.handler = { ...current };

    const templates_filepath = path.resolve(__dirname, '../resources/templates/messages/', current.name + '.js');
    const templates_filepath_main = path.resolve(__dirname, '../resources/templates/messages/', current.name + '/main.js');
    const templates_filepath_index = path.resolve(__dirname, '../resources/templates/messages/', current.name + '/index.js');
    const templates =  _require(templates_filepath, templates_filepath_main, templates_filepath_index);
    ctx.templates = templates;

    const common_templates_filepath = path.resolve(__dirname, '../resources/templates/messages/common.js');
    const common_templates =  _require(common_templates_filepath);
    ctx.common_templates = common_templates;

    ctx.handler.runner = handler.default;
  }
}



/**
 * Handlername имеет вид: "path/to/handler arg1 arg2 arg3"
 * Current handler (вывод) имеет вид: { name, type, args: [] }
 * @param {String} handlername
 * @param {String} handlertype
 * @returns Object - current handler
 */
const _parse_handlername = (handlername = '', handlertype = '') => {
  if (!handlername) return {};

  const parts = handlername.split(' ');
  const parsedname = regexps.handlername.test(parts[0]) ? parts[0] : null;
  parts.shift();

  return ({
    name: parsedname,
    type: handlertype || null,
    args: parts,
  });
}

