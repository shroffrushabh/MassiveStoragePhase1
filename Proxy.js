var http = require('http');
var sys  = require('sys');
var request = require('request');
var fs = require('fs');
var url  = require('url');

var namenodePort = 50070;
var datanodePort = 50075;
//var hosts = readHosts()
var hosts = {}

hosts['namenode'] = '172.16.17.137'
hosts['datanode'] = '172.16.17.137'

http.createServer(function(request, response) {
  var query = url.parse(request.url, true).query;
  var operation = query.op;
  switch(query.op){
    case 'mkdir':
    sendRequestToHDFS('MKDIRS', hosts.namenode+':'+namenodePort, 'PUT', query.path, operation, response);
    break
    case 'ls':
    sendRequestToHDFS('LISTSTATUS', hosts.namenode+":"+namenodePort, 'GET', query.path, operation, response)
    break
    case 'create1':
    sendRequestToHDFS('CREATE',hosts.namenode+":"+namenodePort, 'PUT', query.path, operation, response)
    break
    case 'create2':
    sendRequestToHDFS('CREATE',hosts.datanode+":"+datanodePort, 'PUT', query.uri, operation, response, request)
    break
    case 'delete':
    sendRequestToHDFS('DELETE',hosts.namenode+":"+namenodePort, 'DELETE', query.path, operation, response)
    break
  }
}).listen(8000);

console.log("Server started at http://127.0.0.1:8000");

function sendRequestToHDFS(op, addressTo, requestType, loc, operation, res, req){
  
  if(req == undefined){
    url = 'http://'+addressTo+"/webhdfs/v1/usr/"+loc+"?op="+op
    console.log("Sending " + requestType + " request to:-\n"+url)
      request(
      { method: requestType
      , url: url}
      ,function (error, response, body) {
        if(error != undefined) {
          return error;  
        }
        res.writeHead(200, { 'Content-Type': 'text/json' });
        res.write(successCallback(response,body,operation)+"");
        res.end();
      });
  }
  else {
    //url = 'http://'+addressTo+"/webhdfs/v1/usr/"+loc+"?op="+op+"&replication=2&permission=777"
    console.log("Piping " + requestType + " request to:-\n"+loc)
    req.pipe(request.put(loc, function (error, response, body) {
        if(error != undefined) {
          console.log(error);
          return error;  
        }   
        res.writeHead(200, { 'Content-Type': 'text/json' });
        res.write(successCallback(response,body,operation)+"");
        res.end();
    }));
  }
}

function successCallback(response, body, operation){
  switch(operation){
    case 'mkdir':
    return body;
    break
    case 'ls':
    return body;    
    break
    case 'create1':
    return JSON.stringify(response.headers);
    break
    case 'create2':
    return JSON.stringify(response.headers);
    break
    case 'delete':
    return response.body;
    break
  }
}

function readHosts(){
  var hosts={}

  fs.readFile('/etc/hosts', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    } 
    
    i=0
    data = data.split('\n')
    while(i++ < data.length){
      if(data[i] != undefined && (data[i] != '' || data[i].charAt(0) != '#')){
        tmp = data[i].split('\t')
        hosts[tmp[1]] = tmp[0]
      }
    }
  });
  return hosts
}