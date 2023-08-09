const { static_access } = require("../middlewares/auth");
const { pages } = require("../middlewares/content");
const content = require("../controllers/content");

module.exports = (app) => {
    app.get(
        "/content/public",
        [
            static_access,
            pages
        ],
        content.public
    )
}
