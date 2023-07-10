import error_handler from "../../middleware/error_handler";

const TIMEOUT = 3000;

/**
 * ОЧИЩАЕТ КНОПКИ!!!
 *
 * const wait = new WaitMessage(ctx);
 * await wait.send(text[optional]);
 * Отправляет сообщение о ожидании с текстом "Немного терпения..." по-умолчаию
 * Каждые 10 секнуд меняет сообщение на рандомное сообщение об ожидании
 *
 * await wait.remove();
 * Удаляет сообщение и очищает таймер
 *
 * wait.clear();
 * очищает таймер без удаления
 */
export class WaitMessage {
  constructor(ctx) {
    this.ctx = ctx;
    this.message = null;
    this.timerId = null;
    this.messageIndex = 0;
  }

  async send (text) {
    const { ctx } = this;
    const _refresh_first_wait_message = this._refresh_first_wait_message.bind(this);

    // отправляем сообщение с очисткой кнопок
    ctx.text_buttons.clean();
    this.message = await ctx.telegram.sendMessage(
      ctx.from.id,
      text || ctx.common_templates.wait(),
      {
        parse_mode: 'HTML',
        ...ctx.text_buttons.get(),
      }
    );

    this.timerId = setTimeout(_refresh_first_wait_message, TIMEOUT);
  };

  async _refresh_first_wait_message  () {
    const { ctx, message } = this;
    const _refresh_wait_message = this._refresh_wait_message.bind(this);
    const _randomIndex = this._randomIndex.bind(this);
    const stop = this.stop.bind(this);

    try {
      if (!message?.message_id) {
        stop();
        return;
      }

      try {
        // удаляем нередактируемое сообщение
        await ctx.telegram.deleteMessage(
          ctx.from.id,
          message.message_id
        );

        // отправляяем редактируемое сообщение без кнопок
        this.message = await ctx.telegram.sendMessage(
          ctx.from.id,
          ctx.common_templates.wait({ index: _randomIndex() }),
          {
            parse_mode: 'HTML',
          }
        );
      } catch (err) {}

      this.timerId = setTimeout(_refresh_wait_message, TIMEOUT);

    } catch (err) {
      stop();
      error_handler(err, ctx, true);
    }
  }

  async _refresh_wait_message  () {
    const { ctx, message } = this;
    const _refresh_wait_message = this._refresh_wait_message.bind(this);
    const _randomIndex = this._randomIndex.bind(this);
    const stop = this.stop.bind(this);
    try {
      if (!message?.message_id) {
        stop();
        return;
      }

      try {

        await ctx.telegram.editMessageText(
          ctx.from.id,
          message.message_id,
          undefined,
          ctx.common_templates.wait({ index: _randomIndex() }),
          {
            parse_mode: 'HTML',
          }
        );

      } catch (err) {}

      this.timerId = setTimeout(_refresh_wait_message, TIMEOUT);

    } catch (err) {
      stop();
      error_handler(err, ctx, true);
    }
  };

  stop () {
    if (!this.timerId) return;
    clearTimeout(this.timerId);
    this.timerId = null;
  }

  async remove () {
    const { ctx, message } = this;
    const stop = this.stop.bind(this);
    stop();

    if (!message?.message_id) {
      return null;
    }

    try {
      await ctx.telegram.deleteMessage(
        ctx.from.id,
        message.message_id
      );
    } catch (err) {}
  }

  _randomIndex() {
    const { ctx, messageIndex } = this;
    const length = ctx.common_templates._wait_messages.length;
    const _r = Math.floor(Math.random() * length);
    if (_r === messageIndex) {
      return this._randomIndex();
    }
    this.messageIndex = _r;
    return _r;
  }
}