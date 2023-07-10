import { Markup } from 'telegraf';
import config from "../../../../config";
import _ from 'lodash';
import path from 'path';
import fs from 'fs/promises';
import { redirect_handler } from '../../../middleware/apply_handler';
import { _require } from '../../../utils/utils';


const WORKFLOWS_PATH = path.resolve(__dirname, '../../../resources/templates/workflows');
const WORKFLOWS_EXAMPLES_PATH = path.resolve(__dirname, '../../../resources/img/workflows');
const DEFAULT_REQUEST_USER_FOR = [
  {
    command: 'model',
    key: 'model',
    message: 'Choose a model you want to play with',
  },
  {
    command: 'ar',
    key: 'ar',
    message: 'Choose aspect ratio for your image',
  },
  {
    command: 'prompt',
    key: 'prompt',
    message: 'Write me the prompt for your masterpiece',
  },
  {
    command: 'prompt',
    key: 'negative_prompt',
    message: "Tell me now what you don't want to see (negative prompt)",
  },
];

export default async (ctx) => {
  const commandname = ctx.handler.args[0];
  const workflowfilename = `${commandname}.js`;
  let workflowfile;
  try {
    workflowfile = _require(`${WORKFLOWS_PATH}/${workflowfilename}`);
  } catch (err) {}

  if (!commandname || !workflowfile) {
    return await _request_workflow(ctx);
  }

  if (!ctx.session.current_generation) {
    ctx.session.current_generation = {};
  }
  ctx.session.current_generation.workflow = workflowfile?.params;
  ctx.session.current_generation.workflow.commandname = commandname;
  ctx.session.current_generation.workflow.filename = workflowfilename;
  if (!ctx.session.current_generation.workflow.request_user_for?.length) {
    ctx.session.current_generation.workflow.request_user_for = DEFAULT_REQUEST_USER_FOR;
  }


  await _send_examples(ctx);

  ctx.session.current_generation.workflow.request_user_index = 0;
  const next_command = ctx.session.current_generation.workflow.request_user_for[0]?.command;
  await redirect_handler(ctx, `play/${next_command}`);
}

const _request_workflow = async (ctx) => {
  ctx.text_buttons.clean();

  let workflowlist = await fs.readdir(WORKFLOWS_PATH);

  if (!workflowlist.length) {
    return await ctx.telegram.sendMessage(
      ctx.from.id,
      ctx.templates.message_no_workflows(),
      {
        parse_mode: 'HTML',
        ...ctx.text_buttons.get(),
      }
    );
  }

  let workflowtitles = [];

  _.shuffle(workflowlist).forEach((workflowfilename) => {
    const workflowfile = _require(`${WORKFLOWS_PATH}/${workflowfilename}`);
    const workflow = workflowfile.params;

    const commandname = workflowfilename.replace('.js', '');
    const title = workflow?.title || commandname;
    const description = workflow?.description || '';

    workflowtitles.push(`🔸<b>${title}</b>\n<i>${description}</i>\n`);

    ctx.text_buttons.add(title, `play/workflow ${commandname}`);
  });

  workflowtitles = workflowtitles.join('\n');

  return await ctx.telegram.sendMessage(
    ctx.from.id,
    ctx.templates.message({ workflows: workflowtitles }),
    {
      parse_mode: 'HTML',
      ...ctx.text_buttons.get(),
    }
  );
}

const _send_examples = async (ctx) => {
  const workflow = ctx.session.current_generation.workflow;
  let list;
  try {
    list = await fs.readdir(`${WORKFLOWS_EXAMPLES_PATH}/${workflow.commandname}`);
  } catch (err) {}

  if (!list?.length) {
    return;
  }

  const srclist = list.map((filename) => {
    return ({
      media: { source: `${WORKFLOWS_EXAMPLES_PATH}/${workflow.commandname}/${filename}` },
      type: 'photo',
    });
  });

  await ctx.telegram.sendMediaGroup(
    ctx.from.id,
    srclist,
    {
      parse_mode: 'HTML',
      caption: ctx.templates.message_examples(),
    }
  );
}

