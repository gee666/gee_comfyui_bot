import { Telegraf } from 'telegraf'
import axios from 'axios';
import https from 'https';
import config from '../config';
import {
  apply_handler_to_action,
  apply_handler_to_expected_input,
  apply_handler_to_command,
  apply_handler_to_text_button,
  apply_handler_to_unhandled_messages,
  run_handler
} from './middleware/apply_handler';
import auth from './middleware/auth';
import session from './middleware/session';
import keyboard from './middleware/keyboard';
import error_handler from './middleware/error_handler';

import extend_console from './utils/logger';

import moment from 'moment';
moment.locale('en');

extend_console();

axios.interceptors.request.use(axios_config => {
  if (!config.AXIOS.rejectUnauthorized) {
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    axios_config.httpsAgent = agent;
  }
  return axios_config;
});

const bot = new Telegraf(config.TELEGRAM_BOTS.thebot);

bot.use(session);
bot.use(keyboard);
bot.use(auth);

// Порядок имеет значение
// Применяется только первый найденный обработчик,
// Остальные игнорируются
bot.action(/.*/, apply_handler_to_action);
bot.on('message', apply_handler_to_text_button);
bot.on('message', apply_handler_to_command);
bot.use(apply_handler_to_expected_input);
bot.use(apply_handler_to_unhandled_messages);

bot.use(run_handler);


bot.catch(error_handler);

bot.launch();

process.on('unhandledRejection', (err, p) => {
  error_handler(err, { project_section: 'unhandledRejection' } );
});

process.once('SIGINT', () => {
  cron_stop();
  bot.stop('SIGINT');
  db.endConnection();
});

process.once('SIGTERM', () => {
  cron_stop();
  bot.stop('SIGTERM');
  db.endConnection();
});

