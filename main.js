var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var template = require('./lib/template.js');
var path = require('path');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){
      if(queryData.id === undefined)
      {
        fs.readdir(`./data`, function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.List(filelist);
          var html = template.HTML(title, list,`<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`);
            response.writeHead(200); // 웹서버 연결이 정상
            response.end(html);
        })
      } else {
        fs.readdir('./data', function(error, filelist){
        var filteredId = path.parse(queryData.id).base;
        console.log(filteredId);
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var title = queryData.id;
            var list = template.List(filelist);
            var html = template.HTML(title, list,`<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>
             <a href="/update?id=${title}">update</a>
             <form action="delete_process" method="post">
              <input type = "hidden" name = "id" value = "${title}">
              <input type = "submit" value = "delete">
             </form>
            `);
            response.writeHead(200); // 웹서버 연결이 정상
            response.end(html);
        });
      });
      }
  } else if(pathname === '/create'){  // 생성 폼
    fs.readdir(`./data`, function(error, filelist){
      var title = 'WEB - create';
      var list = template.List(filelist);
      var html = template.HTML(title, list,`<form action="/create_process"
      method="post">
      <p><input type="text" name ="title" placeholder="title"></p>
      <p>
        <textarea name = "description" placeholder="description"></textarea>
      </p>
      <p><input type="submit"></p>
      </form>
      `,``);
        response.writeHead(200); // 웹서버 연결이 정상
        response.end(html);
    })
  } else if(pathname === '/create_process'){
    var body = '';
    request.on('data', function(data){ // post로 데이터가 조각조각 들어옴
      body+=data;
    });
    request.on('end', function(){ //
      var post = qs.parse(body);
      //console.log(post);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.writeHead(302,{Location:`/?id=${title}`}); // 디다렉션 302 페이지를 다른곳으로 디다렉션
        response.end('success');
      });
    });
  } else if(pathname === '/update'){  // 수정 폼
    fs.readdir(`./data`, function(error, filelist){
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`,'utf8', function(err, description){
      var title = queryData.id;
      var list = template.List(filelist);
      var html = template.HTML(title, list,
        `<form action="/update_process" method="post">
        <p><input type="hidden" name ="id" value="${title}"></p>
        <p><input type="text" name ="title" placeholder="title" value="${title}"></p>
        <p>
        <textarea name = "description" placeholder="description">${description}</textarea>
        </p>
        <p><input type="submit"></p>
        </form>
        `,`<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
        response.writeHead(200); // 웹서버 연결이 정상
        response.end(html);
      });
    });
  } else if(pathname === '/update_process'){
    var body = '';
    request.on('data', function(data){ // post로 데이터가 조각조각 들어옴
      body+=data;
    });
    request.on('end', function(){ //
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      //console.log(post);
      fs.rename(`data/${id}`,`data/${title}`,function(error){  // 파일 이름 변경(old,new,callback)
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302,{Location:`/?id=${title}`}); // 디다렉션 302 페이지를 다른곳으로 디다렉션
          response.end('success');
        });
      });
    });
  } else if(pathname === '/delete_process'){ // 삭제 처리
    var body = '';
    request.on('data', function(data){ // post로 데이터가 조각조각 들어옴
      body+=data;
    });
    request.on('end', function(){ //
      var post = qs.parse(body);
      var id = post.id;
      var filteredId = path.parse(id).base;
      //console.log(post);
      fs.unlink(`data/${filteredId}`, function(error){  // 실제 파일 삭제 처리
        response.writeHead(302, {Location: `/`});
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end('Not found');
  }


//    console.log(__dirname + url);
//    response.end(fs.readFileSync(__dirname + url));

});
app.listen(3000);
