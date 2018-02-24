module.exports = function (app) {
  // 用户模块
  app.use("/api/user", require("./routes/user"));
  app.use("/api/wechat", require("./routes/wechatHelper"));
  app.use("/api/relation", require("./routes/relationUser"));
  app.use("/api/file", require("./routes/file"))
  app.use("/api/test", require("./routes/test"))
}