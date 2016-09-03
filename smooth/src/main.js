require.config({
    paths: {
        'hammer': '../bower_components/hammerjs/hammer.min',
        'zepto': '../bower_components/zepto/zepto.min',
        'ppt': '../lib/ppt'
    },
    shim: {
        'zepto': {
            exports: 'Zepto'
        }
    }
})

require(['ppt'], function(PPT){

    var ppt = document.querySelector('.ppt')
    var app = new PPT(ppt, {
        rollback: false, 
        stageControl: 'h',//'v',''
        flow: '#back tap' //forward only
    })

    app.anchor('#gohome', 'swipe', '#s-1')

})
/**
 * next stage prev stage
 * next bloc prev bloc
 * certain stage
 */