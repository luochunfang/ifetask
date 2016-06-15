/**
 * Created by luochunfang on 2016-06-01.
 */
window.onload = function () {
    var canvas = document.getElementById("canvas");
    canvas.height = document.documentElement.clientHeight || document.body.clientHeight;
    canvas.width = document.documentElement.clientWidth || document.body.clientWidth;

    new CoolClock(canvas, 10)
};
var CoolClock = function (c, r) {
    this.c = c;  // canvas 元素
    this.context = c.getContext("2d");  // 上下文对象
    this.r = r; //  需要绘制的小球的半径
    this.marginLeft = (c.clientWidth - 58 * 2 * this.r) / 2;
    this.marginTop = c.clientHeight / 5;

   /* this.endTime = new Date();  //  结束时间
    this.endTime.setTime(this.endTime.getTime() + 6 * 3600 * 1000);*/
    //this.formerTime = 0;
    this.formerTime = new Date();

    this.balls = [];
    this.ballColors = ["#33B5E5", "#0099CC", "#AA66CC", "#9933CC", "#99CC00", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000"];

    this.render();
};

//渲染canvas
CoolClock.prototype.render = function () {
    this.context.clearRect(0, 0, this.c.clientWidth, this.c.clientHeight);
    var _this = this;
    this.time = setInterval(function () {
        _this.update();
        _this.updateBalls();
    }, 50);
};

CoolClock.prototype.update = function () {
    this.context.clearRect(0, 0, this.c.clientWidth, this.c.clientHeight);
    var nowTime = new Date(); //  现在时间
 /*   var timeTotal = this.endTime - nowTime;

    if (timeTotal == 0) {
        clearInterval(this.time);
    }*/

    /*var hour = parseInt(timeTotal / (3600 * 1000));
    var minutes = parseInt(timeTotal / (60 * 1000)) % 60;
    var seconds = parseInt(timeTotal / 1000) % 60;*/

    var hour = nowTime.getHours();
    var minutes = nowTime.getMinutes();
    var seconds = nowTime.getSeconds();

    this.renderDigits(parseInt(hour / 10), this.marginLeft, this.marginTop);
    this.renderDigits(parseInt(hour % 10), this.marginLeft + 16 * this.r, this.marginTop);
    this.renderDigits(10, this.marginLeft + 32 * this.r, this.marginTop); // 冒号
    this.renderDigits(parseInt(minutes / 10), this.marginLeft + 42 * this.r, this.marginTop);
    this.renderDigits(parseInt(minutes % 10), 58 * this.r + this.marginLeft, this.marginTop);
    this.renderDigits(10, 74 * this.r + this.marginLeft, this.marginTop); //冒号
    this.renderDigits(parseInt(seconds / 10), 84 * this.r + +this.marginLeft, this.marginTop);
    this.renderDigits(parseInt(seconds % 10), 100 * this.r + this.marginLeft, this.marginTop);

   /* var formerTimeTotal = this.endTime - this.formerTime;
    var formerHours = parseInt(formerTimeTotal / (3600 * 1000));
    var formerMinutes = parseInt(formerTimeTotal / (60 * 1000)) % 60;
    var formerSeconds = parseInt(formerTimeTotal / 1000) % 60;*/

    var formerHours = this.formerTime.getHours();
    var formerMinutes = this.formerTime.getMinutes();
    var formerSeconds = this.formerTime.getSeconds();

    // 时
    if (parseInt(formerHours / 10) !== parseInt(hour / 10)) {
        this.addBalls(parseInt(hour / 10), this.marginLeft, this.marginTop);
    }
    if (parseInt(formerHours % 10)!== parseInt(hour % 10)) {
        this.addBalls(parseInt(hour % 10), this.marginLeft + 16 * this.r, this.marginTop);
    }

    //分
    if (parseInt(formerMinutes / 10)!==parseInt(minutes / 10)) {
        this.addBalls(parseInt(minutes / 10), this.marginLeft + 42 * this.r, this.marginTop);
    }
    if (parseInt(formerMinutes % 10)!==parseInt(minutes % 10)) {
        this.addBalls(parseInt(minutes % 10), 58 * this.r + this.marginLeft, this.marginTop);
    }

    // 秒
    if (parseInt(formerSeconds / 10)!==parseInt(seconds / 10)) {
        this.addBalls(parseInt(seconds / 10), 84 * this.r + +this.marginLeft, this.marginTop);
    }
    if (parseInt(formerSeconds % 10)!==parseInt(seconds % 10)) {
        this.addBalls(parseInt(seconds % 10), 100 * this.r + this.marginLeft, this.marginTop);
    }
    this.formerTime = nowTime;
};

CoolClock.prototype.updateBalls = function () {

    var count = 0;
    for (var i = 0, len = this.balls.length; i < len; i++) {

        this.context.beginPath();
        this.context.arc(this.balls[i].x, this.balls[i].y, this.r, 0, 2 * Math.PI);
        this.context.fillStyle = this.balls[i].color;
        this.context.fill();

        this.balls[i].x += this.balls[i].vx;
        this.balls[i].y += this.balls[i].vy;
        this.balls[i].vy += this.balls[i].g;

        if (this.balls[i].y >= this.c.clientHeight) {
            this.balls[i].y = this.c.clientHeight - this.r;
            this.balls[i].vy = -this.balls[i].vy * 0.75;
        }

        if (this.balls[i].x + this.r >= 0 || this.balls[i].x - this.r <= this.c.clientWidth) {
            this.balls[count++] = this.balls[i];
        }
    }
    while (count < this.balls.length) {
        this.balls.pop();
    }
};

CoolClock.prototype.addBalls = function (number, x, y) {
    for (var i = 0, len1 = digit[number].length; i < len1; i++) {
        for (var j = 0, len2 = digit[number][i].length; j < len2; j++) {
            if (digit[number][i][j] === 1) {
                this.balls.push({
                    x: x + this.r * (2 * j + 1),
                    y: y + this.r * (2 * i + 1),
                    vx: Math.pow(-1, Math.round(Math.random() * 4)) * 5,
                    vy: -5,
                    g: Math.random() + 1.5,
                    color: this.ballColors[Math.floor(Math.random() * this.ballColors.length)]
                });
            }
        }
    }
};

//渲染数据
CoolClock.prototype.renderDigits = function (number, x, y) {

    this.context.fillStyle = "#0b94ba";
    for (var i = 0, len1 = digit[number].length; i < len1; i++) {
        for (var j = 0, len2 = digit[number][i].length; j < len2; j++) {
            if (digit[number][i][j] === 1) {
                this.context.beginPath();
                this.context.arc(x + this.r * (2 * j + 1), y + this.r * (2 * i + 1), this.r, 0, 360);
                this.context.fill();
            }
        }
    }
};