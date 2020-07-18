const path = require("path");
const Image = require("../models/image");
const User = require("../models/users");
const fs = require("fs");
class ImageCtl {
  async upload(ctx) {
    let urls = [];
    let ids = [];
    let files = ctx.request.files.file;
    for (let i = 0; i < files.length; i++) {
      const basename = path.basename(files[i].path);
      let url = `${ctx.origin}/uploads/${basename}`;
      urls.push(url);
      let img = await new Image({
        name: basename,
        src: url,
        tabs: ctx.request.body.tabs,
        info: ctx.request.body.info,
        owner: ctx.state.user._id,
      }).save();
      ids.push(img._id);
    }
    const me = await User.findById(ctx.state.user._id).select("+dir");
    let dirName = "默认文件夹";
    let hasDir = false;
    if (ctx.request.body.dirName) {
      dirName = ctx.request.body.dirName;
    }
    me.dir.forEach((item, i) => {
      if (item.name == dirName) {
        hasDir = i;
      }
    });

    if (typeof hasDir == "number") {
      me.dir[hasDir].children = me.dir[hasDir].children.concat(ids);
    } else {
      me.dir.push({
        name: dirName,
        children: ids,
      });
    }
    me.save();
    ctx.body = ids;
  }
  async find(ctx) {
    let { pageNum, pageSize, key } = ctx.request.body;
    const reg = new RegExp(key, "i");
    let count = await Image.find({
      $or: [{ info: { $regex: reg } }],
    }).count();
    let imgs = await Image.find({
      $or: [
        //多条件，数组
        { info: { $regex: reg } },
      ],
    })
      .skip((pageNum - 1) * pageSize)
      .sort({ _id: -1 })
      .limit(pageSize)
      .exec();

    ctx.body = {
      count,
      images: imgs,
    };
  }
  async del(ctx) {
    const img = await Image.findOneAndDelete(ctx.params.id);
    if (!img) {
      ctx.throw(404, "图片不存在");
    }
    let filePath = path.join(__dirname, "../public/uploads/");
    console.log(filePath);
    filePath += img.name;
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.log(err);
      }
    });
    const me = await User.findById(ctx.state.user._id).select("+dir");
    me.dir.forEach((item) => {
      let index = item.children.indexOf(ctx.params.id);
      if (index > -1) {
        item.children.splice(index, 1);
      }
    });
    me.save();

    ctx.body = "删除成功";
  }
  async getImage(ctx) {
    const user = await Image.findById(ctx.params.id);
    if (user) {
      ctx.body = user;
    } else {
      ctx.body = "未找到指定图片";
    }
  }
}

module.exports = new ImageCtl();
