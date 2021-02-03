const readline = require('readline');
const fs = require('fs');

class RandLine {
    constructor(filename) {
        this.filename = filename;
        this.semaphore = 0;
    }

    lines(cb, count=1) {
        let data = fs.readFileSync(this.filename, "utf8");
        let ls = data.split('\r\n');
        while (count-- > 0) {
            cb(ls[Math.floor(Math.random() * ls.length)]);
        }
    }
}

module.exports = RandLine;
