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
//throw new Error("TODO");
let generator = new RandLine('wordbank/français.txt');
currentWords = [];

let callback = (word) => {
    if (word.length < 2) {
        generator.lines(callback, 1);
        return ;
    }
    currentWords.push(word);
};
generator.lines(callback, 3);
console.log("", currentWords)
module.exports = RandLine;
