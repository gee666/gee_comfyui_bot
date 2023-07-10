export default (err = {}, ctx = {}, handled = false) => {
  if (err.code === 'ETIMEDOUT') throw err;

  switch(ctx.project_section){
    case 'cron':
      console.error('===== cron error begin =====');
      console.error('error: ', err);
      console.error('handler: ', ctx.handler);
      if (handled) console.error('Ошибка была обработана и проглочена приложением');
      console.error('===== cron error end =====');
      break;
    case 'unhandledRejection':
      console.error('=== UNHANDLED REJECTION ===');
      console.error(err);
      console.error('=== END UNHANDLED REJECTION ===');
      process.exit(1);
      break;
    default:
      console.error('===== error begin =====');
      console.error('error: ', err);
      console.error('message: ', ctx.message);
      console.error('session: ', ctx.session);
      console.error('user: ', ctx.user);
      console.error('handler: ', ctx.handler);
      if (handled) console.error('Ошибка была обработана и проглочена приложением');
      console.error('===== error end =====');
  }
}
