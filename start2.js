
/*
 * 流水步骤：
 * 1.访问某一个小组的URL
 * 2.找到小组的title、member数量，保存
 */

var http                = require('http');
var $                   = require('cheerio');                //cheerio用于解析DOM tree
var addContent          = require('./models/content.js');
var addQuickCheck       = require('./models/quick_check.js');

main();
var breakPoint = 0;

function main(){

   //使用setInterval做计时器以及循环,每隔n分钟调用一次
   console.log('[Spider Run]');
   checkLocal(breakPoint);
   breakPoint ++;

   var timer = setInterval(function(){
      console.log('[Spider Run]');
      checkLocal(breakPoint);
      breakPoint ++;
      //clearInterval(timer);
   }, 1000*8.432);

}

/*
 * 查询本地，找到可访问的url
 */
function checkLocal(breakPoint){

   var option = {
      sort:[['_id', 1]],
      limit:1,
      skip: breakPoint
   };
   addQuickCheck.findOne(null, null, option, function(err, doc){
      console.log('[checking mongodb]');
      if (err) {console.log('get err: ' + err);}
      if (doc.url) {
         getWebSite(doc.url);
      }
      if( doc) {
         console.log('has doc');
      }
      else {
         console.log('no url');
      }
   });
}

function getWebSite(url){
   var the_path = url;
   //var the_path = 'http://www.douban.com/group/beijingzufang/';
   console.log('抓取地址：' + the_path);

   var options={
      host:'www.douban.com',
      path:the_path,
      //method:'get',     
      headers:{  
         'Content-Type':'application/x-www-form-urlencoded',  
         'User-Agent':'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:18.0) Gecko/20100101 Firefox/18.0',
         //'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)',
         'Referer':'http://www.douban.com/',
         'Host':'www.douban.com',
         'Connection':'keep-alive',
         'Cache-Control':'max-age=0',
         //'Accept-Language':'zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3',
         //'Accept-Encoding':'gzip, deflate',
      }
   };

   http.get(options, function(res) {
     var size = 0;
     var chunks = [];

     res.on('data', function(chunk){
         size += chunk.length;
         chunks.push(chunk);
         //
         console.log('[wait for]: ' + options.path);
     });

     res.on('end', function(){
         var data = Buffer.concat(chunks, size);
         var stringData = data.toString();
         if (stringData){
            console.log('[get website success]' + options.path);
         }
         else {
            console.log('[get website failed]' + options.path);
         }

         // 如果担心被屏蔽，就打印一下网页源码
         //console.log(stringData);

         // 从网页获取需要的内容（抓取内容）
         var the_json = analysWebSite(stringData, the_path);
         console.log(the_json);

         // 储存到mongodb
         var newContent = new addContent(the_json);
         newContent.save(function(err, doc, num){
            if (err) {console.log('err' + err);}
            console.log('saved succssess');
            console.log(doc);
            console.log('--------breakPoint--------' + breakPoint);
         });
         
     });

   }).on('error', function(e){
      console.log("[check err all by my own]: " + e.message);
   });
}


function analysWebSite(stringData, path){
   // 取得title
   var titleHTML = $('#group-info', stringData).html();
   var title = $('h1', titleHTML).text();
   title = title.replace(/\s/g, "");
   console.log('[title]: ' + title);

   // 取得relative_group
   var asideHTML = $('.aside', stringData).html();
   var bdHTML = $('.bd', asideHTML).html();
   var group_listHTML = $('.group-list', bdHTML).children();
   //console.log(group_listHTML);

   var length = group_listHTML.length;
   var urlArray = [];
   for (var i=0; i<=length; i++) {
      var url = $('.title a', group_listHTML[i]).attr('href');
      if (url) {
         console.log('[url]: ' + url);
         urlArray.push(url);
      }
   }

   // 取得小组创建时间
   var xx = $('.group-board p', stringData).text();
   var start = xx.indexOf('创建于');
   console.log(start);
   if (start >= 0) {
      var createTime = xx.substring(start + 3, start + 13);
      console.log('[createTime]: ' + createTime);
   }

   // 取得小组成员人数
   var memberString = $('.aside', stringData).children().toString();
   var member = $('p a', memberString).text();
   var memberValue = member.replace(/[^0-9]/ig,"");
   memberValue = parseInt(memberValue);
   console.log('[member]: ' + memberValue);

   // 解析url和douban_id
   var current_url = 'http://www.douban.com' + path;
   var douban_id = path.substring(7);

   // 组合json
   var json = {
      douban_id: douban_id,                       // 豆瓣id，从URL中提取出的唯一标示符
      title: title,                           // 小组名称
      create_time: createTime,                     // 小组创建时间
      url: current_url,                             // 网页地址
      relative_groups: urlArray,                  // 豆瓣提供的8个相关小组
      member: memberValue
   };
   
   return json;
}


