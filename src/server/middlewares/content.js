const { rest, readItems, readItem } = require("@directus/sdk");

const page = (req, res, next) => {
    try {
        const directus = req.public_access.with(rest());
        const { slug } = req.params;

        directus
            .request(readItems("templates", {
                filter: {
                    status: "published",
                    slug
                }
            }))
            .then(pages => req.page = pages[0])
            .then(() => next())
            .catch(error => {
                console.log({error});
                next();
            });
    } catch (error) {
        console.log(error);
        next();
    }
}

const nestedPage = (req, res, next) => {
    try {
        const directus = req.public_access.with(rest());
        const parentSlug = req.page.slug.replace("-details", "");
        const {nestedPage} = req.query;

        if (!nestedPage) return next();

        directus
            .request(readItems(parentSlug, {
                filter: {
                    status: "published",
                    slug: nestedPage
                }
            }))
            .then(([ nestedPage ]) => {
                req.page.nestedPage = nestedPage;
            })
            .then(() => next())
            .catch(error => {
                console.log(error)
                next();
            })
    } catch (error) {
        console.log(error);
        next();
    }
}

const components = (req, res, next) => {
    try {
        const directus = req.public_access.with(rest());
        const { id } = req.params;

        directus
            .request(readItem("components", id, { filter: { status: "published" } }))
            .then(components => req.components = components)
            .then(() => next())
            .catch(error => {
                console.log(error);
                next();
            });
    } catch (error) {
        console.log(error);
        next();
    }
}

const modules = (req, res, next) => {
    try {
        const directus = req.public_access.with(rest());
        const { id } = req.params;

        directus
            .request(readItem("modules", id, { filter: { status: "published" } }))
            .then(modules => req.modules = modules)
            .then(() => next())
            .catch(error => {
                console.log(error);
                next();
            })
    } catch (error) {
        console.log(error);
        next();
    }
}

const collections = (req, res, next) => {
    try {
        const directus = req.public_access.with(rest());
        const { name } = req.params;

        let filter = null;
        if (req?.body?.length) {
            const handleFilters = [];
            req.body.map(({key, value, condition}) => handleFilters[key] = {[condition]: value})
            filter = Object.assign({}, handleFilters);
        }

        directus
            .request(readItems(name, { filter }))
            .then(items => req.items = items)
            .then(() => next())
            .catch(error => {
                console.log(error);
                next();
            })
    } catch (error) {
        console.log(error);
        next();
    }
}

const content = {
    page,
    nestedPage,
    components,
    modules,
    collections,
}

module.exports = content;
