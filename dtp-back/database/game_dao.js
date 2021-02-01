const connection = require('./db')

class TagsDao {
    static TABLE_NAME = "`tags`"
    static async getAll() {
        /*var ret
        const query = new Promise((resolve, reject) => {
            connection.query("SELECT * FROM " + this.TABLE_NAME + " ", function (err, result, fields) {
                if (err) reject("db", err);
                ret = result
                resolve()
            });
        })
        await query
        return ret*/
    }
}

class WordSetsDao {
    static TABLE_NAME = "`sets`"
    static async getAllFromTags(tagIds, amount) {
        /*var ret
        const query = new Promise((resolve, reject) => {
            connection.query("SELECT * FROM " + this.TABLE_NAME + " ", function (err, result, fields) {
                if (err) reject("db", err);
                ret = result
                resolve()
            });
        })
        await query
        return ret*/
    }
    static async getWords(setId) {
        /*var ret
        const query = new Promise((resolve, reject) => {
            connection.query("SELECT * FROM " + this.TABLE_NAME + " ", function (err, result, fields) {
                if (err) reject("db", err);
                ret = result
                resolve()
            });
        })
        await query
        return ret*/
    }
    static insert(name, creator, tags, words) {
        // id UNIQUE, name UNIQUE, word.length < 100
        /*let sql = "INSERT INTO " + this.TABLE_NAME + " (`id`, `name`, `tags`, `words`) VALUES (NULL, ?, ?, ?)"

        connection.query(sql, [name, tags, words], function (err, result) {
            if (err) throw err;
            log.debug("Set inserted")
        })*/
    }
}

module.exports.TagsDao = TagsDao
module.exports.WordSetsDao = WordSetsDao
