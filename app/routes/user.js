const jwt = require("koa-jwt");
const Router = require("koa-router");
const router = new Router({ prefix: "/user" });
const { login, find, create, checkOwner,getUserInfo } = require("../controllers/users");
const { secret } = require("../config");
const auth = jwt({ secret });
router.post("/login", login);
router.get("/getUserInfo", getUserInfo);
router.get("/", auth,  find);
router.post("/", create);

module.exports = router;
