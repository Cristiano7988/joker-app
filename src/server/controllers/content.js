exports.public = (req, res) => {
    res.send(req.pages);
}

exports.components = (req, res) => {
    res.send(req.components);
}
