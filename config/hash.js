const { PASSWORDSALT, PASSWORDSTRETCH } = require("./app.config.js").security;
const crypto = require("crypto");

const digest = function (text) {
  let hash;
  text += PASSWORDSALT;
  for (let i = PASSWORDSTRETCH; i--; ) {
    hash = crypto.createHash("sha512");
    hash.update(text);
    text = hash.digest("hex");
  }
  return text;
};

module.exports = {
  digest,
};
