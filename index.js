require('dotenv').config();
const { TELEGRAM_TOKEN } = process.env;
const { Telegraf, Markup, session } = require('telegraf');
const { saveFeedback } = require('./feedback');
const {
  msgWelcome,
  msgHelp,
  msgSN,
  btnCancel,
  msgCancel,
  topics,
} = require('./constants/messages');

const feedbackKeyboard = Markup.keyboard(topics.map((topic) => topic.button));
const cancelKeyboard = Markup.keyboard([btnCancel]).resize();
const topicsRegExp = new RegExp(topics.map((topic) => topic.button).join('|'));
const cancelRegExp = new RegExp(`^${btnCancel}$`);

const clearSession = (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.topic = '';
  ctx.session.sn = '';
};

const bot = new Telegraf(TELEGRAM_TOKEN);

bot.use(session());
bot.start((ctx) => {
  ctx.reply(msgWelcome, feedbackKeyboard);
});
bot.help((ctx) => {
  clearSession(ctx);
  ctx.reply(msgHelp, feedbackKeyboard);
});

bot.hears(topicsRegExp, (ctx) => {
  ctx.session = ctx.session || {};
  const topic = topics.find((topic) => topic.button === ctx.match[0]);

  if (topic && !ctx.session.topic) {
    ctx.session.topic = topic.id;
    ctx.reply(msgSN, cancelKeyboard);
  }
});

bot.hears(cancelRegExp, (ctx) => {
  clearSession(ctx);
  ctx.reply(msgCancel, feedbackKeyboard);
});

bot.on('text', (ctx) => {
  ctx.session = ctx.session || {};
  const { text } = ctx.update.message;

  if (ctx.session.topic && text !== btnCancel) {
    const topic = topics.find((topic) => topic.id === ctx.session.topic);

    if (ctx.session.sn) {
      saveFeedback(ctx);
      if (topic) {
        ctx.reply(topic.epilog, feedbackKeyboard);
        clearSession(ctx);
      }
    } else {
      ctx.session.sn = text;

      if (topic) ctx.reply(topic.preface);
    }
  }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
