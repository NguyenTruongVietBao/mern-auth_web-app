const WHITELIST_DOMAIN = require('../utils/constants')

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (WHITELIST_DOMAIN.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

module.exports = {corsOptions}
