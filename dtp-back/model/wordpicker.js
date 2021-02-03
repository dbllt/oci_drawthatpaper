const readline = require('readline');
const fs = require('fs');

class RandLine {
    constructor(filename, encoding="latin1") {
        this.filename = filename;
        this.encoding = encoding;
    }

    lines(cb, count=1) {
        let data = fs.readFileSync(this.filename, this.encoding);
        let ls = data.split('\r\n');
        while (count-- > 0) {
            cb(ls[Math.floor(Math.random() * ls.length)]);
        }
    }
}

module.exports = RandLine;
