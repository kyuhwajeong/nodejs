//module 사용
// 파일을 쪼개서 외부로 독립시킬 수 있다.

// var M = {
//   v:'v',
//   f:function(){
//     console.log(this.v);
//   }
// }
//M.f();

var part = require('./mpart.js')
console.log(part);
