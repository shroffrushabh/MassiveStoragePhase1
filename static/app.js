/**
 * @author Rushabh Shroff
 */

// Dont think the error call back works

var app = {
	
	addNote:function(){
			data ={'username' : "sample",'note': jQuery("#note").val(),'heading':jQuery("#heading").val()}; 
			
			//jQuery.post('/addNote',{'username':'vasu','heading':'Sample9','note':'SampleText9'},function(data){console.log(data)});
	
			data = {'username':'vasu','heading':'Sample9','note':'SampleText9'};
			
			aj = new Ajax();
			aj.method = "POST";
			aj.url = Constants.addNote;
			aj.data = data;
			aj.successCallBack = app.successCallBack;
			aj.errorCallBack = app.errorCallBack;

			aj.sendRequest();
	
	},
	
	getNotes:function(username){
			aj = new Ajax();
			aj.method = "GET";
			aj.url = Constants.getNotes;
			aj.queryStr = "?username="+username;
			aj.successCallBack = app.successCallBack;
			aj.errorCallBack = app.errorCallBack;
			
			aj.sendRequest();
		
	},
	
	successCallBack:function(data){
		console.log(data);
	},
	
	errorCallBack:function(data){
		console.log(data);		
	},
	
};
