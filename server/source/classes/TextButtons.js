import { _ } from 'lodash';
import { Markup } from 'telegraf';

export class TextButtons {
  constructor(keyboard) {
    this.keyboard = keyboard;
    this._list = [];
    this._markup_buttons = [];

    (this.keyboard || []).slice().forEach(button => {
      this.add(button.caption, button.action);
    });
  }

  count() {
    return this._markup_buttons.length;
  }

  add(caption, action) {
    if (! _.find(this.keyboard, {caption, action})) {
      this._markup_buttons.push(Markup.button.text(caption));
      if(_.isEmpty(this.keyboard)) this.keyboard = [];
      this.keyboard.push({caption, action});
    }
  }

  get({ columns } = {}) {
    const _columns = columns || (this.count() <= 4 ? 1 : 2);

    if (this.count() === 0) {
      return Markup.removeKeyboard();
    } else {

      return Markup.keyboard(
        this._markup_buttons,
        { columns: _columns }
      )
      .resize();
    }
  }

  clean() {
    this.keyboard = null;
    this._markup_buttons = [];
  }
}
