
# gee_comfyui_bot

A Telegram bot for interacting with ComfyUI workflows. This bot enables users to engage with ComfyUI workflows through Telegram without needing any prior knowledge about ComfyUI.

## Prerequisites

Before starting, ensure you have:
- A working ComfyUI instance.
- A Telegram bot token (create one using the @botFather bot on Telegram).

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository link> .
npm install
```

Create a `.env` file in the root directory, using `.env.example` as a guide. Fill it with your specific settings. Note that in this basic version, the bot grants access only to users specified in the `.env` file.

Then, start the bot:

```bash
npm start
```

**Note:** The default example workflows might not work in your ComfyUI setup, so it's advisable to review and adjust them as needed.

## Adding Workflows to the bot

To add a ComfyUI workflow to the bot:

1. Create and export your ComfyUI workflow as a `.json` file.
2. Open the workflows folder in your bot, here: `/var/www/workshop/oira666/comfyuibot/server/resources/templates/workflows`

### Modifying Workflows for the Bot

1. Duplicate any default workflow file.
2. Insert your JSON code within the `return ()` statement (refer to the example workflow for format).
3. Update the settings at the top of the file:
   - `title`: Displayed to users in the Telegram bot.
   - `description`: Shown below the title.
   - `request_user_for`: Defines user choices. Each "command" is a request to the user. You have 3 ocommand options:
     - `model`: The bot will ask the user to choose a model from the list in `config.js`.
     - `prompt`: The bot will prompt the user for input.
     - `ar`: The bot will ask user for an aspect ratio.
   - `key`: Specifies how to reference user responses in your workflow.
4. Locate in your workflow where to replace options with user responses (use Ctrl+F for searching). Replace default values with user-chosen options (see default workflows for examples).
5. Add example images created with this workflow to `/var/www/workshop/oira666/comfyuibot/server/resources/img/workflows`. Name the folder exactly like your workflow file.

**Note:** This bot displays only one image. If your workflow outputs multiple images, only the first will be shown.

---

## Contributing

Feel free to fork, submit pull requests or suggest improvements.
