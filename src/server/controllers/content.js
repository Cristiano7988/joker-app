exports.public = (req, res) => {
    res.send(req.pages);
}

exports.components = (req, res) => {
    res.send(req.components);
}

exports.modules = (req, res) => {
    res.send(req.modules);
}

exports.collections = (req, res) => {
    res.send(req.items);
}

