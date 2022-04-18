require('dotenv').config();
const { TELEGRAM_TOKEN } = process.env;
const { Telegraf, Markup, session } = require('telegraf');
const { saveFeedback } = require('./feedback');
const { msgWelcome, msgMain, topicObj } = require('./constants/messages');

const getMainMenu = (ctx) => {
  ctx.session = ctx.session || {};
  ctx.reply(msgMain, keyboard);
};
const keyboard = Markup.inlineKeyboard(
  Object.keys(topicObj).map((key) =>
    Markup.button.callback(topicObj[key].button, key)
  )
);

const bot = new Telegraf(TELEGRAM_TOKEN);
bot.use(session());
bot.start((ctx) => {
  ctx.session = ctx.session || {};
  ctx.replyWithMarkdown(`${msgWelcome}\n\n${msgMain}`, keyboard);
});
bot.help(getMainMenu);
bot.command('menu', getMainMenu);

for (let key in topicObj) {
  bot.action(key, (ctx) => {
    ctx.session = ctx.session || {};
    ctx.session.topic = key;
    ctx.reply(topicObj[key].preface);
  });
}

bot.on('text', (ctx) => {
  ctx.session = ctx.session || {};
  if (ctx.session.topic) {
    saveFeedback(ctx);
    ctx.reply(topicObj[ctx.session.topic].epilog);
  } else {
    getMainMenu(ctx);
  }
  ctx.session.topic = '';
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
