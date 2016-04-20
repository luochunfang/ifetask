/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = '';
    var sum = 0;
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
};

/**
 * 渲染图表
 */
function renderChart() {
    var charNode = document.getElementById("aqi-chart-wrap");
    //清空所有图表的所有子节点 此处用innerHTML设置更高效，但考虑innerHTML未被普遍支持，仍选择循环删除节点
    var charNodeChilds = charNode.getElementsByTagName("p");
    while(charNodeChilds.length){
        charNode.removeChild(charNodeChilds[charNodeChilds.length-1]);
    }
    //为图标添加空气质量的子节点
    //此处用节点插入更为高效，innerHTML用“+=”操作符追加一段文本通常效率低下，因为它既要序列化又要解析
    //可将文本push进数组。再使用innerHTML = arr.join("");
    for (var prop in chartData) {
        var aqinode = document.createElement("p");
        aqinode.title = prop + ":" + chartData[prop];
        aqinode.style.height = chartData[prop]+"px";
        if (chartData[prop] <= 200) {
            aqinode.style.backgroundColor = "#99D02F";
        } else if (chartData[prop] <= 400) {
            aqinode.style.backgroundColor = "#E5AD09";
        } else {
            aqinode.style.backgroundColor = "#A8240B";
        }
        charNode.appendChild(aqinode);
    }
    if (pageState.nowGraTime === "day") {
        charNode.setAttribute("class", "day");
    } else if (pageState.nowGraTime === "week") {
        charNode.setAttribute("class", "week");
    } else {
        charNode.setAttribute("class", "month");
    }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    // 确定是否选项发生了变化
    if (pageState.nowGraTime === this.value) return;
    // 设置对应数据
    pageState.nowGraTime = this.value;
    initAqiChartData();
    // 调用图表渲染函数
    renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化
    if (pageState.nowSelectCity === -1 || pageState.nowSelectCity === this.value) {
        return;
    }
    // 设置对应数据
    pageState.nowSelectCity = document.getElementById("city-select").value;
    initAqiChartData();
    // 调用图表渲染函数
    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var radioList = document.getElementsByName("gra-time");
    for (var i = 0; i < radioList.length; i++) {
        radioList[i].onclick = graTimeChange;
    }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var selectNode = document.getElementById("city-select");
    pageState.nowSelectCity = selectNode.value;
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    selectNode.onclick = citySelectChange;
}

/**
 * 初始化图表需要的数据格式,待改进为调用一次即可！！！
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    chartData = {}; //清空数据
    var data = aqiSourceData[pageState.nowSelectCity];
    if (pageState.nowGraTime === "day") {
        chartData = data;
    } else if (pageState.nowGraTime === "week") {
        var count = 0, sum = 0; //count记录当前计算了多少天,sum记录当前空气质量的和
        for (var prop in data) {
            var date = new Date(prop), nextday = new Date(prop);
            nextday.setDate(nextday.getDate() + 1);  //当前天的下一天
            if (count < 7) {
                sum += data[prop];
                count++;
                //如果当前天和当前天的下一天不在同一个月，虽不满一个星期，也算出空气质量的平均值
                if (date.getMonth() !== nextday.getMonth()) {
                    date.setDate(date.getDate() - count);
                    var avgstartday = getDateStr(date);
                    chartData[avgstartday + " to " + prop] = Math.ceil(sum / count);
                }
            } else {
                date.setDate(date.getDate() - count); //计算七天前的日期
                nextday.setDate(nextday.getDate() - 2); //计算第七天的日期
                chartData[getDateStr(date) + " to " + getDateStr(nextday)] = Math.ceil(sum / count);
                sum = data[prop];
                count = 1;
            }
        }
    } else if (pageState.nowGraTime === "month") {
        var count = 0, sum = 0; //count记录当前计算了多少天,sum记录当前空气质量的和
        for (var prop in data) {
            var date = new Date(prop), nextday = new Date(prop);
            nextday.setDate(nextday.getDate() + 1); //当前天的下一天
            sum += data[prop];
            count++;
            if (date.getMonth() !== nextday.getMonth()) {
                date.setDate(date.getDate() - (count - 1));
                var avgstartday = getDateStr(date);
                chartData[avgstartday + " to " + prop] = Math.ceil(sum / count);
                sum = 0;
                count = 0;
            }
        }
    }
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
  //  initAqiChartData();
}

init();