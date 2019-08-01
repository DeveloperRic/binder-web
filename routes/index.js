const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index", {
    title: "Welcome to Binder",
    footerDisclaimers: [
      "¹ Please don't do this :)",
      "<br/>",
      "² Only available on higher plans. However, lower plans will still keep old versions for 7 days before deletion. " +
        "Former versions (regarless of plan) are deleted within 30 days"
    ]
  });
});

module.exports = router;
