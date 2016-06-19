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
  var datStr = ''
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
}

/**
 * 渲染图表
 */
function renderChart() {

  //document.body.appendChild(document.createTextNode(JSON.stringify(chartData)));
  var adapter = {
    "day": "日",
    "week": "周",
    "month": "月"
  }
  
  var wrapper = document.getElementsByClassName("aqi-chart-wrap")[0];
  wrapper.innerHTML = "";
  if(document.getElementsByTagName("h2").length){
    document.body.removeChild(document.getElementsByTagName("h2")[0]);
  }
  var header = document.createElement("h2");
  header.innerHTML = pageState.nowSelectCity + "市2016年每" + adapter[pageState.nowGraTime] +"AQI报告"; 

  document.body.insertBefore(header,wrapper);

  for (var i in chartData) {
    var bar = document.createElement('div');
    bar.title = "Time:" + i + "\nAQI:" + chartData[i] +"\nper " + pageState.nowGraTime;
    bar.style.height = chartData[i] + 'px';
    bar.className = pageState.nowGraTime;
    wrapper.appendChild(bar);
  };

}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  if(pageState.nowGraTime !== this.value){
    pageState.nowGraTime = this.value;
  }
  // 设置对应数据
  console.log(pageState);
  initAqiChartData();
  // 调用图表渲染函数
  //renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  if(pageState.nowSelectCity !== this.value){
    pageState.nowSelectCity = this.value;
  }
  // 设置对应数据
  console.log(pageState);
  initAqiChartData();
  // 调用图表渲染函数
  //renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {

  var radios = document.getElementsByName("gra-time");
  for(var i = 0; i < radios.length; i++){
    radios[i].addEventListener("click",graTimeChange);
  }
  pageState.nowGraTime = "day";
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var city = Object.getOwnPropertyNames(aqiSourceData);
  var citySelect = document.getElementById("city-select");
  citySelect.innerHTML = "";
  for (var i = 0; i < city.length; i++) {
    document.getElementById("city-select").innerHTML += "<option>" + city[i] + "</option>"
  };
  pageState.nowSelectCity = city[0];
  // 给select设置事件，当选项发生变化时调用函数citySelectChange

  citySelect.addEventListener('change',citySelectChange);

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  var rawData = aqiSourceData[pageState.nowSelectCity];

/*
  rawData likes: {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
  */
  var data = {};
  var count = {};
  if(pageState.nowGraTime == "day"){
    chartData = rawData;
  }else if(pageState.nowGraTime == "week"){
    for(var dates in rawData){
      var year = new Date(Date.parse(dates)).getFullYear();
      var week = getWeek(new Date(Date.parse(dates)));
      data[year + "-" + week] = data[year + "-" +week] ? (data[year + "-" + week] + rawData[dates]): rawData[dates];
      count[year + "-" + week] = count[year + "-" + week] ? (count[year + "-" + week] + 1): 1;
    }
    for(var i in data){
      data[i] = parseInt( data[i] / count[i] );
    }
    chartData = data;    
  }else if(pageState.nowGraTime == "month"){
    for(var dates in rawData){
      var year = new Date(Date.parse(dates)).getFullYear();
      var month = new Date(Date.parse(dates)).getMonth() + 1;
      data[year + "-" +month] = data[year + "-" +month] ? (data[year + "-" +month] + rawData[dates]): rawData[dates];
      count[year + "-" +month] = count[year + "-" +month] ? (count[year + "-" +month] + 1): 1;
    }
    for(var i in data){
      data[i] = parseInt( data[i] / count[i] );
    }
    chartData = data;
  }
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  renderChart();
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();

function getWeek(date){
  var start = new Date("Jan 1, " + date.getFullYear());
  var elapsed = (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  
  return parseInt((elapsed + (7 - start.getDay())) / 7 + 1);
}