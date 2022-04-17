const { format } = require('date-fns');

const saveFeedback = (ctx) => {
  const {
    update: {
      message: {
        from: { username },
        text,
        date,
      },
    },
  } = ctx;
  const formattedDate = format(date * 1000, 'yyyy-MM-dd hh:mm:ss');
  console.log(`${formattedDate} [${username}]: ${text}`);
};

module.exports.saveFeedback = saveFeedback;
