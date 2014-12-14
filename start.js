/*
 * 流水步骤：
 * 1.访问某一个小组的URL
 * 2.找到相关URL，保存
 * 3.找到小组的title、member数量，保存
 */

var addURLs          = require('./models/url.js');
var addContent       = require('./models/content.js');
var crawler_url      = require('./crawler/crawler_url.js');


main();


function main(){   //使用setInterval做计时器以及循环,每隔10分钟调用一次，超过当前小时则停止
   console.log('【开始爬取】');
   var gp = showGroups();
   crawler_url.main(gp);
   var timer = setInterval(function(){
      console.log('【开始爬取】');
      crawler_url.main(gp);
      //clearInterval(timer);
   }, 1000*60*10);
}

//定义一个json，包含各地租房小组的url
function showGroups(){
   var groups = {};
   groups['北京'] = [
   '北京',
   '/group/beijingzufang/discussion?start=',  //北京租房
   '/group/zhufang/discussion?start=',        //北京无中介租房
   '/group/26926/discussion?start=',          //北京租房豆瓣
   '/group/sweethome/discussion?start='       //北京租房密探
   ];
   groups['上海'] = [
   '上海',
   '/group/shanghaizufang/discussion?start=',   //上海租房
   '/group/zufan/discussion?start=',      //上海租房@长宁租房/徐汇/静安租房
   '/group/homeatshanghai/discussion?start=',   //和我住在一起
   '/group/259227/discussion?start='           //上海租房（不良中介勿扰）
   ];
   groups['广州'] = [
   '广州',
   '/group/gz020/discussion?start=',    //广州租房（推荐指数★★★★★）
   '/group/90742/discussion?start=',    //广州租房
   '/group/banjia/discussion?start=',   //广州租房那些事
   '/group/gz020/discussion?start='    //广州租房（推荐指数★★★★★）故意重复的
   ];
   
   var ran = Math.random();
   if ( ran <= 0.6 ){
     return groups['北京'];
   }
   else if ( ran>0.6 && ran<=0.8 ){
     return groups['上海'];
   }
   else if ( ran>0.8 && ran<1.0 ){
     return groups['广州'];
   }
   else{
     return groups['北京'];
   }
}







