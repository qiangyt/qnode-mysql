import * as Mysql from 'mysql';
import MySqlConnection from './MySqlConnection';
import SqlBuilder from './SqlBuilder';


export default class MySqlPool {

    public sqlBuilder: SqlBuilder;
    public pool: Mysql.IPool;

    private _beans: any;
    private _config: any;

    /**
     * 
     */
    init() {
        this.sqlBuilder = this._beans.get('SqlBuilder');
        const mysql = this._config.database;

        if (!mysql.user) throw new Error('<database.user> is not configured');
        if (undefined === mysql.password) throw new Error('<database.password> is not configured');
        if (!mysql.database) throw new Error('<database.database> is not configured');

        const opts = {
            host: mysql.host ? mysql.host : 'localhost',
            port: mysql.port ? mysql.port : 3306,
            user: mysql.user,
            password: mysql.password,
            database: mysql.database,
            charset: mysql.charset ? mysql.charset : 'UTF8MB4_GENERAL_CI',
            connectTimeout: mysql.connectTimeout ? mysql.connectTimeout : (10 * 1000)
        };
        this.pool = Mysql.createPool(opts);
    }


    get(ctx: any) {
        const me = this;

        return new Promise(function (resolve, reject) {
            me.pool.getConnection(function (err, conn) {
                if (err) reject(err);
                else resolve(new MySqlConnection(me, conn));
            });
        });
    }

}
