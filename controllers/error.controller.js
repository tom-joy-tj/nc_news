exports.handlePsqlError = (err, req, res, next) => {

    if (err.code === "22P02") {
        res.status(400).send( { msg: "BAD REQUEST - PSQL ERROR!" } )
    } 
    else if (err.code = "23503") {
        res.status(404).send( { msg: "Article ID not found!"} )
    }
    else {
        next(err) 
    }
};

exports.handleCustomError = (err, req, res, next) => {
    
    if (err.status && err.msg) {
        res.status(err.status).send({ msg : err.msg })
    }
    else { 
        next(err) 
    }
};

exports.handle500Error = (err, req, res, next) => {

    console.log(err, "<<<<<<<<<<< ERROR HAS REACHED THE UNKNOWN ERROR HANDLER - THIS MUST BE AN UNHANDLED ERROR")

    res.status(500).send( { msg: "Internal server error!" } )
};
