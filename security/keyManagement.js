module.exports = (() => {
  const fs = require("fs");
  const { DEV_MODE, srcDir } = require("../prodVariables");

  //TODO assign different databases for development
  let mongodbKey;

  /**
   * @returns {"mongodb+srv://${role}:${pass}@${host}/${db}${opts}"}
   * The connection string required to connect to MonogoDB
   */
  function getMongodbKey() {
    if (mongodbKey) return mongodbKey;
    const { role, pass, host, db, opts } = JSON.parse(
      fs.readFileSync(`${srcDir}/security/keys/mongodb.json`)
    )[DEV_MODE ? "dev" : "prod"];
    return (mongodbKey = `mongodb+srv://${role}:${pass}@${host}/${db}${opts}`);
  }

  return {
    getMongodbKey
  };
})();
