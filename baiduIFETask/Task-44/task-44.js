function WaterFall(container, options){

    if(typeof container == 'string'){
        container = U.$(container)
    }

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
        //一般前面加$表示一个变量是DOM元素

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
        wrap.appendChild(div)//param div...
        
        this.$container.appendChild(wrap)

        this._settleDOM(wrap)
    }
}