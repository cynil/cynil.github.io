/*
    通过单击某个具体的日期进行日期选择
    组件初始化时，可配置可选日期的上下限。可选日期和不可选日期需要有样式上的区别
    增加一个接口，用于当用户选择日期后的回调处理
    增加一个参数及相应接口方法，来决定这个日历组件是选择具体某天日期，还是选择一个时间段
    当设置为选择时间段时，需要在日历面板上点击两个日期来完成一次选择，两个日期中，较早的为起始时间，较晚的为结束时间，选择的时间段用特殊样式标示
    增加参数及响应接口方法，允许设置时间段选择的最小或最大跨度，并提供当不满足跨度设置时的默认处理及回调函数接口
    在弹出的日期段选择面板中增加确认和取消按钮
*/
Date.prototype.getFullDate = Date.prototype.getFullDate || function(){

    return ([this.getFullYear(), this.getMonth()+1, this.getDate()]).join('/');

}

U.genHeader = function(arr, wrap){

    return arr.map(function(v, i, arr){
        return '<' + wrap + '>' + v + '</' + wrap + '>'
    }).join('')

}

U.genDays = function(ym) {
    var cls,

        _DAYS = 42,

        dayArr = [],//保存输出的数组

        start = ym.getDay(),//当前月份的第一天是星期几？

        //日历主面板的第一个格子应该是哪个日子？
        date0 = new Date(ym.getFullYear(), ym.getMonth(), 1-start).getTime(),

        ym31 = new Date(ym.getFullYear(), ym.getMonth() + 1, 0)//当前月份的最后一天

    for(var i=0; i< _DAYS; i++){

        //判断当前日子的类型，是否需要加特殊类名
        var cur = new Date(date0 + 24*60*60000*i)

        cls = "current";

        if (cur.getTime() < ym.getTime()){
            cls = "prev-month"
        }else if(cur.getTime() > ym31.getTime()){
            cls = "next-month"
        };

        if(cur.getFullDate() == new Date().getFullDate()){

            cls += " today"

        }
        
        dayArr[i] = '<span class="' + cls + '">' + cur.getDate() + '</span>'
    }

    return dayArr.join('')
}

function Datepicker(el, options){

    this.el = el
    
    var defaults = {

        min: '2000/1/1',
        max: '2020/12/31',
        multiSelectable: false,
        onSelected: function(){}

    }
    
    U.fill(this, options)
    U.fill(this, defaults)
    
    this.date = new Date()

    if(this.multiSelectable){
        this.range = 0
    }
    
    this._init()
}

Datepicker.prototype = {

    constructor: Datepicker,
    
    _init: function(){
        var template =  '<div>' + 
                            '<input type="text"  id="dp-input">' + 
                        '</div>' + 
                        '<div class="dp-off" id="dp-panel">' + 
                            '<div id="dp-banner">' + 
                                '<button id="dp-prev-year" data-w="0 -1"><<</button>' +
                                '<button id="dp-prev-month" data-w="1 -1"><</button>' +
                                '<span id="dp-ym"></span>' + 
                                '<button id="dp-next-month" data-w="1 1">></button>' + 
                                '<button id="dp-next-year" data-w="0 1">>></button>' + 
                            '</div>' +
                            '<div id="dp-header">' + U.genHeader(['日','一','二','三','四','五','六'],'span') +
                            '</div>' +
                            '<div id="dp-main">' + 
                            '</div>' + 
                        '</div>'

        this.el.innerHTML = template

        this._render(this.date)

        this._bindAll()
    },
    
    _bindAll: function(){
        
        var self = this

        U.listen('#dp-banner', 'click', function(event){
            //选择了年月后，日期列表做相应切换

            var d = [self.date.getFullYear(), self.date.getMonth()],
                key = event.target.dataset.w.split(' ')


            if(event.target.nodeName.toLowerCase() == 'button'){

                d[key[0]] += parseInt(key[1])

                self.date = new Date(d[0], d[1])

                self._render(self.date)
            }
        })
        
        U.listen('#dp-main', 'click', function(event){
            //单击具体日期进行选择

            if(event.target.classList.contains('prev-month') || event.target.classList.contains('next-month') ){
                return
            }

            if(event.target.nodeName.toLowerCase() == 'span'){

                event.target.classList.add('dp-selected')

                self.date = new Date(self.date.getFullYear(), self.date.getMonth(), event.target.innerHTML)

                U.$('#dp-input').value = self.getDate()

                self.onSelected(self.date)

                U.$('#dp-panel').className = 'dp-off'              

            }
        })
        
        U.listen('#dp-input', 'focus', function(event){
            //点击输入框，浮出面板，再点隐藏，日期显示框中显示选取的日期

                U.$('#dp-panel').className = 'dp-on'

        })

        U.listen(document, 'click', function(event){
            //点击输入框，浮出面板，再点隐藏，日期显示框中显示选取的日期

            var target = event.target

            if(target.id !== 'dp-input' && !U.isParent(target, U.$('#dp-panel')) ){
    
                U.$('#dp-panel').className = 'dp-off'

            }

        })

    },
    
    _render: function(ymd){

        var y = ymd.getFullYear(),
            m = ymd.getMonth(),
            d = new Date(y, m)

        U.$('#dp-main').innerHTML = U.genDays(d)

        U.$('#dp-ym').innerHTML = y + '年' + (m<9?'0':'') + (m + 1) + '月'
    },
        
    getDate: function(){
 
        //提供获取日期的接口，获取日历面板中当前选中的日期，返回一个日期对象     
        return this.date.getFullDate()

    },
    
    setDate: function(val){

        //提供设定日期的接口，指定具体日期，日历面板相应日期选中
        this.date = val
        this._render(val)
    }
}