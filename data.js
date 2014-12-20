//

var addQuickCheck = require('./models/quick_check.js');
var addContent = require('./models/content.js');


//_find_url();
_find_content();
//_remove_content();
//_add();

function _find_url(){
   addQuickCheck.find(function(err, docs){
   	for (var i=0; i<docs.length; i++){
   		console.log(docs[i].url);
   	}
   	console.log('[length]: ' + docs.length);
   });
}

function _find_content(){
   var option = {
      sort:[['member', 1]]
   }
   addContent.find(null, null, option, function(err, docs){
      for (var i=0; i<docs.length; i++){
         console.log(docs[i].member + '---' + docs[i].create_time + '---' + docs[i].title);
      }
      console.log('[length]:' + docs.length);
   });
}

function _remove_url(){
   addQuickCheck.remove(function(err, num){
      console.log('REMOVE URL:' + num);
   });
}

function _remove_content(){
   addContent.remove(function(err, num){
      console.log('REMOVE CONTENT:' + num);
   });
}

function _add(){
	var newURL = new addQuickCheck({
	   url: 'http://www.douban.com/group/imdb/'
	});
	newURL.save(function(err, doc, num){
	   if (err) {console.log("Got error: " + err);}
	   console.log('[save url]: ' + doc);
	});
}