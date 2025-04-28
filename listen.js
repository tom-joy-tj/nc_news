const app = require("./app.js");

const { PORT = 2025 } = process.env;

app.listen(PORT, () => {
    console.log('Server is listening on PORT ${PORT}...')
})
