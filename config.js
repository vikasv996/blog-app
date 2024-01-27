const config = {
    production: {
        DEBUG: false,
        PROD: true,
        port: 40040,
        dbName: "peerbits",
        MONGO_URI: "mongodb+srv://vikas:74123@shoppoppcluster.jzxdj.mongodb.net/peerbits?retryWrites=true&w=majority"
    },
    development: {
        DEBUG: true,
        PROD: false,
        port: 4040,
        dbName: "peerbits",
        MONGO_URI: "mongodb+srv://vikas:74123@shoppoppcluster.jzxdj.mongodb.net/peerbits?retryWrites=true&w=majority",
        ACCESS_TOKEN_SECRET: "a5addb4e50500cd1bb47533c72e26795a2490042d8c11403fb5d0f9db75c9e69"
    }
};
exports.get = function get(env) {
    return config[env] || config.development;
};
