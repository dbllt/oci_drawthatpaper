const FgRed = "\x1b[31m"
const FgYellow = "\x1b[33m"
const FgNormal = "\x1b[0m"

const logWithColor = function (color, msg) {
    console.log(color, msg, FgNormal)
}

const log = {
    error: function (error) {
        if (process.env.NODE_ENV == 'development') {
            logWithColor(FgRed, "ERROR: " + error)
        }
    },
    debug: function (msg) {
        if (process.env.NODE_ENV == 'development') {
            logWithColor(FgYellow, "DEBUG: " + msg)
        }
    }
}

module.exports = log