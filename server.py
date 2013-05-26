from flask import Flask,render_template,request
import pycassa,time
import simplejson as json
import urlparse
from pycassa.columnfamily import ColumnFamily
from pycassa.pool import ConnectionPool
from pycassa.index import *

app = Flask(__name__)
pool = pycassa.ConnectionPool(keyspace='App', server_list=['127.0.0.1:9160'], prefill=False)
users = pycassa.ColumnFamily(pool, 'users')


@app.route("/")
def hello():
    return "Wohhooo!!!"

@app.route("/quickynote/home")
def home():
	return render_template('site.html')


@app.route('/addNote', methods=['POST'])
def storeInCass():
	data = {}
	data['username'] = str(request.form['username'])
	data['heading'] = str(request.form['heading'])
	data['note'] = str(request.form['note'])
	cass_key=data['username']+str(time.time())
	data['secondaryKey'] = cass_key

	username_expr = create_index_expression('username', data['username'])
	heading_expr = create_index_expression('heading', data['heading'])

	clause = create_index_clause([username_expr,heading_expr])

	count = 0
	for key in users.get_indexed_slices(clause):
		count +=1
		
	if count != 0:
		return 'Heading already exists'	

	print 'Request recieved for storing in Cass....'
	users.insert(cass_key,data)

	resp = {}
	resp['response'] = 'addNoteResponse'
	resp['payload'] = {'key':cass_key}
	return str(resp)

@app.route('/getNotes', methods=['GET'])
def getNotes():
	resNotes={}
	resKeys={}

	query_string = request.query_string 
	username=urlparse.parse_qs(query_string)['username'][0]	
	cass_key={}

	username_expr = create_index_expression('username', username)

	clause = create_index_clause([username_expr])
	for key, user in users.get_indexed_slices(clause):
		if(resNotes.has_key(user["heading"]) == False):
			resKeys[key] = user["heading"]
			resNotes[user["heading"]] = user["note"]

	resp = {}

	resp["response"] = "getNotesResponse"
	resp["payload"] = {'notes' : resNotes, 'keys' : resKeys} 
	return str(resp)

@app.route('/removeNote',methods=['GET'])
def removeNote():
	res={}
	query_string = request.query_string 
	userkey=urlparse.parse_qs(query_string)['userkey'][0]
	users.remove(userkey)

	resp = {}

	resp["response"] = "removeNoteResponse"
	resp["payload"] = {'userkey':userkey} 
	return str(resp)



if __name__ == "__main__":
    app.run(debug=True)
