// JSON.stringify needed if using node.js, but not for flask

function Ajax(type) {
    this.method = "GET";
    this.data = "";
    this.queryStr = "";
    this.url = "";
    this.successCallBack = null;
    this.errorCallBack = null;
    this.dataType="";
    this.contentType="";
}

Ajax.prototype.sendRequest = function(){

	switch(this.method){
		case "GET":
		jQuery.get(this.url+this.queryStr)
			.done(this.successCallBack)
			.fail(this.errorCallBack);
		break;

		case "POST":
		jQuery.post(this.url,this.data)
			.done(this.successCallBack)
			.fail(this.errorCallBack);
		break;
	}
	
};
