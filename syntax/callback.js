// function a(){
//   console.log('a');
// }

var a = function(){
  console.log('A');
}

function slowfunc(callback){
  callback();
}

slowfunc(a);
