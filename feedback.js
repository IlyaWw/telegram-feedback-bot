const googleapi = require('./googleapi');
const { format } = require('date-fns');

const saveFeedback = (ctx) => {
  const {
    update: {
      message: {
        from: { first_name, last_name, username },
        text,
        date,
      },
    },
    session: { topic },
  } = ctx;
  const formattedDate = format(date * 1000, 'yyyy-MM-dd hh:mm:ss');
  console.log(
    `${formattedDate} [${first_name} ${last_name} ${username}] ${topic}: ${text}`
  );

  googleapi([formattedDate, first_name, last_name, username, topic, text]);
};

module.exports.saveFeedback = saveFeedback;
