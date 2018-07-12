var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var template = require('./lib/template.js');
var path = require('path');
var mysql = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'nodejs',
  password : '1q2w3e4r',
  database : 'opentutorials'
});
db.connect();

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){
      if(queryData.id === undefined)
      {
        db.query(`SELECT * FROM topic`,function (error, topics) {
            console.log(topics);
            var title = 'Welcome';
            var description = 'Hello, Node.js';
            var list = template.List(topics);
            var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`);
            response.writeHead(200);
            response.end(html);
        });
      } else {
      db.query(`SELECT * FROM topic`,function (error, topics) {
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,[queryData.id], function(error2, topic){
          if(error2){
            throw error2;
          }
          var title = topic[0].title;
          var description = topic[0].description;
          var list = template.List(topics);
          var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}
          <p>by ${topic[0].name}</p>`,
          `<a href="/create">create</a>
           <a href="/update?id=${queryData.id}">update</a>
           <form action="delete_process" method="post">
            <input type = "hidden" name = "id" value = "${queryData.id}">
            <input type = "submit" value = "delete">
           </form>
          `);
          response.writeHead(200);
          response.end(html);
        })
      });
      }
  } else if(pathname === '/create'){  // 생성 폼
    db.query(`SELECT * FROM topic`,function (error, topics) {
      db.query(`SELECT * FROM author`,function(error2, authors){
        //console.log(topics);
        var title = 'Create';
        var list = template.List(topics);
        var html = template.HTML(title, list,
        `
        <form action="/create_process" method="post">
          <p><input type="text" name ="title" placeholder="title"></p>
          <p>
            <textarea name = "description" placeholder="description"></textarea>
          </p>
          <p>
            ${template.authorSelect(authors)}
          </p>
          <p><input type="submit"></p>
        </form>
        `,
        `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(html);
     });
   });
  } else if(pathname === '/create_process'){
    var body = '';
    request.on('data', function(data){ // post로 데이터가 조각조각 들어옴
      body+=data;
    });
    request.on('end', function(){ //
      var post = qs.parse(body);
      //console.log(post);
      db.query(`
        INSERT INTO topic (title, description, created, author_id)
        VALUES(?,?, NOW(), ?)`,
      [post.title, post.description, post.author],
      function(error, result){
        if(error){
          throw error;
        }
        response.writeHead(302, {Location: `/?id=${result.insertId}`});
        response.end();
      }
     )
    });
  } else if(pathname === '/update'){  // 수정 폼
    db.query('SELECT * FROM topic', function(error, topics){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(error2, topic){
          if(error2){
            throw error2;
          }
          db.query('SELECT * FROM author', function(error2, authors){
          var list = template.List(topics);
          var html = template.HTML(topic[0].title, list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${topic[0].id}">
              <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
              <p>
                <textarea name="description" placeholder="description">${topic[0].description}</textarea>
              </p>
              <p>
                ${template.authorSelect(authors, topic[0].author_id)}
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
          );
          response.writeHead(200);
          response.end(html);
         });
        });
      });
  } else if(pathname === '/update_process'){
    var body = '';
     request.on('data', function(data){
         body += data;
     });
     request.on('end', function(){
         var post = qs.parse(body);
         db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?', [post.title, post.description, post.author, post.id], function(error, result){
           response.writeHead(302, {Location: `/?id=${post.id}`});
           response.end();
         })
     });
  } else if(pathname === '/delete_process'){ // 삭제 처리
    var body = '';
          request.on('data', function(data){
              body = body + data;
          });
          request.on('end', function(){
              var post = qs.parse(body);
              db.query('DELETE FROM topic WHERE id = ?', [post.id], function(error, result){
                if(error){
                  throw error;
                }
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
