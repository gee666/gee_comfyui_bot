
# gee_comfyui_bot

I created this bot to give my friends a possibility to play with my ComfyUI workflows without installing it and without even knowing what ComfyUI is.

With this bot, you can:
- Run your custom workflows directly in Telegram, without the need to install anything or have prior knowledge of ComfyUI.
- Prompt your users for inputs, aspect ratios, and models they want to use.
- Rerun prompts with different seeds for endless creative possibilities.
- View the resulting image (currently supports displaying one image).

Here's how it works:
1. You add your workflows to a designated folder.
2. Specify the parameters you want to ask the user for, such as prompts, models, and aspect ratios.
3. The bot will present all your workflows to the user by name, allowing them to choose the desired workflow.
4. It will then ask the necessary questions, run the workflow, and display the resulting image to the user.

So it's a way to share your workflows with people who don't want to learn or install it.

## Prerequisites

Before starting, ensure you have:
- git and nodejs installed
- A working ComfyUI instance.
- https://github.com/Acly/comfyui-tooling-nodes installed in your ComfyUI
- A Telegram bot token (create one using the @botFather bot on Telegram).

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository link> .
npm install
```

Create a `.env` file in the root directory, using `.env.example` as a guide. Fill it with your specific settings. Note that in this basic version, the bot grants access only to users specified in the `.env` file.
If the user is not in your allow list, they will see their user_id in their start message, so they can tell you to add them

Add your workflows (read below how to do that)

Then, start the bot:

```bash
npm start
```

**Note:** The default example workflows might not work in your ComfyUI setup, so it's advisable to review and adjust them as needed.

## Adding Workflows to the bot

To add a ComfyUI workflow to the bot:

1. Create and export your ComfyUI workflow as a `.json` file via the menu in the ComfyUI: workflow => export API.
2. Open the workflows folder in your bot, here: `comfyuibot/server/resources/templates/workflows_custom`

### Modifying Workflows for the Bot

1. Duplicate any example workflow file.
2. Insert your JSON code within the `return ()` statement into the "prompt" field (refer to the example workflow for format).
3. Update the settings at the top of the file:
   - `title`: Displayed to users in the Telegram bot.
   - `description`: Shown below the title.
   - `request_user_for`: Defines user choices. Each "command" is a request to the user. You have 3 ocommand options:
     - `model`: The bot will ask the user to choose a model from the list in `config.js`.
     - `prompt`: The bot will prompt the user for input.
     - `ar`: The bot will ask user for an aspect ratio.
   - `key`: Specifies how to reference user responses in your workflow.
4. Locate in your workflow where to replace options with user responses (use Ctrl+F for searching). Replace default values with user-chosen options (see default workflows for examples).
5. OPTIONAL: Add example images created with this workflow to `comfyuibot/server/resources/img/workflows_custom`. Name the folder exactly like your workflow file. The bot will display the examples to your user together with workflow descrition.

**Note:** This bot displays only one resulting image. If your workflow outputs multiple images, only the first will be shown.

---

## Contributing

Feel free to fork, submit pull requests or suggest improvements.
