var app = {
	addNote:function(){
		jQuery("/addNote",function(data){
			alert(data);
		});	
	}
};
