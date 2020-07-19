const Router = require("koa-router");
const router = new Router({ prefix: "/word" });
const { getQszDocs,getSsclDocs } = require("../controllers/word");

router.post("/exportQSZ", async ctx => {
  let postParam = ctx.request.body;
  await getQszDocs(postParam);
  ctx.body = "导出成功";
});

router.post("/exportSSCL", async ctx => {
  let postParam = ctx.request.body;
  await getSsclDocs(postParam);
  ctx.body = "导出成功";
});

module.exports = router;
