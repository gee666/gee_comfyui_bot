import fs from 'fs/promises';
import { existsSync } from 'fs';
import _ from 'lodash';
import moment from 'moment';

const EXPECTED_INPUT_LIFETIME = 24 * 60 * 60 * 1000;

export class TelegramSession {
  constructor (from_id) {
    this.session_key = +from_id || 0;
    this.sessions_path = `server/resources/sessions`;
    this.session_file_path = `${this.sessions_path}/${this.session_key}.json`;
    this._data = null;
    this._keyboard = null;
    this._handler_history = null;
    this._expected_input = null;
  }

  get data() {
    return !_.isEmpty(this._data) ? this._data : {};
  }

  get keyboard() {
    return !_.isEmpty(this._keyboard) ? this._keyboard : [];
  }

  get handler_history() {
    return !_.isEmpty(this._handler_history) ? this._handler_history : [];
  }

  get expected_input() {
    return +moment() - +moment(this._expected_input?.dt_create) <= EXPECTED_INPUT_LIFETIME ?
            this._expected_input?.action || null : null;
  }

  set data(value) {
    this._data = !_.isEmpty(value) ? value : null;
  }

  set keyboard(value) {
    this._keyboard = !_.isEmpty(value) ? value : null;
  }

  set handler_history(value) {
    this._handler_history = !_.isEmpty(value) ? value : null;
  }

  set expected_input(value) {
    this._expected_input = value ? { action: value, dt_create: moment().format('YYYY-MM-DD hh:mm:ss') } : null;
  }

  async save() {
    if (! this.session_key) return;

    if (_.isEmpty(this._data) && _.isEmpty(this._keyboard) && _.isEmpty(this._handler_history) && _.isEmpty(this._expected_input)) {
      await this._deleteSession();
    } else {
      await this._saveSession();
    }
  }

  async _saveSession() {
    if (! this.session_key) return;

    // writes new file if the file doesn't exist
    // if the folder doesn't exists - creates the folder

    await fs.mkdir(this.sessions_path, { recursive: true });

    await fs.writeFile(this.session_file_path, JSON.stringify({
      data: this._data,
      keyboard: this._keyboard,
      handler_history: this._handler_history,
      expected_input: this._expected_input,
    }));
  }

  async _deleteSession() {
    if (! this.session_key) return;

    await fs.writeFile(this.session_file_path, '');
  }

  async load() {
    if (! this.session_key) return;

    if (existsSync(this.session_file_path)) {
      let __jsondata = await fs.readFile(this.session_file_path, 'utf8');
      if (__jsondata) {
        try {
          __jsondata = JSON.parse(__jsondata);
          this._data = __jsondata.data || {};
          this._keyboard = __jsondata.keyboard || [];
          this._handler_history = __jsondata.handler_history || [];
          this._expected_input = __jsondata.expected_input || null;
        } catch (e) {
          throw e;
        }
      }
    }
  }

}