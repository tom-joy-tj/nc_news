const { selectTopics } = require("../models/model.js");
const endpointsJson = require("../endpoints.json");

exports.getAPI = (req, res) => {
    res.status(200).send({ endpoints : endpointsJson })
};

exports.getTopics = (req, res) => {
    return selectTopics() 
    .then((topics) => {
        res.status(200).send(topics)
    })
};

