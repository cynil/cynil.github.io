function WaterFall(container, options){
    options = options || {}
    var defaults = {
        columns: 6,
        dist: 10,
    }
    U.fill(this, options)
    U.fill(this, defaults)
    this.$container = container
    this.hArr = []
    this.$guid = 0
    this.unitW = this.$container.offsetWidth / this.columns
    this._init()
}
WaterFall.prototype = {
    _init: function(){
        //处理已有的子元素
        var html = this.$container.innerHTML
        this.$container.innerHTML = ''
        var tmp = document.createElement('div')
        tmp.innerHTML = html
        for(var i = 0; i < tmp.children.length; i++){
            this.addItem(tmp.children[i].cloneNode(true))
        }
        //创建遮罩层
        this.$mask = document.createElement('div')
        this.$mask.className = 'waterfall-mask'
        document.body.appendChild(this.$mask)
        this._bindAll()
    },
    _bindAll: function(){
        var self = this
        U.listen(this.$container, 'click', function(event){
            //classList.contains('waterfall-wrap')
            if(event.target.nodeName.toLowerCase() == 'img'){
                self._show(event.target)
            }
        })
        U.listen(this.$mask, 'click', function(event){
            if(event.target == this){
                this.style.display = 'none'
                document.body.removeChild(U.$('.waterfall-large-image'))
            }
        })
    },
    _show: function(target){
        this.$mask.style.display = 'block'
        var node = event.target.cloneNode()
        node.className = 'waterfall-large-image'
        document.body.appendChild(node)
    },
    _settleDOM: function(wrap){
        if(wrap.guid < this.columns){
            wrap.style.left = this.unitW * wrap.guid + 'px'
            wrap.style.top = '0px'
            this.hArr.push(parseInt(getComputedStyle(wrap).height))
        }else if( wrap.guid >= this.columns){
            var minH = Math.min.apply(null, this.hArr)
            wrap.style.left = this.unitW * U.findKey(minH, this.hArr) + 'px'
            wrap.style.top = this.hArr[U.findKey(minH, this.hArr)] + 'px'
            this.hArr[U.findKey(minH, this.hArr)] += parseInt(getComputedStyle(wrap).height)
        }
        this.$container.style.height = (Math.max.apply(null, this.hArr) + 2 * this.dist) + 'px'        
    },
    addItem: function(div){
        var wrap = document.createElement('div')
        wrap.className = 'waterfall-wrap'
        wrap.guid = this.$guid++
        wrap.style.width = this.unitW + 'px'
        wrap.style.padding = this.dist + 'px'
        wrap.appendChild(div)
        this.$container.appendChild(wrap)
        this._settleDOM(wrap)
    }
}
window.onload = function(){
    var wf = new WaterFall(U.$('.container'), {
        columns: 4,
        dist: 5
    })
    function addImage(src){
        var img = new Image()
        img.src = src
        var template = 	U.liveHTML('<div class="pic">' + 
                            '<img src="" />' +
                            '<br/>' + 
                            '<p class="title">this is a title</p>' +
                        '</div>')
        img.onload = function(){
            template.firstChild.src = img.src
            wf.addItem(template)
        }
    }
    function loadExtraImages(howMany){
        var color = ['E97452', 'EF3C6B', '297385', '5A5751', 'F7574A']
        for (var i = 0; i < howMany; i++) {
            //http://placehold.it/300x600/E97452/fff
            var w = parseInt(Math.random() * 100 + 200),
                h = parseInt(Math.random() * 100 + 200)
            addImage('http://placehold.it/' + w + 'x' + h + '/' + color[i % 5] + '/fff')
        }
    }
    window.onscroll = debounce(function(e){
        var winH = window.innerHeight
            bodyH = document.body.offsetHeight,
            bodyTop = document.body.scrollTop
        console.log(bodyH, bodyTop, winH)
        if(bodyH - bodyTop - winH < 50){
            loadExtraImages(3)
        }
    })
}
function debounce(fn, delay){
    var timer
    return function(){
        var slef = this, args = arguments
        if(timer) clearTimeout(timer)
        timer = setTimeout(function(){
            fn.apply(self, args)
        }, delay || 600)
    }
}