const { static_access } = require("../middlewares/auth");
const { pages, components } = require("../middlewares/content");
const content = require("../controllers/content");

module.exports = (app) => {
    app.get(
        "/content/public/pages",
        [
            static_access,
            pages
        ],
        content.public
    );

    app.get(
        "/content/public/components/:id",
        [
            static_access,
            components
        ],
        content.components
    );
}
