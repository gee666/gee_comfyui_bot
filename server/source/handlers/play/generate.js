import { Markup } from 'telegraf';
import path from 'path';
import WebSocket from 'ws';
import crypto from 'crypto';
import axios from 'axios';
import config from '../../../../config';
import { redirect_handler } from '../../../middleware/apply_handler';
import { WaitMessage } from '../../classes/WaitMessage';
import { _require } from '../../../utils/utils';


const WORKFLOWS_PATH = path.resolve(__dirname, '../../../resources/templates/workflows');
const MAX_WAITING_TIME = 10 * 60 * 1000;

// ПРИНИМАЕТ И ПОКАЗЫВАЕТ ТОЛЬКО ОДНУ ПЕРВУЮ СОЗДАННУЮ КАРТИНКУ
// НЕ РАБОТАЕТ С WORKFLOW КОТОРЫЕ ДЕЛАЮТ ПО НЕСКОЛЬКО КАРТИНОК

export default async (ctx) => {
  const wait = new WaitMessage(ctx);
  await wait.send("Wait a bit, I'm working on it...");

  let execution_status = "let's go";

  const client_id = crypto.randomUUID();
  const current_generation = ctx.session.current_generation || {};
  const workflowfilename = current_generation.workflow?.filename;
  if (!workflowfilename) {
    await wait.remove();
    await _send_error(ctx, 'Workflow filename is not defined');
    return;
  }

  const workflowfile = _require(`${WORKFLOWS_PATH}/${workflowfilename}`);
  if (!workflowfile || !workflowfile.make_query_object) {
    await wait.remove();
    await _send_error(ctx, 'Workflow file is not found');
    return;
  }

  current_generation.client_id = client_id;
  const queryobject = workflowfile.make_query_object(current_generation);

  try{
    const response = await axios.post(`http://${config.COMFY_UI_URL}/prompt`, JSON.stringify(queryobject), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.status != 200) throw new Error('Comfy UI returned non-200 status code');

    const prompt_id = response?.data?.prompt_id;

    if (!prompt_id) throw new Error('Comfy UI did not return prompt_id');

    execution_status = 'waiting';

    const socket = new WebSocket(`ws://${config.COMFY_UI_URL}/ws?clientId=${client_id}`);

    setTimeout(async () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
      if (execution_status !== 'executed') {
        await wait.remove();
        await _send_error(ctx, `Socket timeout - waiting time more than ${MAX_WAITING_TIME / 1000 / 60} minutes`);
      }
    }, MAX_WAITING_TIME);

    socket.on('message', async (data) => {
      if (Buffer.isBuffer(data)) data = data.toString();
      try {
        data = JSON.parse(data);
      } catch (err) {}

      const images = data?.data?.output?.images;
      if (data?.type === 'executed' && data?.data?.prompt_id === prompt_id && images?.length > 0) {
        execution_status = 'executed';
        socket.close();
        await wait.remove();

        // первая картинка доделана
        // берем первую картинку, остальные даже не ждём
        const firstimage = images[0];
        await _send_picture(ctx, firstimage);
      }
    });

    socket.on('error', async (data) => {
      execution_status = 'error';
      await wait.remove();
      await _send_error(ctx, data);
      socket.close();
    });

  } catch (err) {
    execution_status = 'error';
    await wait.remove();
    return await _send_error(ctx, err);
  }
}

const _shorten = (prompt) => {
  if (prompt.length > 40) {
    return prompt.slice(0,40) + '...';
  }
  return prompt;
}

const _send_picture = async (ctx, image) => {
  try{
    const img_url = `http://${config.COMFY_UI_URL}/view?filename=${image.filename}&subfolder=${image.subfolder}&type=${image.type}`;
    const response = await axios.get(img_url,{
      responseType: 'arraybuffer',
    });

    const current_generation = ctx.session.current_generation || {};

    const caption = `
Here is your masterpiece, enjoy!

${current_generation.model ? `<b>${current_generation.model}</b>` : ''}
${current_generation.prompt ? `✅ ${_shorten(current_generation.prompt)}` : ''}
${current_generation.negative_prompt ? `❌ ${_shorten(current_generation.negative_prompt)}` : ''}

You want one more? Click /play.
Or click /rerun to run the last prompt again
    `;

    await ctx.telegram.sendPhoto(
      ctx.from.id,
      {
        source: response.data,
      },
      {
        caption,
        parse_mode: 'HTML',
      }
    );

  } catch (err) {
    await _send_error(ctx, err);
  }
}

const _send_error = async (ctx, err) => {
  return await ctx.telegram.sendMessage(
    ctx.from.id,
    ctx.common_templates.unknown_error({ error: JSON.stringify(err) }),
    {
      parse_mode: 'HTML',
      ...Markup.removeKeyboard(),
    }
  );
}