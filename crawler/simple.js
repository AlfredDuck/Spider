//处理来自58同城的关键词

var ke = '广佛线 1号线 2号线 3号线 3号线机场线 4号线 5号线 8号线 APM线 ';
   var re = / /gi;
   var word_arr = ke.split(re);
   /*
   for (var i=0; i<=word_arr.length-1; i++){
      if(word_arr[i] = ' '){
         word_arr.splice(i);
      }
   }
   */
   console.log(word_arr);
   
   function f_check(obj)   
{          
   if (/^[A-Z]+$/.test(obj))    
   {   
      return true;   
   }    
   return false;   
}   
