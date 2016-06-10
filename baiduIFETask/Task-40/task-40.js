(function(){

    function Calendar(options){

        var now = new Date();
        
        this.availDateRange = options.availDateRange || [[1993,6], [1993,11]];
        this.ym = (options.ym && new Date(options.ym[0], options.ym[1] - 1)) || new Date(now.getFullYear(), now.getMonth());
        this.selectedDate = null;
        this.dom = options.dom || document.body;
        this.init();
    }

    Calendar.prototype = {
        constructor: Calendar,

        init: function(){

            this.render(this.ym);
            
            //在这里添加事件侦听器            
            var that = this;
            this.wrap.addEventListener("click", function(){});
            this.ymPicker.addEventListener("change", function(event){

                var y = that.ymPicker.getElementsByTagName('select')[0].value;
                var m = that.ymPicker.getElementsByTagName('select')[1].value;

                that.ym = new Date(y, m - 1);

                that.renderBody(that.ym);
            });

            this.datePicker.addEventListener("click", function(event){
                var target = event.target;

                if(target.nodeName.toLowerCase() === "span" && target.className.indexOf("current") > -1){
                    if(that.selectedDate){
                        that.selectedDate.className = that.selectedDate.className.replace(/\sselected/g, '');
                    }

                    //如果两次点的是同一个日期，则取消选择，否则，切换选择
                    if(target != that.selectedDate){
                        that.selectedDate = target;
                        that.selectedDate.className += " selected";
                    }else if(target == that.selectedDate){
                        that.selectedDate = null;
                    }
                }
            });
            this.ymPicker.getElementsByTagName("button")[0].addEventListener("click", function(event){

                that.ym = new Date(that.ym.getFullYear(), that.ym.getMonth() - 1);
                that.renderBody(that.ym);
            });

            this.ymPicker.getElementsByTagName("button")[1].addEventListener("click", function(event){
                that.ym = new Date(that.ym.getFullYear(), that.ym.getMonth() + 1);
                that.renderBody(that.ym);
            });
        },

        getDate: function(){
            if(!this.selectedDate) {
                alert('还没有选择日期');
                return '';
            };
            return this.ym.getFullYear() + "-" + (this.ym.getMonth() + 1) + "-" + this.selectedDate.innerHTML;
        },

        setDate: function(when){
            this.ym = new Date(when.getFullYear(), when.getMonth());
            this.renderBody(this.ym);

            var that = this;

            if(this.selectedDate){
                this.selectedDate.className = this.selectedDate.className.replace(/\sselected/g, '');
            }
            
            this.selectedDate = (function(){
                var span,
                    spans = that.datePicker.getElementsByTagName('span');
                for (var i = 0; i < spans.length; i++) {
                    if(spans[i].innerHTML == when.getDate() && spans[i].className.indexOf('current') > -1){
                        span = spans[i];
                    }
                }
                console.log(span);
                return span;
            })();

            this.selectedDate.className += " selected";
        },

        buildTpl: function(){
            if(!document.getElementById('my-calendar')){
                this.wrap = document.createElement('div');
                this.wrap.id = 'my-calendar';

                this.wrap.innerHTML =   '<div id="ym-picker">' + 
                                            '<button id="prev-year">《</button>' +
                                            '<button id="prev">&lt;</button>' +
                                            '<select name="y" id="y"></select>' +
                                            '<select name="m" id="m"></select>' +
                                            '<button id="next">&gt;</button>' +
                                            '<button id="next-year">》</button>' +
                                        '</div>' + 
                                        '<div id="week">' + genDOMFromArray(['日','一','二','三','四','五','六'],'span') +
                                        '</div>' +
                                        '<div id="date-picker">' + 
                                        '</div>';
                this.dom.appendChild(this.wrap);

                this.ymPicker = document.getElementById('ym-picker');
                this.datePicker = document.getElementById('date-picker');
            }
        },

        renderHead: function(){
            var arrY = [],
                arrM = [],
                yearRange = this.availDateRange[1][0] - this.availDateRange[0][0];
            for (var i = 0; i <= yearRange; i++) {
                var y = (this.availDateRange[0][0] + i) == this.ym.getFullYear() ? 'selected="selected"':'';
                arrY[i] = "<option " + y + ">" + (this.availDateRange[0][0] + i) + "</option>";
            }

            for (var i = 0; i < 12; i++) {
                var m = i == this.ym.getMonth() ? 'selected="selected"':'';
                arrM[i] = "<option " + m + ">" + (i + 1) + "</option>";
            }
            this.ymPicker.getElementsByTagName('select')[0].innerHTML = arrY.join('');
            this.ymPicker.getElementsByTagName('select')[1].innerHTML = arrM.join('');

        },

        renderBody: function(){
            this.datePicker.innerHTML = genDayArr(this.ym);
        },

        render: function(ym){

            this.buildTpl();
            this.renderHead();
            this.renderBody();
        }
    }

// private functions
    function genDayArr(ym){
        var cls,

            _DAYS = 42,

            //保存输出的数组
            dayArr = [],

            //当前月份的第一天是星期几？
            start = ym.getDay(),

            //日历主面板的第一个格子应该是哪个日子？
            date0 = new Date(ym.getFullYear(), ym.getMonth(), 1-start).getTime(),

            //当前月份的最后一天
            ym31 = new Date(ym.getFullYear(), ym.getMonth() + 1, 0);

        for(var i=0;i< _DAYS;i++){

            //判断当前日子的类型，是否需要加特殊类名
            var cur = new Date(date0+24*60*60000*i);

            cls = "current";

            if (cur.getTime() < ym.getTime()){
                cls = "prev-month";
            }else if(cur.getTime() > ym31.getTime()){
                cls = "next-month";
            };

            if(cur.getFullDate() == new Date().getFullDate()){
                cls += " today";
            }

            dayArr[i] = '<span class="' + cls + '">' + cur.getDate() + '</span>';
        }
        return dayArr.join('');
    }

    function genDOMFromArray(arr, wrap){

        return arr.map(function(v, i, arr){
            return '<' + wrap + '>' + v + '</' + wrap + '>';
        }).reduce(function(pre, cur, i, arr){
            return pre + cur;
        });

    }
    Date.prototype.getFullDate = Date.prototype.getFullDate || function(){
        return ([this.getFullYear(),this.getMonth(),this.getDate()]).join('');
    }
,    
    window.Calendar = Calendar;
})();