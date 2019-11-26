let browserSync = require('browser-sync')

browserSync.init({
    server: {
        baseDir: "./",
    },
    ui: {
        port: 8081,
        weinre: {
            port: 8082
        }
    },
    port: 8080
})
