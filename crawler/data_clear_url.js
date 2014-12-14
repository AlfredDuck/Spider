var addURLs      = require('./../models/url.js');
var addContent   = require('./../models/content.js');

function clearURLs(){
   addURLs.remove(function(err, num){
      console.log('removed: ' + num);
   });
   addContent.remove(function(err,num){
      console.log('removed: ' + num);
   });
}

//clearURLs();

exports.clearURLs = function(){
   addURLs.remove(function(err, num){
      console.log('URLs removed: ' + num);
   });
   
   //顺便清理超过一个月的帖子
   //clearOverMonth();
   
};

//clearOverMonth();

function clearOverMonth(){
   //用于删除过时的数据，不要随便开启哦
   addContent.remove({date: {"$gte": '2012-04-25', "$lte":'2014-05-13'}}, function(err, num){
      console.log('【删除的数据】： ' + num);
   });  
}







