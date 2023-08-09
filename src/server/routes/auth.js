const auth = require("../controllers/auth");
const { dynamic_access } = require("../middlewares/auth");

module.exports = (app) => {
    app.post(
        "/login",
        [
            dynamic_access
        ],
        auth.signIn
    )
}
