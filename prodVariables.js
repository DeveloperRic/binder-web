require("dotenv").config();

//TODO always change this to FALSE when publishing
const DEV_MODE = false;

module.exports = {
  DEV_MODE,
  srcDir: __dirname,
  API_DOMAIN: DEV_MODE ? "http://localhost:3000" : process.env.BINDER_API_DOMAIN
};
