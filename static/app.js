/**
 * @author Rushabh Shroff
 */

// Dont think the error call back works
var rows;
var keys;
var row=0;
var newElmKey;
var lastElmCount;
var rep;
var app = {
	
	addNote:function(){

			debugger;
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

		jQuery('#removeModal').modal();

		jQuery('#removeModal').on('shown', function () {
			jQuery('#sure').click(function(){
				aj = new Ajax();
				aj.method = "GET";
				aj.url = Constants.removeNote;
				aj.queryStr = "?userkey="+jQuery.trim(userkey);
				aj.successCallBack = app.successCallBack;
				aj.errorCallBack = app.errorCallBack;			
				aj.sendRequest();

				// Creating Spinner
				var opts = {
				  lines: 13, // The number of lines to draw
				  length: 39, // The length of each line
				  width: 10, // The line thickness
				  radius: 30, // The radius of the inner circle
				  corners: 1, // Corner roundness (0..1)
				  rotate: 0, // The rotation offset
				  direction: 1, // 1: clockwise, -1: counterclockwise
				  color: '#000', // #rgb or #rrggbb
				  speed: 1, // Rounds per second
				  trail: 60, // Afterglow percentage
				  shadow: false, // Whether to render a shadow
				  hwaccel: false, // Whether to use hardware acceleration
				  className: 'spinner', // The CSS class to assign to the spinner
				  zIndex: 2e9, // The z-index (defaults to 2000000000)
				  top: 'auto', // Top position relative to parent in px
				  left: 'auto' // Left position relative to parent in px
				};
				//var target = document.getElementById('removeBody');
				//var spinner = new Spinner(opts).spin(target);

				//jQuery('#removeHeader').html(" ");
				//jQuery('#removeBodyText').remove();
				//jQuery('#removeFooter');

			});			
		});

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
			var toAppend="";	

			newElmKey = data.key

			if ( lastElmCount % 3 == 0 && lastElmCount != 0){
				row+=1
				toAppend += '<div class="row-fluid" id = "row'+row+'">'
					  +'<div class="span4" id="'+newElmKey+'">'
	            	  +'<h2>'+jQuery("#heading").val()+'</span></h2>'
	            	  +'<p>'+jQuery("#note").val()+'</p>'
	            	  +'<p><a class="btn" href="#"'
	            	  +' onclick="app.removeNote(\''+ newElmKey + '\')">Remove Note</a></p>'
	               	  +'</div>';
	       		jQuery('#grid').append(toAppend);
			}
			else{
				toAppend += '<div class="span4" id="'+newElmKey+'">'
	            	  +'<h2>'+jQuery("#heading").val()+'</span></h2>'
	            	  +'<p>'+jQuery("#note").val()+'</p>'
	            	  +'<p><a class="btn" href="#"'
	            	  +' onclick="app.removeNote(\''+ newElmKey + '\')">Remove Note</a></p>'
	            	  +'</div>';
	            jQuery('#row'+row).append(toAppend);
			}

			var sideBarNav='<li class="active" id="'+jQuery("#heading").val()+'"><a href="#" onclick="return false;">'+jQuery("#heading").val()+'</a></li>'    	      	        	    
			jQuery('#sideNav').append(sideBarNav);

			rows[jQuery("#heading").val()] = jQuery("#note").val();
			keys[newElmKey] = jQuery("#heading").val()
			lastElmCount+=1
	},

	getNotesResponse:function(data){
		row=0;

		if (data != undefined){
			rows = data.notes;
			keys = data.keys;
		}
			
		sortedKeys = []
		jQuery.each(keys, function(key, val) {
			sortedKeys.push(key);
		});
		sortedKeys = sortedKeys.sort();
		var toAppend = '<div id="grid"><div class="row-fluid" id = "row'+row+'">'

		var sideBarNav = "";

		i=0;
		while(i<sortedKeys.length){
			if ( i % 3 == 0 && i != 0){
				row+=1

				toAppend += '</div><div class="row-fluid" id = "row'+row+'">'
					  +'<div class="span4" id='+ sortedKeys[i] +'>'
	            	  +'<h2>'+keys[sortedKeys[i]]+'</span></h2>'
	            	  +'<p>'+rows[keys[sortedKeys[i]]]+'</p>'
	            	  +'<p><a class="btn"'
	            	  +' onclick="app.removeNote(\''+ sortedKeys[i] +'\')">Remove Note</a></p>'
	               	  +'</div>'
			}
			else{
				toAppend += '<div class="span4" id=@'+ sortedKeys[i] +'>'
	            	  +'<h2>'+keys[sortedKeys[i]]+'</span></h2>'
	            	  +'<p>'+rows[keys[sortedKeys[i]]]+'</p>'
	            	  +'<p><a class="btn"'
	            	  +' onclick="app.removeNote(\''+ sortedKeys[i] +'\')">Remove Note</a></p>'
	            	  +'</div>'
			}

			sideBarNav+='<li class="active" id="'+keys[sortedKeys[i]]+'"><a href="#" onclick="return false;">'+keys[sortedKeys[i]]+'</a></li>'    	      	        	    
            i+=1
		}

		lastElmCount=i;
		toAppend += '</div></div>'

		jQuery('#sideNav').replaceWith('<ul class="nav nav-list" id="sideNav">'
							              +'<li class="nav-header">Notes</li></ul>');
		jQuery('#sideNav').append(sideBarNav);
		jQuery('#grid').replaceWith(toAppend);

	},

	removeNoteResponse:function(data){

		var temp1 = {};
		var temp2 = {};
		jQuery.each(keys, function(key, val) {
			if(String(key) != String(data.userkey)){
				console.log(String(key))
				console.log(String(data.userkey))
				temp1[key]=val;
				temp2[keys[key]]=rows[val];
			}	
		});
		keys = temp1;
		rows = temp2;
	
		jQuery('#removeModal').modal('toggle');
		jQuery(document.getElementById(data.userkey)).remove();

		app.getNotesResponse(undefined);

		jQuery('#sure').unbind();
		jQuery('#removeModal').unbind();
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
