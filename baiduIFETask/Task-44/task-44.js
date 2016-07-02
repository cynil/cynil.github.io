function WaterFall(container, options){

    if(typeof container == 'string'){
        container = U.$(container)
    }

    options = options || {}

    var defaults = {
        columns: 6,
        dist: '10px',
    }

    U.fill(this, options)
    U.fill(this, defaults)

    /*
        .container{
            border: 1px solid;
            position: relative;
        }
    */
    this.container = container
    this.hArr = []
    this.$guid = 0

    this._init()
}

WaterFall.prototype = {

    _init: function(){

        var items = U.$$('img', this.container)

        for (var i = 0; i < items.length; i++) {

            this.addItem(items[i])

        }
    },

    addItem: function(div){

        var unitW = this.container.clientWidth / this.columns
        var wrap = document.createElement('div')

        /*
            .waterfall-wrap{
                box-sizing: border-box;
                display: inline-block;
                padding: this.dist;
                position: absolute;
            }
        */
        wrap.className = 'waterfall-wrap'
        wrap.guid = this.$guid++
        wrap.style.width = unitW + 'px'
        wrap.style.padding = this.dist
        wrap.appendChild(div)//param div...
        
        this.container.appendChild(wrap)

        if(wrap.guid < this.columns){

            wrap.style.left = unitW * wrap.guid + 'px'

            wrap.style.top = '0px'

            this.hArr.push(parseInt(getComputedStyle(wrap).height))

        }else if( wrap.guid >= this.columns){

            var minH = Math.min.apply(null, this.hArr)

            wrap.style.left = unitW * U.findKey(minH, this.hArr) + 'px'

            wrap.style.top = this.hArr[U.findKey(minH, this.hArr)] + 'px'
            
            this.hArr[U.findKey(minH, this.hArr)] += parseInt(getComputedStyle(wrap).height)

        }

        this.container.style.height = (Math.max.apply(null, this.hArr) + 2 * this.dist) + 'px'
        
    }
}