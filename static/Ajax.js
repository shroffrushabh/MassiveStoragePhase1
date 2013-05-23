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
	jQuery.ajax({
		url:this.url+this.queryStr,
		method:this.method,
		data:this.data,
		contentType: this.contentType,
	    dataType: this.dataType,
		success:this.successCallBack,
		error:this.errorCallBack,
	});
	
};