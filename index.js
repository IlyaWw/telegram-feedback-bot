require('dotenv').config();
const { TELEGRAM_TOKEN, COMPANY_NAME } = process.env;
const { Telegraf, Markup, session } = require('telegraf');
const { saveFeedback } = require('./feedback');

const msgWelcome = `Добро пожаловать в чат бот компании *${COMPANY_NAME}*. Здесь вы можете оставить обратную связь по работе с нашим оборудованием.`;
const msgMain =
  'Пожалуйста, выберите одну из следующих опций:\n⭐ - Оставить отзыв о работе оборудования\n❗ - Сообщить об ошибке/неисправности оборудования\n💬 - Оставить пожелания по улучшению работы оборудования';
const topicObj = {
  review: {
    id: 'review',
    button: '⭐ Отзыв',
    preface: 'Пожалуйста, оставьте отзыв о работе оборудования:',
    epilog:
      'Благодарим вас за обратную связь. Ваши отзывы помогают нам стать лучше.',
  },
  report: {
    id: 'report',
    button: '❗ Ошибка',
    preface:
      'Сообщите, пожалуйста, с какой проблемой вы столкнулись в ходе работы с оборудованием.',
    // TODO: process images and videos
    //'Сообщите, пожалуйста, с какой проблемой вы столкнулись в ходе работы с оборудованием. Будем благодарны вам, если вы подгрузите фото- или видео-подтвержение ошибки, чтобы мы могли оперативно вам помочь.',
    epilog: 'Спасибо. Мы обязательно решим данную проблему в ближайшее время.',
  },
  suggest: {
    id: 'suggest',
    button: '💬 Пожелание',
    preface: 'Пожалуйста, оставьте пожелания по улучшению работы оборудования:',
    epilog:
      'Благодарим вас за обратную связь. Ваши пожелания помогают нам стать лучше.',
  },
};

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
