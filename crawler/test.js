/*
var http = require('http');
var $ = require('cheerio');  //cheerio用于解析DOM tree，类似于前端的jquery
   http.get('http://www.douban.com/group/', function(res) {
     var size = 0;
     var chunks = [];
     res.on('data', function(chunk){
         size += chunk.length;
         chunks.push(chunk);
     });
     res.on('end', function(){
         //console.log(chunks);
         //console.log('[[[[[array length]]]]]]' + chunks.length);
      
         var data = Buffer.concat(chunks, size);
         var stringData = data.toString();
         console.log(stringData);   //如果被屏蔽了，可以在这里看到      
     });
   }).on('error', function(e) {
     console.log("Got error: " + e.message);
   });
*/

var roomSize = ['主卧','次卧','整租','单间','床位'];
var rentWay = ['求租','合租'];
var roomNum = roomnum();
   
function roomnum(){
  var roomNum= [];
  roomNum[0] = ['一居','一室','1居','1室'];
  roomNum[1] = ['二居','两居','2居','二室','两室','2室'];
  roomNum[2] = ['三居','三室','3居','3室'];
  roomNum[3] = ['四居','四室','4居','4室'];
  roomNum[4] = ['五居','五室','5居','5室'];
  return roomNum;
}
   
function test_1(){
   var word = '苏州 主卧';
   var room = {};
   for (var i=0; i<=roomSize.length-1; i++) {
      var position = word.indexOf(roomSize[i]);
      if (position >= 0) {
         console.log(roomSize[i]);
         room.size = roomSize[i];
      }
   }
   for (var i=0; i<=rentWay.length-1; i++) {
      var position = word.indexOf(rentWay[i]);
      if (position >= 0) {
         console.log(rentWay[i]);
         room.way = rentWay[i];
      }
   }
   for (var i=0; i<=roomNum.length-1; i++) {
      for (var j=0; j<=roomNum[i].length-1; j++) {
         var position = word.indexOf(roomNum[i][j]);
         if (position >= 0) {
            console.log(rentWay[i][j]);
            room.num = rentWay[i][j];
         }
      }
   }
   console.log(room);
   
   /*
   var re = / /gi;
   var word_arr = word.split(re);
   console.log(word_arr);
   
   for (var i=0; i<=word_arr.length-1; i++) {
      
   }
   */
}
test_1();

function test_2(){
   var searchWord = '苏州 主卧';
   
   var re = / /gi;
   var word_arr = searchWord.split(re);
   console.log(word_arr);
   
   for (var i=0; i<=word_arr.length-1; i++) {
      
   }
}
test_2();
/*
搜索词处理
//结构性信息也录入关键词中
1.提示用户用空格隔开关键词
2.得到搜索词，然后进行处理
3.用正则分离成数组 / /gi
4.从数组的每一项中检索关键词 indexOf
5.检索出的关键词用于查找帖子（多个关键词，用于查找帖子的交集）
*/







