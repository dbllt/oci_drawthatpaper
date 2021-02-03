const readline = require('readline');
const fs = require('fs');

class RandLine {
    constructor(filename) {
        this.filename = filename;
        this.semaphore = 0;
    }

    lines(cb, count=1) {
        let self;
        self = this;

        let stats = fs.stat(self.filename, (err, stats) => {
            let chunk_range, options, stream;

            chunk_range = stats.size - 1024;
            options = {};
            if (chunk_range > 0) {
                options.start = Math.round(Math.random() * chunk_range);
                options.end = options.start + 1024;
            }
            stream = fs.createReadStream(self.filename, options);

            while (count-- > 0) {
                stream.on('data', function (d) {
                    let ar = d.toString().split(/\r?\n/);
                    //ar.splice(0, 1);
                    //ar.splice(ar.length - 1, 1);
                    stream.destroy();
                    self.semaphore--;
                    let word = ar[Math.round(Math.random() *  (ar.length - 1))];
                    typeof cb === "function" ? cb(word) : void 0;
                });
            }
        });
    }
}

let generator = new RandLine('wordbank/français.txt')

let callback = (word) => {
    if (word.length === 0) {
        //console.error("empty")
        generator.lines(callback);
        return ;
    }
    console.debug(word);
};
let i = 3;
while (i-- > 0) {
    generator.lines(callback)
}

module.exports = RandLine;
