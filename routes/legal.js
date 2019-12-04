const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("legal", {
    title: "Legal Stuffs - Binder"
  });
});

module.exports = router;
