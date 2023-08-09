const { createDirectus, authentication, staticToken } = require("@directus/sdk");
const { STATIC_TOKEN, DIRECTUS_URL } = require("../config");
const directus = createDirectus(DIRECTUS_URL).with(authentication());

const dynamic_access = (req, res, next) => {
    const { email, password } = req.body;

    directus.login(email, password)
        .then(private_access => req.private_access = private_access)
        .then(() => next())
        .catch(error => res.send(error));
}

const static_access = (req, res, next) => {
    const public_access = directus.with(staticToken(STATIC_TOKEN));
    req.public_access = public_access;
    next();
}

const auth = {
    dynamic_access,
    static_access
}

module.exports = auth;
