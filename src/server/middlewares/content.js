const { rest, readItems } = require("@directus/sdk");

const pages = (req, res, next) => {
    const directus = req.public_access.with(rest());

    directus
        .request(readItems("pages?filter[status]=published"))
        .then(pages => req.pages = pages)
        .then(() => next());
}

const content = {
    pages
}

module.exports = content;
