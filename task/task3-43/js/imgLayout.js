window.onload = function () {
    new ImgBox("box").layout();
};
//图片的盒子对象
var ImgBox = function (imgContainerClassName) {
    this.boxList = document.getElementsByClassName(imgContainerClassName);
};
//盒子的img布局方法
ImgBox.prototype.layout = function () {
    for (var i = 0, len = this.boxList.length; i < len; i++) {
        var box = this.boxList[i];
        var imgChilds = box.getElementsByTagName("img"), boxObj = this.getBoxSize(box);
        var imgChildsLen = imgChilds.length, boxWidth = boxObj.w, boxHeight = boxObj.h;
        if (imgChildsLen == 1) { //一张图片的布局
            this.setImgSize(imgChilds[0], boxHeight, boxWidth);
        } else if (imgChildsLen == 2) { //两张图片的布局
            //第一张图片的布局
            this.setImgSize(imgChilds[0], boxHeight, boxWidth);
            var point2Left = boxWidth / 3 * 2, point3left = boxWidth / 3;
            var points = "0,0 " + point2Left + ",0 " + point3left + "," + boxHeight + " 0," + boxHeight,
                pathId = "two_layout_first";
            this.createSvgClipElement(box, pathId, points);
            imgChilds[0].style.clipPath ="url(#"+pathId+")" ;

            //第二张图片的布局
            this.setImgSize(imgChilds[1], boxHeight, boxWidth);
            points = point2Left + ",0 " + boxWidth + ",0 " + boxWidth + "," + boxHeight + " " + point3left + "," + boxHeight;
            pathId = "two_layout_second";
            this.createSvgClipElement(box, pathId, points);
            imgChilds[1].style.clipPath = "url(#"+pathId+")";
        }
    }
};
//获取盒子的宽高
ImgBox.prototype.getBoxSize = function (ele) {
    return {w: ele.clientWidth, h: ele.clientHeight};
};
//设置盒子里的图片大小
ImgBox.prototype.setImgSize = function (imgObj, height, width) {
    imgObj.style.height = height + "px";
    imgObj.style.width = width + "px";
};
//创建路径剪裁的函数
ImgBox.prototype.createSvgClipElement = function (imgBox, pathId, polyPoints) {

    var svgNode = document.createElement("svg"),
        defsNode = document.createElement("defs"),
        clipPathNode = document.createElement("clipPath"),
        polygonNode = document.createElement("polygon");

    clipPathNode.id = pathId;
    polygonNode.setAttribute("points", polyPoints);
    polygonNode.style.fill = "#cccccc";
    polygonNode.style.stroke = "#000000";
    polygonNode.style.strokeWidth = "1";

    clipPathNode.appendChild(polygonNode);
    defsNode.appendChild(clipPathNode);
    svgNode.appendChild(defsNode);
    imgBox.appendChild(svgNode);

};