window.onload = function(){
  new Popup(document.getElementById("popupBtn"));
};

//浮出层
var Popup = function(btnEle,width,height){
    this.btnEle = btnEle; //指向浮出层的按钮
    this.container = $(this.btnEle.dataset.target); //浮出层
    this.width = width > 450 ? width : 450;
    this.height = height > 250 ? height : 250;
    this.show();
    this.hide();
};
//浮出层的浮出函数
Popup.prototype.show = function(){
    var _this = this;
    this.btnEle.onclick = function(){
        _this.container.style.display = "block";
        var contentObj = _this.container.getElementsByClassName("content")[0];
        _this.setSize(contentObj, _this.width, _this.height);
    };
};
//浮出层的隐藏
Popup.prototype.hide = function(){
    var _this = this;
    window.onclick = function(event){
        if (event.target == _this.container || $(event.target.dataset.dismiss) == _this.container){
            _this.container.style.display  = "none";
        }
    };
};
//设置浮出层的大小
Popup.prototype.setSize = function (document, width, height) {
    document.style.width = width + "px";
    document.style.height = height + "px";
};

var $ = function(selector){
    return  document.querySelector(selector);
};