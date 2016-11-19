function barrel(baseH){
    var container = document.querySelector('.container')
        images = container.querySelectorAll('img'),
        curW = 0,
        baseH = baseH || 100,
        baseW = container.clientWidth,
        diff = 0.1,
        stack = []

    for(var i = 0; i < images.length; i++){
        images[i].height = baseH
    }
    for(var i = 0; i < images.length; i++){
        var afterW = curW + images[i].width,
            remainW = baseW
        if(afterW / baseW > 1 - diff){
            var fixH = baseH * baseW / afterW
            stack.map(function(img){
                img.height = fixH;
                img.width = parseInt(img.width)
                remainW -= img.width
            })
            images[i].width = remainW; images[i].height = fixH
            stack = []; curW = 0
        }
        else if(afterW / baseW <= 1 - diff){
            stack.push(images[i]); curW = afterW
        }
    }
}

window.onload = function(){
    barrel()
}
