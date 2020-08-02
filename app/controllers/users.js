const User = require("../models/users");
var URL = require("url");
const jsonwebtoken = require("jsonwebtoken");
const { secret } = require("../config");
const crypto = require("crypto");
var urlencode = require("urlencode");
const DingTalk = require("node-dingtalk");

class UserCtl {
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, "没有权限");
    }
    await next();
  }
  async login(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true },
    });
    const user = await User.findOne(ctx.request.body);
    if (!user) {
      ctx.throw(401, "用户名或密码不正确");
    }
    const { _id, name } = user;
    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: "1d" });
    ctx.body = { token };
  }
  async find(ctx) {
    ctx.body = await User.find({ type: { $nin: "administrator" } });
  }
  async getUserInfo(ctx) {
    ctx.body = await User.findById(ctx.state.user._id);
  }
  async updateInfo(ctx) {
    ctx.body = {};
  }
  async create(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true },
    });
    const { name } = ctx.request.body;
    const repeatedUser = await User.findOne({ name });
    if (repeatedUser) {
      ctx.throw(409, "用户已经占用");
    }
    const user = await new User(ctx.request.body).save();
    ctx.body = user;
  }
}

function getSign() {
  const hmac = crypto.createHmac(
    "sha256",
    "wnMB6kIt-d-Bg8oGVa009RHNdG77YTU2L0TizQcnUNyiDkrDPOs3FOTSdLBRUPVX"
  );

  let res = hmac.update(
    Date.now() +
      "\n" +
      "wnMB6kIt-d-Bg8oGVa009RHNdG77YTU2L0TizQcnUNyiDkrDPOs3FOTSdLBRUPVX"
  );
  return urlencode(res);
}
module.exports = new UserCtl();
