const db = require("../db/connection.js");
const endpointsJson = require("../endpoints.json");

exports.showEndpoints = () => {
    return Promise.resolve(endpointsJson)
};