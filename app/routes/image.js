const jwt = require("koa-jwt");
const Router = require("koa-router");
const router = new Router({ prefix: "/image" });

const { find, upload, del, getImage } = require("../controllers/image");
const { checkOwner } = require("../controllers/users");
const { secret } = require("../config");
const auth = jwt({ secret });

router.post("/", find);
router.post("/upload", auth, upload);
router.delete("/:id", auth, del);
router.get("/:id", getImage);
module.exports = router;
