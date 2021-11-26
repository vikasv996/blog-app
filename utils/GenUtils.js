const bcrypt = require('bcrypt');

module.exports.encryptPwd = async pwd => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(pwd, salt);
    } catch (err) {
        throw err;
    }
}

module.exports.checkPwd = async (pwd, hash) => {
    try {
        return await bcrypt.compare(pwd, hash);
    } catch (err) {
        throw err;
    }
}