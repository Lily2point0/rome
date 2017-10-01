require('dotenv').config();
module.exports = {
    token: 	process.env.CONFIG_SLACK_TOKEN,
    botname: process.env.CONFIG_SLACK_BOT
};
