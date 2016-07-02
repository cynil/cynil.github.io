U.loadImages = function(howMany){

    var color = ['E97452', 'EF3C6B', '297385', '5A5751', 'F7574A']

    for (var i = 0; i < howMany; i++) {

        var img = new Image()

        //http://placehold.it/300x600/E97452/fff
        img.src = 'http://placehold.it/' + (Math.random() * 240 + 100) + 'x' + (Math.random() * 240 + 100) + '/' + color[i % 5] + '/fff'

        img.onload = function(){

            var wrap = document.createElement('div')
            wrap.className = 'wrap'
            wrap.appendChild(this)
            U.$('.container').appendChild(wrap)
        }
    }
}

window.onload = function(){

    U.loadImages(30)

}

function waterFall(container, options){
    var defaults = {
        baseW: container.clientWidth,
        columns: 6,
    }

    U.fill(options, defaults)
    
    var images = U.$$('.wrap', container),
        hArr = [],
        unitW = options.baseW / options.columns

    images = [].slice.call(images)

    images.forEach(function(v, i, arr){
        v.style.width = unitW + 'px'
    })

    for(var i = 0; i < images.length; i++){

        if(i < options.columns){

            images[i].style.left = unitW * i + 'px'

            images[i].style.top = '0px'

            hArr.push(parseInt(getComputedStyle(images[i]).height))

        }else if( i >= options.columns){

            var minH = Math.min.apply(null, hArr)

            images[i].style.left = unitW * U.findKey(minH, hArr) + 'px'

            images[i].style.top = hArr[U.findKey(minH, hArr)] + 'px'
            
            hArr[U.findKey(minH, hArr)] += parseInt(getComputedStyle(images[i]).height)
        }
    }
}