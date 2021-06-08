const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: [true, "このメールアドレスは既に使われています。"] },
    password: { type: String, required: true, min: [6, "パスワードは6文字以上で入力してください。"] },
  },
  { collection: "users", versionKey: false }
);

userSchema.plugin(uniqueValidator, { message: "{VALUE}は既に使用されています。" });
module.exports = mongoose.model("User", userSchema);
