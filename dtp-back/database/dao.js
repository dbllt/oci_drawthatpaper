const connection = require('./db')
const log = require('../log')

class UsersDao {
    static TABLE_NAME = "`users`"
    static insert(user) {
        var sql = "INSERT INTO " + this.TABLE_NAME + " (`id`, `username`, `email`, `password`) VALUES (NULL, ?, ?, ?)"

        connection.query(sql, [user.username, user.email, user.password], function (err) {
            if (err) throw err;
            log.debug("user inserted")
        })
    }
    static async getAll() {
        var ret
        const query = new Promise((resolve, reject) => {
            connection.query("SELECT * FROM " + this.TABLE_NAME + " ", function (err, result) {
                if (err) reject("db", err);
                ret = result
                resolve()
            });
        })
        await query
        return ret
    }
    static async getOneByEmail(email) {
        var ret
        const query = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM " + this.TABLE_NAME + " AS t " +
                "WHERE t.email = ?" +
                "LIMIT 1"

            connection.query(sql, email, function (err, result) {
                if (err) reject("db", err);
                ret = result[0]
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
    static remove(tokenId) {
        var sql = "DELETE FROM " + this.TABLE_NAME + " AS t " +
            "WHERE t.id = ?"

        connection.query(sql, tokenId, function (err, result) {
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