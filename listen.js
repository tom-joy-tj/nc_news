const app = require("./app.js");

const { PORT = 9090 } = process.env;

app.listen(PORT, () => {
    console.log('Server is listening on PORT ${PORT}...')
})
