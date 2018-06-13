var v1 = 'v1';
var v2 = 'v2';

var o = {
  v1:'v1',
  v2:'v2',
  f1:function(){
    console.log(this.v1);
  },
  f2:function(){
    console.log(this.v2);
  },
  p1:23123,
  f2:function(){
    console.log(this.p1);
  },
}

o.f1();
o.f2();
console.log(o.p1);
