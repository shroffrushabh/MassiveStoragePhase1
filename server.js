var http = require('http'),
    fs = require('fs');

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

	if(req.method == 'POST' && req.url.indexOf("/addNote") != -1){
	    console.log('Request received');
	   	
	   	var json;
	    req.on('data', function (chunk) {
	    	json=JSON.parse(chunk.toString());
	    });

	    req.on('end',function(){
	    	addToCass(json);
		    res.end('{"flag": "1"}'); 
	    });

	    res.writeHead(200, { 
	        'Content-Type': 'text/json',
	        'Access-Control-Allow-Origin': '*' 
	    });

	}

}).listen(5000);

console.log('Server running at http://127.0.0.1:5000/');

function addToCass(json){

	var cql = "SELECT * FROM Users where key=?";
	cassandra.execute(cql,['rshroff'], function(err, rows) {
	  if(err) console.log(err);

	  console.log(rows[0].cols);

	  cassandra.shutdown(function() {
	    console.log("connection pool shutdown");
	  });
	});
}
