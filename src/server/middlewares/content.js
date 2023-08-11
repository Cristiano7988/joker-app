const { rest, readItems, readItem } = require("@directus/sdk");

const pages = (req, res, next) => {
    const directus = req.public_access.with(rest());

    directus
        .request(readItems("templates", { filter: { status: "published" } }))
        .then(pages => req.pages = pages)
        .then(() => next());
}

const components = (req, res, next) => {
    const directus = req.public_access.with(rest());
    const { id } = req.params;
    directus
        .request(readItem("components", id, { filter: { status: "published" } }))
        .then(components => req.components = components)
        .then(() => next());
}

const content = {
    pages,
    components
}

module.exports = content;
