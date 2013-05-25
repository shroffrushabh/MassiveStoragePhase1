/**
 * @author Rushabh Shroff
 */

// Dont think the error call back works
var rows;
var keys;
var row=0;
var newElmKey;
var lastElmCount;
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
			aj.queryStr = "?username="+jQuery.trim(app.getCookie('username'));
			aj.successCallBack = app.successCallBack;
			aj.errorCallBack = app.errorCallBack;			
			aj.sendRequest();
		
	},

	removeNote: function(userkey){
		aj = new Ajax();
		aj.method = "GET";
		aj.url = Constants.removeNote;
		aj.queryStr = "?userkey="+jQuery.trim(userkey);
		aj.successCallBack = app.successCallBack;
		aj.errorCallBack = app.errorCallBack;			
		aj.sendRequest();
	},

	successCallBack:function(data){
		data = app.replaceAll(data,"u'","'")
		data = app.replaceAll(data,"'",'"')
		JSONResp = JSON.parse(data);
		window["app"][JSONResp.response](JSONResp.payload);
	},
	
	errorCallBack:function(data){
		data = app.replaceAll(data,"	u'",'')
		data = app.replaceAll(data,"'",'"')
		JSONResp = JSON.parse(data);
		window["app"][JSONResp.response](JSONResp.payload);
	},
	
	addNoteResponse:function(data){
			var toAppend=""	

			newElmKey = data.key

			if ( lastElmCount % 3 == 0 && lastElmCount != 0){
				row+=1
				toAppend += '<div class="row-fluid" id = "row'+row+'">'
					  +'<div class="span4" id="'+newElmKey+'">'
	            	  +'<h2>'+jQuery("#heading").val()+'</span></h2>'
	            	  +'<p>'+jQuery("#note").val()+'</p>'
	            	  +'<p><a class="btn" href="#"'
	            	  +' onclick="app.removeNote("'+ newElmKey +'")">Remove Note</a></p>'
	               	  +'</div>'
	       		jQuery('#grid').append(toAppend);
			}
			else{
				toAppend += '<div class="span4" id="'+newElmKey+'">'
	            	  +'<h2>'+jQuery("#heading").val()+'</span></h2>'
	            	  +'<p>'+jQuery("#note").val()+'</p>'
	            	  +'<p><a class="btn" href="#"'
	            	  +' onclick="app.removeNote("'+ newElmKey +'")">Remove Note</a></p>'
	            	  +'</div>'
	            jQuery('#row'+row).append(toAppend);
			}
			lastElmCount+=1
	},

	getNotesResponse:function(data){
		row=0;

		rows = data.notes;
		keys = data.keys;
		sortedKeys = []
		jQuery.each(keys, function(key, val) {
			sortedKeys.push(key);
		});
		sortedKeys = sortedKeys.sort();
		var toAppend = '<div class="row-fluid" id = "row'+row+'">'

		i=0;
		while(i<sortedKeys.length){
			if ( i % 3 == 0 && i != 0){
				row+=1

				toAppend += '</div><div class="row-fluid" id = "row'+row+'">'
					  +'<div class="span4" id=@'+ keys[sortedKeys[i]] +'>'
	            	  +'<h2>'+keys[sortedKeys[i]]+'</span></h2>'
	            	  +'<p>'+rows[keys[sortedKeys[i]]]+'</p>'
	            	  +'<p><a class="btn"'
	            	  +' onclick="app.removeNote(\'@'+ keys[sortedKeys[i]] +'\')">Remove Note</a></p>'
	               	  +'</div>'
			}
			else{
				toAppend += '<div class="span4" id=@'+ keys[sortedKeys[i]] +'>'
	            	  +'<h2>'+keys[sortedKeys[i]]+'</span></h2>'
	            	  +'<p>'+rows[keys[sortedKeys[i]]]+'</p>'
	            	  +'<p><a class="btn"'
	            	  +' onclick="app.removeNote(\'@'+ keys[sortedKeys[i]] +'\')">Remove Note</a></p>'
	            	  +'</div>'
			}    	      	        	    
            i+=1
		}

		lastElmCount=i;
		toAppend += '</div>'

		jQuery.each(keys, function(key, val) {
			toAppend=app.replaceAll(toAppend,'@'+val,key)
		});

		jQuery('#grid').append(toAppend);

	},

	removeNoteResponse:function(){
		console.log('Removed...');
		return false;
	},

	replaceAll:function (str, find, replace) {
    	return str.replace(new RegExp(find, 'g'), replace);
	},

	getCookie:function(c_name){
		var c_value = document.cookie;
		var c_start = c_value.indexOf(" " + c_name + "=");
		if (c_start == -1){
		  c_start = c_value.indexOf(c_name + "=");
		}
		if (c_start == -1){
		  c_value = null;
		}
		else{
		  c_start = c_value.indexOf("=", c_start) + 1;
		  var c_end = c_value.indexOf(";", c_start);
		  if (c_end == -1){
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
