/*
 * 流水步骤：
 * 1.访问某一个小组的URL
 * 2.找到相关URL，保存
 * 3.找到小组的title、member数量，保存
 */

var http                = require('http');
var $                   = require('cheerio');                     //cheerio用于解析DOM tree，类似于前端的jquery
var addContent          = require('./models/content.js');
var addQuickCheck       = require('./models/quick_check.js');


main();

function main(){

   //使用setInterval做计时器以及循环,每隔n分钟调用一次
   console.log('[Spider Run]');
   getWebSite();

   var timer = setInterval(function(){
      console.log('[Spider Run]');
      getWebSite();
      //clearInterval(timer);
   }, 1000*10);

}


function getWebSite(){
   var the_path = '/group/beijingzufang/';

   console.log('抓取地址： ' + the_path);

   var options={
      host:'www.douban.com',
      path:the_path,
      //method:'get',     
      headers:{  
         'Content-Type':'application/x-www-form-urlencoded',  
         'User-Agent':'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:18.0) Gecko/20100101 Firefox/18.0',
         //'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)',
         'Referer':'http://www.douban.com/group/search?cat=1019&q=%E5%8C%97%E4%BA%AC%E7%A7%9F%E6%88%BF',
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
         //console.log(analysWebSite(stringData, the_path));

         // 从网页获取relative_groups（广度遍历）
         var groupURLs = spiderWholeDoubanGroup(stringData);
         var length = groupURLs.length;
         console.log(groupURLs);
         
         for (var i=0; i<length; i++) {
            addQuickCheck.findOne({url: groupURLs[i]}, function(err, doc){
               if (err) {console.log('[err]: ' + err);}
               if (!doc) {
                  var newURL = new addQuickCheck({
                     url: groupURLs[i]
                  });
                  newURL.save(function(err, doc, num){
                     if (err) {console.log("Got error: " + err);}
                     console.log('[save url]: ' + doc);
                  });
               }
            });
         }
         

      });
   }).on('error', function(e){
      console.log("[check err all by my own]: " + e.message);
   });
}


function spiderWholeDoubanGroup(stringData) {
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
    return urlArray;
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



/*
var discussHTML = $('.olt', stringData).html();   //获取帖子列表（一页的）
//var $html = cheerio.load(discussHTML);
var tiezi_urls = $('.title', discussHTML).children();

for (var i=0; i<=tiezi_urls.length-1; i++){
   var kk = tiezi_urls[i].attribs.href;    //获取帖子地址
   URLs.push(kk);
   console.log('url: ' + i);
}

//储存url数组到数据库
if (URLs.length > 25*(maxNum-1)+12){   //防止多次重复写入,加12是为了防止有时候一页超过25个
var uniqueURL = unique(URLs);    //数组去重
var newURLs = new addURLs({
   crawler_time: new Date(),             //爬取时间
   length: URLs.length,                  //帖子数量
   url: uniqueURL,                       //帖子数组
   city: group[0]
});
//debug断点
console.log('传递url到下一步');
data_url.getURLs(newURLs);  //进入第2步骤
*/
/*
newURLs.save(function(err, doc, num){
   if (err) {   
      console.log("Got error: ");
   }
   console.log('save success: ' + num);
   data_url.getURLs();  //进入第2步骤
});
*/