import MySqlPool from './MySqlPool';


export default class MySqlConnection {

    constructor(public pool: MySqlPool, public rawConnection: any) {
        this.pool = pool;
        this.rawConnection = rawConnection;
    }

    /**
     * 
     */
    query(ctx: any, sql: string, values: any[]) {
        return new Promise((resolve, reject) => {
            this.rawConnection.query(sql, values, (err: any, result: any) => {
                if (err) {
                    this.release();
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }


    async insert(ctx: any, tableName: string, valuesMapByColumns: any) {
        const columns = [];
        const values = [];
        for (let column in valuesMapByColumns) {
            columns.push(column);
            values.push(valuesMapByColumns[column]);
        }

        const sql = this.pool.sqlBuilder.insert(tableName, columns);

        const result: any = await this.query(ctx, sql, values);
        return result.insertId;
    }


    async update(ctx: any, tableName: string, valuesMapByColumns: any, conditionsMapByColumns: any) {
        const values = [];

        const valueColumns = [];
        for (let column in valuesMapByColumns) {
            valueColumns.push(column);
            values.push(valuesMapByColumns[column]);
        }

        const conditionColumns = [];
        for (let column in conditionsMapByColumns) {
            conditionColumns.push(column);
            values.push(conditionsMapByColumns[column]);
        }

        const sql = this.pool.sqlBuilder.update(tableName, conditionColumns, valueColumns);

        const result: any = await this.query(ctx, sql, values);
        return result.affectedRows;
    }


    release() {
        this.rawConnection.release();
    }

}
