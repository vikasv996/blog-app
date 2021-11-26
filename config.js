const config = {
    production: {
        DEBUG: false,
        PROD: true,
        port: 40040,
        dbName: "peerbits"
    },
    development: {
        DEBUG: true,
        PROD: false,
        port: 4040,
        dbName: "peerbits"
    }
};
exports.get = function get(env) {
    return config[env] || config.development;
};
