const { rest, createItem, updateItem, readItem, readItems } = require("@directus/sdk");

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

    const { store_in } = req.body
    delete req.body.store_in;
    delete req.body.filters;

    directus
        .request(createItem(store_in, req.body))
        .then(response => res.send(response))
        .catch(error => res.status(500).send(error));
}

exports.updateContacts = (req, res) => {
    const directus = req.public_access.with(rest());

    let { store_in, filters } = req.body
    delete req.body.store_in;
    delete req.body.filters;

    const formatedFilter = filters.map(
        ({ name, condition }) => ({
            [name]: {
                [condition]: req.body[name]
            }
        }
    ));

    const filter = Object.assign({}, ...formatedFilter);

    directus
        .request(readItems(store_in, { filter }))
        .then(response => {
            if (!response.length) {
                const errors = filters.map(
                    ({ name, condition }) => ({
                        extensions: {
                            code: "NOT_FOUND",
                            field: name,
                            type: condition
                        },
                        message: ["No", name, "was found."].join(" ")
                    })
                );

                res.status(500).send({ errors });
            } else return response.map(contact => directus.request(updateItem(store_in, contact.id, req.body)));
        })
        .then(response => res.send(response))
        .catch(error => res.status(500).send(error));
}
