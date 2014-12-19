// 百度手机助手

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
   var the_path = '/soft_2002785.html';

   console.log('抓取地址： ' + the_path);

   var options={
      host:'www.anzhi.com',
      path:the_path,
      //method:'get',
      headers:{  
      	'Accept':'text/html',
        'Content-Type':'application/x-www-form-urlencoded', 
        'Content-Length':'19',
         //'User-Agent':'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:18.0) Gecko/20100101 Firefox/18.0',
         'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)',
         'Referer':'http://www.anzhi.com/',
         'Host':'www.anzhi.com',
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
         console.log(stringData);

         // 从网页获取需要的内容（抓取内容）
         console.log(analysWebSite(stringData, the_path));
      });
   }).on('error', function(e){
      console.log("[check err all by my own]: " + e.message);
   });
}


function analysWebSite(stringData, path){
	/*
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
*/
   var download = $('#detail_line_ul', stringData).children()[1];
   var dd = $('.spaceleft', download).text();
      console.log(dd);
   
}
