var app = {
	logout:function(){
	    FB.logout(function(response) {
	    	location.reload();
        });
	}
	
};
