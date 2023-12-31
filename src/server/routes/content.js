const { static_access } = require("../middlewares/auth");
const { page, nestedPage, components, modules, collections } = require("../middlewares/content");
const content = require("../controllers/content");

module.exports = (app) => {
    app.get(
        "/content/public/components/:id",
        [
            static_access,
            components
        ],
        content.components
    );

    app.get(
        "/content/public/modules/:id",
        [
            static_access,
            modules
        ],
        content.modules
    );

    app.get(
        "/page/:slug",
        [
            static_access,
            page,
            nestedPage
        ],
        content.page
    );

    app.post(
        "/collections/:name",
        [
            static_access,
            collections
        ],
        content.collections
    );

    app.get(
        "/forms",
        [
            static_access
        ],
        content.forms
    );

    app.post(
        "/contacts",
        [
            static_access
        ],
        content.createContacts
    );

    app.put(
        "/contacts",
        [
            static_access
        ],
        content.updateContacts
    );

    app.get(
        "/contacts",
        [
            static_access
        ],
        content.contacts
    );
}
