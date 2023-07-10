import moment from 'moment';
import _ from "lodash";
import fs from 'fs';
import error_handler from '../middleware/error_handler';


export const _random = (min = 0, max = 1000) => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

// export const _require = (filepath) => {
//   if (filepath && fs.existsSync(filepath)) {
//     return require(filepath);
//   }
//   return {};
// }

export const _require = (...filepaths) => {
  let result;

  for (let i=0; i<filepaths.length; i++) {
    if (filepaths[i] && fs.existsSync(filepaths[i])) {
      result = require(filepaths[i]);
      break;
    }
  }

  return (result || {});
}

export const wait = async (ms = 1000) =>{
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const foreach_with_pause = async (list, callback) => {
  for(let i=0; i < list.length; i++) {
    if ( i%20 == 0 ) await wait(1000);
    if (typeof callback === 'function') {
      await callback(list[i], i);
    }
  }
}

export const find_in_handlers = (ctx, name) => {
  const reg = new RegExp('(^|/)' + name + '(/|\s|$)');

  if (reg.test(ctx.handler.name)) return true;
  if (~_.findIndex((ctx.handler.hystory || []), o => reg.test(o.name || '') )) return true;
  return false;
}


export const make_time_interval = (dt_start, dt_end) => {
  if (!moment.isMoment(dt_start)) dt_start = moment(dt_start);
  if (!moment.isMoment(dt_end)) dt_end = moment(dt_end);
  if(! dt_start.isValid()) return '';
  if(! dt_end.isValid()) return '';

  if (dt_start.isSame(dt_end, 'minutes')) {
    return dt_start.format('H:mm');
  }
  return `${dt_start.format('H:mm')} - ${dt_end.format('H:mm')}`
}

export const make_date_interval = (dt_start, dt_end) => {
  if (!moment.isMoment(dt_start)) dt_start = moment(dt_start);
  if (!moment.isMoment(dt_end)) dt_end = moment(dt_end);
  if(! dt_start.isValid()) return '';
  if(! dt_end.isValid()) return '';

  if (dt_start.isSame(dt_end, 'day')) {
    return dt_start.format('DD MMMM YYYY');
  }
  if (dt_start.isSame(dt_end, 'month')) {
    return `${dt_start.format('DD')} - ${dt_end.format('DD MMMM YYYY')}`;
  }
  if (dt_start.isSame(dt_end, 'year')) {
    return `${dt_start.format('DD MMMM')} - ${dt_end.format('DD MMMM YYYY')}`;
  }
  return `${dt_start.format('DD MMMM YYYY')} - ${dt_end.format('DD MMMM YYYY')}`;
}


