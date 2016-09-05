require.config({
    baseUrl: './lib',
    paths: {
        'hammer': './hammer.min',
        'zepto': './zepto.min',
        'smooth': './smooth'
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
        dir: 'h',
        flow: true
    })

    app.anchor('#goo', '#s-1')

})