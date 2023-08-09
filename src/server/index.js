const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('./routes/auth')(app);
require('./routes/content')(app);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Port: ${PORT}`);
});
