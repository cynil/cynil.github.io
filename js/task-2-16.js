/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {

  var city = document.getElementById('aqi-city-input').value;
  var value = document.getElementById('aqi-value-input').value;

  var cPattern = /^\s*[a-zA-Z\u4e00-\u9fa5]+\s*$/g;
  var vPattern = /^\s*\d+\s*$/g;
  if(!city.match(cPattern)){

    return "invalid city name";
  };
  if(!value.match(vPattern)){
    return "invalid value";
  }

  city = city.replace(/^\s*(.+)\s*$/g, "$1");
  value = value.replace(/^\s*(.+)\s*$/g, "$1");

  aqiData[city] = value;

}


/**
 * 渲染aqi-table表格
 */
function renderAqiList() {

  var table = document.getElementById('aqi-table');
  table.innerHTML = "";

  for(var city in aqiData){
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + city + '</td><td>' + aqiData[city] + '</td><td><button>删除</button></td>';
    table.appendChild(tr);
  }

}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {
  // do sth.
  var key = event.target.parentNode.parentNode.firstChild.innerHTML;

  delete aqiData[key];

  renderAqiList();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  document.getElementById('add-btn').onclick = addBtnHandle;
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  document.getElementById("aqi-table").onclick = function(){
    if(event.target.nodeName === "BUTTON"){
      delBtnHandle();
    }    
  }
}

init();