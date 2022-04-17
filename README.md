# telegram-feedback-bot

Simple bot for getting users feedback.

## To run

1. Rename `.env.example` to `.env`.
2. Create telegram bot token and add to `.env`.
3. Create [Google Cloud Platform project and enable API](https://developers.google.com/workspace/guides/create-credentials#desktop-app).
4. Create and download `credentials.json` from Google Cloud.
5. Create google spreadsheet and write it's ID to `.env`.
6. Run `npm install`.
7. Run `npm start`.

## References

Based on [Telegraf framework](https://github.com/telegraf/telegraf).
Logs are stored in google spreadsheet using [googleapis](https://www.npmjs.com/package/googleapis).

## TODOs

- Attach images and videos to report messages
- Forward report messages to support telegram chat
- Send report e-mail

## Changelog

### Version 0.0.2:

- Writes feedback to google spreadsheet

### Version 0.0.1:

- Shows keyboard button to choose feedback type
- Writes feedback to console
