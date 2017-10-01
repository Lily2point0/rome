require('dotenv').config();
module.exports = {
    host: 	process.env.CONFIG_EMAIL_HOST,
    username: process.env.CONFIG_EMAIL_USER,
    password: process.env.CONFIG_EMAIL_PASSWORD, 
};
