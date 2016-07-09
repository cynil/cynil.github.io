window.onload = function(){
    var images = U.$$('img', U.$('.container')),
        curWidth = 0,
        baseH = 200,//baseH,
        baseW = U.$('.container').clientWidth,
        diff = 0.1,
        stack = []

    for(var i = 0; i < images.length; i++){
        images[i].height = baseH
    }

    for(var i = 0; i < images.length; i++){

        stack.push(images[i])
        curWidth += images[i].width

        if(curWidth >= (1 - diff) * baseW){

            console.log(curWidth / baseW)

            stack.forEach(function(v, i, arr){
        
            var justifiedH = baseW / curWidth * v.height

                v.height = justifiedH

                v.style.visibility = 'visible'

            })

            stack[stack.length - 1].width += baseW - w(stack)

            stack = []; curWidth = 0
        }
    }
}

function w(stack){

    var len = 0

    for (var i = 0; i < stack.length; i++) {

        len += stack[i].width

    }

    return len
}