/*
 * 内容数据库
 * 记录所有的小组信息
 */

var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var groupSchema = new Schema({
   douban_id: String,                       // 豆瓣id，从URL中提取出的唯一标示符
   title: String,                           // 小组名称
   create_time: String,                     // 小组创建时间
   url: String,                             // 网页地址
   relative_groups: Array                   // 豆瓣提供的8个相关小组
});

module.exports = mongodb.mongoose.model("group", groupSchema);
