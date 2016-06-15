var WaterFall = function (column, columnGap, ele) {
    this.column = column || this.getColumn();
    this.columnGap = columnGap || 16;
    this.imgContainer = ele || document.getElementsByClassName("container")[0];
    this.imgList = [
        {url: 'pt/img1.jpg', name: 'title', description: 'description'},
        {url: 'pt/img2.jpg', name: 'title', description: 'description'},
        {url: 'pt/img3.jpg', name: 'title', description: 'description'},
        {url: 'pt/img4.jpg', name: 'title', description: 'description'},
        {url: 'pt/img5.jpg', name: 'title', description: 'description'},
        {url: 'pt/img6.jpg', name: 'title', description: 'description'},
        {url: 'pt/img7.jpg', name: 'title', description: 'description'},
        {url: 'pt/img8.jpg', name: 'title', description: 'description'},
        {url: 'pt/img9.jpg', name: 'title', description: 'description'},
        {url: 'pt/img10.jpg', name: 'title', description: 'description'}
    ];
    this.init();
};

WaterFall.prototype.init = function () {
    var columnWidth = (this.imgContainer.clientWidth - this.columnGap) / this.column;

    this.imgContainer.style.paddingLeft = this.columnGap / 2 + "px";
    this.imgContainer.style.paddingRight = this.columnGap / 2 + "px";

    for (var i = 0; i < this.column; i++) {

        var column = document.createElement('div');
        column.className = "column";
        column.style.width = columnWidth + "px";
        column.appendChild(this.createImgBox());
        this.imgContainer.appendChild(column);
    }

    this.loadMore();

};

/*加载更多的图片*/
WaterFall.prototype.loadMore = function () {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop; // chorme  只认识document.body.scrollTop
    var minHeight = this.getMinHeightELe().clientHeight;
    this.addItem();
    while (scrollTop + window.innerHeight > minHeight) {
        this.addItem();
        minHeight = this.getMinHeightELe().clientHeight;
        console.log(minHeight);
    }
     var _this = this;
     window.onscroll = function () {
     _this.loadMore();
     };
};

/*在高度最小的column里添加新的图片*/
WaterFall.prototype.addItem = function () {
    this.getMinHeightELe().appendChild(this.createImgBox());
};

WaterFall.prototype.getMinHeightELe = function () {
    var columnList = this.imgContainer.getElementsByClassName("column");
    var minHeightEle = columnList[0];
    var imgNodes = columnList[0].getElementsByTagName("img");
    for (var i = 1; i < columnList.length; i++) {
        imgNodes = columnList[i].getElementsByTagName("img");
        if (minHeightEle.clientHeight > columnList[i].clientHeight) {
            minHeightEle = columnList[i];
        }
    }
    return minHeightEle;
};

WaterFall.prototype.createImgBox = function () {

    var imgIndex = Math.round(Math.random() * 9);

    var box = document.createElement("div");
    box.className = "box";
    box.style.margin = this.columnGap + "px " + (this.columnGap / 2) + "px";

    var html = "<img src='" + this.imgList[imgIndex].url + "' alt=' '/>" +
        "<h3>" + this.imgList[imgIndex].name + "</h3>" +
        "<p>" + this.imgList[imgIndex].description + "</p>";
    box.innerHTML = html;

    return box;
};

WaterFall.prototype.getColumn = function () {
    if (window.innerWidth > 1300) {
        return 5;
    } else if (window.innerWidth > 900) {
        return 3;
    } else {
        return 2;
    }
};