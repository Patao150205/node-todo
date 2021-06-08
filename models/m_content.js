const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ContentSchema = new Schema(
  {
    _userId: { type: ObjectId, required: true },
    time: { type: Date, required: [true, "時間を入力してください"] },
    contentName: { type: String, required: [true, "項目名を入力してください"] },
  },
  { collection: "contents", versionKey: false, timestamps: true }
);

module.exports = mongoose.model("Content", ContentSchema);
