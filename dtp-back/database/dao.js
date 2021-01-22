const connection = require('./db')
const log = require('../log')

class UsersDao {
    static TABLE_NAME = "`users`"
    static insert(user) {
        var sql = "INSERT INTO " + this.TABLE_NAME + " (`id`, `username`, `email`, `password`) VALUES (NULL, ?, ?, ?)"

        connection.query(sql, [user.username, user.email, user.password], function (err, result) {
            if (err) throw err;
            log.debug("user inserted")
        })
    }
    static async getAll() {
        var ret
        const query = new Promise((resolve, reject) => {
            connection.query("SELECT * FROM " + this.TABLE_NAME + " ", function (err, result, fields) {
                if (err) reject("db", err);
                ret = result
                resolve()
            });
        })
        await query
        return ret
    }
}

class RefreshTokensDao {
    static TABLE_NAME = "`refreshtokens`"
    static insert(token) {
        var sql = "INSERT INTO " + this.TABLE_NAME + " (`id`, `tokenValue`) VALUES (NULL, ?)"

        connection.query(sql, token, function (err, result) {
            if (err) throw err;
        })
    }
    static async getAll() {
        var ret
        const query = new Promise((resolve, reject) => {
            connection.query("SELECT * FROM " + this.TABLE_NAME + " ", function (err, result, fields) {
                if (err) reject("db", err);
                ret = result
                resolve()
            });
        })
        await query
        return ret
    }
}

module.exports.UsersDao = UsersDao
module.exports.RefreshTokensDao = RefreshTokensDao