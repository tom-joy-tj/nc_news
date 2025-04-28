const { showEndpoints } = require("../models/model.js");

exports.getAPI = (req, res) => {
    return showEndpoints()
    .then((endpoints) => {
        res.status(200).send({endpoints})
    })
};