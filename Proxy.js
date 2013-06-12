var http = require('http');
var sys  = require('sys');
var request = require('request');
var fs = require('fs');
var url  = require('url');

var namenodePort = 50070;
var datanodePort = 50075;
var hosts = readHosts()

hosts['namenode'] = '192.168.1.14'
hosts['datanode'] = '192.168.1.14'

http.createServer(function(request, response) {

  var query = url.parse(request.url, true).query;
  switch(query.op){
    case 'mkdir':
    sendPUTRequest('MKDIRS',hosts.namenode,query.path)
    break
    case 'ls':
    sendGETRequest('LISTSTATUS',hosts.namenode,query.path)
    break
    case 'create1':
    sendPUTRequest('CREATE',hosts.namenode,query.path)
    break
    case 'create2':
    createFile('CREATE',hosts.datanode,query.path, request)
    break

  }


  //request.put('http://192.168.1.14:50070/webhdfs/v1/usr/rushabh/README.txt?op=CREATE&permission=777')

  //request(
  //  { method: 'PUT' 
  //  , url: 'http://192.168.1.14:50070/webhdfs/v1/usr/rushabh/README.txt?op=CREATE&permission=777'}
  //  ,function (error, response, body) {
  //    console.log(response.headers.location);
  //    storeInDFS(response.headers.location);
  //  }
  //);

  //storeInDFS(request,"");

}).listen(8000);



function createFile(op, datanode, loc, req){
  url = 'http://'+datanode+":"+datanodePort+"/webhdfs/v1/usr/"+loc+"?op="+op+"&replication=2"
  req.pipe(request.put(url, function (error, response, body) {
      console.log(error);
      console.log(response);
      console.log(body);
  }));

}

function sendGETRequest(op, namenode, loc){
  url = 'http://'+namenode+":"+namenodePort+"/webhdfs/v1/usr/"+loc+"?op="+op
  request.get(url,function (error, response, body) {
      console.log(error);
      console.log(response);
      console.log(body);
    });
}

// Add permissions param
function sendPUTRequest(op, namenode, loc){
  url = 'http://'+namenode+":"+namenodePort+"/webhdfs/v1/usr/"+loc+"?op="+op+"&replication=2"

  request(
    { method: 'PUT' 
    , url: url}
    ,function (error, response, body) {
      console.log(response.headers.location);
    });

  /*request.put(url,function (error, response, body) {
      console.log(error);
      console.log(response);
      console.log(body);
    });*/
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