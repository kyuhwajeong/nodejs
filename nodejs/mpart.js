var M = {
  v:'v',
  f:function(){
    console.log(this.v);
  }
}

// 위 M 모듈을 외부에서 사용할 수 있게 해 주겠다.
module.exports = M;
