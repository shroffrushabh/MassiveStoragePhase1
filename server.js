var http = require('http'),
    fs = require('fs'),
    url = require('url');

var PooledConnection = require('cassandra-client').PooledConnection;

var hosts = ['192.168.1.3','192.168.1.26'];
var cassandra = new PooledConnection({'hosts': hosts, 'keyspace': 'App'});

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
	    res.write(""+getNotesFromCass(query));
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
	var cql = "INSERT INTO App.users(key,username,heading,note) VALUES (?,?,?,?)";
	newKey=json.username+(new Date().getTime());
	console.log("Key in cassandra-"+newKey);
	cassandra.execute(cql,[newKey,json.username,
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
	var cql = "SELECT * FROM App.users where username=?";
	responseJson={};

	cassandra.execute(cql,[json.username], function(err, rows) {
	  if(err) {
	  	console.log(err);
	  	return {error:1};
	  }
	  console.log(rows.rowCount());
	  for(var i=0;i<rows.rowCount();i++){
		part={};
		part['note']=rows[i].note;
		part['heading']=rows[i].heading;
		responseJson[i]=part;
	  }

	  console.log(responseJson);
	  return JSON.stringify(responseJson);
	});
	return {};
}

/*

Use cassandra-cli

create keyspace App with placement_strategy = 'org.apache.cassandra.locator.SimpleStrategy' and strategy_options = {replication_factor:2};

use App;

create column family users 
with key_validation_class=UTF8Type and comparator = UTF8Type and column_metadata = 
[{column_name: heading, validation_class:UTF8Type},
 {column_name: note, validation_class:UTF8Type},
 {column_name: username, validation_class: UTF8Type ,index_type: KEYS}];

*/