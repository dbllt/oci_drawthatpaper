const log = {
    error: function (error) {
        if (process.env.NODE_ENV == 'development') {
            console.log('%c [ERROR] ' + error + '', 'color: red');
        }
    },
    debug: function (msg) {
        if (process.env.NODE_ENV == 'development') {
            console.log('%c [DEBUG]', 'color: yellow', msg);
        }
    }
}

module.exports = log