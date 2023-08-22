const { rest, createItem } = require("@directus/sdk");

exports.components = (req, res) => {
    res.send(req.components);
}

exports.modules = (req, res) => {
    res.send(req.modules);
}

exports.collections = (req, res) => {
    res.send(req.items);
}

exports.page = (req, res) => {
    res.send(req.page);
}

exports.forms = (req, res) => {
    res.send(req.forms);
}

exports.contacts = (req, res) => {
    const directus = req.public_access.with(rest());

    directus
        .request(createItem('contacts', req.body))
        .then(response => res.send(response))
        .catch(error => res.status(500).send(error));
}
