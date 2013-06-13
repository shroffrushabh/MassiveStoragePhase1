var http = require('http');
var sys  = require('sys');
var request = require('request');
var fs = require('fs');
var url  = require('url');

var namenodePort = 50070;
var datanodePort = 50075;
//var hosts = readHosts()
var hosts = {}

hosts['namenode'] = '192.168.1.24'
hosts['datanode'] = '192.168.1.24'

http.createServer(function(request, response) {
  var query = url.parse(request.url, true).query;
  switch(query.op){
    case 'mkdir':
    response.writeHead(200, { 'Content-Type': 'text/json' });
    tmp=sendRequestToHDFS('MKDIRS&permission=777', hosts.namenode+':'+namenodePort, 'PUT', query.path, response);
    break
    case 'ls':
    sendRequestToHDFS('LISTSTATUS', hosts.namenode+":"+namenodePort, 'GET', query.path, response)
    break
    case 'create':
    sendRequestToHDFS('CREATE',hosts.datanode+":"+datanodePort, 'PUT', query.path, response, request)
    break
    case 'delete':
    sendRequestToHDFS('DELETE',hosts.namenode+":"+namenodePort, 'DELETE', response, query.path)
    break
  }
}).listen(8000);


function sendRequestToHDFS(op, addressTo, requestType, loc, res, req){
  if(req == undefined){
    url = 'http://'+addressTo+"/webhdfs/v1/usr/"+loc+"?op="+op
    console.log("Sending " + requestType + " request to:-\n"+url)
      request(
      { method: requestType
      , url: url}
      ,function (error, response, body) {
        if(error != undefined){
          return error;  
        } 
        tmp = successCallback(response,body)
        res.write(tmp+"");
        res.end()
      });
  }
  else {
    url = 'http://'+addressTo+"/webhdfs/v1/usr/"+loc+"?op="+op+"&replication=2&permission=777"
    console.log("Piping " + requestType + " request to:-\n"+url)
    req.pipe(request.put(url, function (error, response, body) {
        console.log(response);
    }));
  }
}

function successCallback(response,body){
  return JSON.parse(body).boolean;
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