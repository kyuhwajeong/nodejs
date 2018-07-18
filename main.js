var http = require('http');
var url = require('url');
var qs = require('querystring');

var template = require('./lib/template.js');
var db = require('./lib/db');
var topic = require('./lib/topic')
var author = require('./lib/author');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){
      if(queryData.id === undefined)
      {
        topic.home(request, response);
      } else {
        topic.page(request, response);
      }
  } else if(pathname === '/create'){  // 생성 폼
    topic.create(request, response);
  } else if(pathname === '/create_process'){
    topic.create_process(request, response);
  } else if(pathname === '/update'){  // 수정 폼
    topic.update(request, response);
  } else if(pathname === '/update_process'){
    topic.update_process(request, response);
  } else if(pathname === '/delete_process'){ // 삭제 처리
    topic.delete_process(request, response);
  } else if(pathname === '/author'){
    author.home(request, response);
  } else if(pathname === '/author/create_process'){
   author.create_process(request, response);
  } else {
    response.writeHead(404);
    response.end('Not found');
  }


//    console.log(__dirname + url);
//    response.end(fs.readFileSync(__dirname + url));

});
app.listen(3000);
