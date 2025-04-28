const app = require("./app.js");

const dotenv = require("dotenv");


if (process.env.NODE_ENV !== 'development') {
    dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
  }
const { PORT = 2025 } = process.env;

app.listen(PORT, () => {
    consaole.log('Server is listening on PORT ${PORT}...')
})

// I know I wont be using this listener whilst running supertest 
// I am unsure if something is missing here for this listener to work as intended 