# gee_comfyui_bot

Telegram bot to play with ComfyUI workflows
I created it to let my friends play with my comfyui workflows via telegram without learning how to use it and what is comfyui at all. 

So first of all you should have a working comfyui instance and a telegram bot token.
You can create telegram bot token using the @botFather bot in telegram

Installation:

```
git clone <repository link> .
npm install
```
create an .env file in the root directory using the .env.example file as an example. Populate it with your settings.
In this simpliest version the bot doesn't track users, so it will allow the access only to the users in the .env file

then run

```
npm start
```


Add workflows:

Create a comfyui workflow you want to share in the bot
Export is as a .json file
add your json file here:

You can add workflows and start working with them

note: this bot will only display one picture, so if your workflow ouputs several pictures, they will be just lost. 
