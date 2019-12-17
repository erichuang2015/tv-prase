const webpack = require('webpack')
module.exports = {
    publicPath: './',
    assetsDir: 'static',
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery"
            })
        ]
    }
}