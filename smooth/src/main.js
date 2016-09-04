require.config({
    paths: {
        'hammer': '../bower_components/hammerjs/hammer.min',
        'zepto': '../bower_components/zepto/zepto.min',
        'smooth': '../lib/smooth'
    },
    shim: {
        'zepto': {
            exports: 'Zepto'
        }
    }
})

require(['smooth'], function(Smooth){

    var smooth = document.querySelector('.ppt')
    
    var app = new Smooth(smooth, {
        rollback: false,
        dir: 'v',
        flow: '#go' //forward only
    })

    app.anchor('#goo', '#s-1')

})
/**
 * next stage prev stage
 * next bloc prev bloc
 * certain stage
 */