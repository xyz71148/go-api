module.exports = [require.resolve('./.webpack.config.js'), {
    devServer: config => {
        config.proxy = {
            "/api": {
                target: "http://127.0.0.1:10080",
                changeOrigin: true,
            },

        }
        return config
    }
},]