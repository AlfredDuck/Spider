/*
 * 快查数据库
 * 记录所有小组的douban_id，方便快速查找以及去重
 */

var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var quickSchema = new Schema({
   url: String                        // 小组地址
});

module.exports = mongodb.mongoose.model("quick", quickSchema);
