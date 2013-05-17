var http = require('http'),
    fs = require('fs'),
    url = require('url');

var Connection = require('cassandra-client').PooledConnection;

var hosts = ['192.168.1.26','192.168.1.3'];
var cassandra = new Connection({'hosts': hosts, 'keyspace': 'Keyspace1'});

cassandra.on('log', function(level, message, obj) {
	console.log('log event: %s -- %j', level, message);
});

http.createServer(function (req, res) {
	if(req.method == 'GET' && req.url.indexOf("/quickynote/home") != -1){
		fs.readFile('site.html',function (err, data){
	        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
    	    res.write(data);
    	    res.end();
    	});	
	} 

	if(req.method == 'GET' && req.url.indexOf("/getNotes") != -1){
	    console.log('Fetching notes from Cass');
	   	
	    var url_parts = url.parse(req.url, true);
		var query = url_parts.query
		
	    res.writeHead(200, { 
	        'Content-Type': 'text/json',
	        'Access-Control-Allow-Origin': '*' 
	    });
	    res.write(""+getNotesFromCass(JSON.parse(JSON.stringify(query))));
	    res.end();
	}  

	if(req.method == 'POST' && req.url.indexOf("/addNote") != -1){
	    console.log('Request received');
	   	
	   	var json;
	    req.on('data', function (chunk) {
	    	json=chunk.toString();
	    });

	    req.on('end',function(){
		    res.end('{"flag": '+addToCass(json)+'}'); 
	    });

	    res.writeHead(200, {
		    'Content-Type': 'text/json',
	        'Access-Control-Allow-Origin': '*' 
	    });
	}
}).listen(5000);

console.log('Server running at http://127.0.0.1:5000/');

function addToCass(json){
	json = JSON.parse(json);
	var cql = "INSERT INTO App.users (KEY,username,heading,note) VALUES (?,?,?,?)";
	cassandra.execute(cql,[json.username+(new Date().getTime()),json.username,
		json.heading,json.note], function(err, rows) {
	  if(err) {
	  	console.log(err);
	  	return 1;	
	  }
	  return 0;
	});
	return -1;
}

function getNotesFromCass(json){
	var cql = "SELECT notes,heading FROM App.users where username=?";
	cassandra.execute(cql,[json.username], function(err, rows) {
	  if(err) {
	  	console.log(err);
	  	return {error:1};	
	  }
  	  responseJson={};
	  for(var i=0;i<rows.length;i++){
		part={};
		part['note']=rows[i].note;
		part['heading']=rows[i].heading;
		responseJson[i]=part;
	  }

	  return JSON.stringify(responseJson);
	});
	return {};
}


/*
Make cassandra keyspace

Use cassandra-cli

create keyspace App;
use App;
create column family UserData;


*/