/**
 * @author Rushabh Shroff
 */

// Dont think the error call back works

var app = {
	
	addNote:function(){

			var username = app.getCookie('username');
			var note = jQuery("#note").val();
			var heading = jQuery("#heading").val();

			data ={'username' : username,'note': note,'heading':heading}; 
			
			aj = new Ajax();
			aj.method = "POST";
			aj.url = Constants.addNote;
			aj.data = data;
			aj.successCallBack = app.successCallBack;
			aj.errorCallBack = app.errorCallBack;
			aj.sendRequest();
	
	},
	
	getNotes:function(){
			aj = new Ajax();
			aj.method = "GET";
			aj.url = Constants.getNotes;
			aj.queryStr = "?username="+app.getCookie('username');;
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
	

	getCookie:function(c_name){
		var c_value = document.cookie;
		var c_start = c_value.indexOf(" " + c_name + "=");
		if (c_start == -1)
		  {
		  c_start = c_value.indexOf(c_name + "=");
		  }
		if (c_start == -1)
		  {
		  c_value = null;
		  }
		else
		  {
		  c_start = c_value.indexOf("=", c_start) + 1;
		  var c_end = c_value.indexOf(";", c_start);
		  if (c_end == -1)
		  {
		c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start,c_end));
		}
		return c_value;
	}, 

	setCookie:function(c_name,value,exdays){
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
		document.cookie=c_name + "=" + c_value;
	},


};
