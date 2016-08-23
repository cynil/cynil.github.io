fis.match('*.scss', {
    rExt: '.css',
    parser: fis.Plugin('node-sass', {})
})