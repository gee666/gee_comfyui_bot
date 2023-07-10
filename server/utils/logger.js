import fs from "fs";
import { Console } from 'console';
import moment from 'moment';
import config from '../../config';

if (!fs.existsSync('./log')) fs.mkdirSync('./log');

const output = fs.createWriteStream('./log/access.log',{flags: 'a'});
const error = fs.createWriteStream('./log/error.log',{flags: 'a'});

const logger = new Console(output, error);


const extend_console = () => {
  const prefix = '_original_method_';

  Object.getOwnPropertyNames(console).forEach(method => {
    if (!~method.indexOf(prefix) && typeof console[method] === 'function') {
      console[prefix + method] = console[method];

      console[method] = function() {
        if (method === 'debug' && ! config.DEBUG) return;
        console[prefix + method].apply(console, arguments);

        const date = moment().format('DD.MM.YYYY HH:mm:ss:');

        if(~['log', 'warn', 'debug', 'info', 'error'].indexOf(method)) {
          Array.prototype.unshift.call(arguments,date);
          logger[method].apply(logger,arguments);

        }
      }
    }
  });
}

export default extend_console;
