import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

export class OrmDatabase{
    public database: SQLiteObject;

    constructor(public sqlite: SQLite) {}

    createDatabase(config) {
        return this.sqlite.create(config)
            .then((db: SQLiteObject) => {
                //console.log('SUCCESS : sqlite.create');
                this.database = db;
                return true;
            })
            .catch(e => {
                console.log('ERROR : sqlite.create => ' + e.message);
                return false;
            });
    }

    dropTable(table) {
        return this.database.executeSql('DROP TABLE '+table+'', {})
            .then(() => {
                //console.log('SUCCESS : DROP TABLE '+table);
                return true;
            })
            .catch(e => {
                console.log('ERROR : DROP TABLE '+table + ' => ' + e.message);
                return false;
            });
    }

    execSql(sql) {
        return this.database.executeSql(sql, {})
            .then(() => {
                //console.log('SUCCESS : executeSql');
                return true;
            })
            .catch(e => {
                console.log('ERROR : executeSql => ' + e.message);
                return false;
            });
    }

    findBy(table) {
        return new Promise(resolve => {
            const sql = 'SELECT * FROM '+table+';';
            resolve( this.database.executeSql(sql, {})
                .then((dataset) => {
                    const result: any = [];
                    if(dataset.rows.length > 0) {
                        for(let i = 0; i < dataset.rows.length; i++) {
                            result.push(dataset.rows.item(i));
                        }
                    }
                    return result;
                })
                .catch(e => {
                    console.log('ERROR : findBy '+table+' => ' + e.message);
                    return false;
                }))
        });

    }

    select(sql) {
        return new Promise(resolve => {
            resolve( this.database.executeSql(sql, {})
                .then((dataset) => {
                    const result: any = [];
                    if(dataset.rows.length > 0) {
                        for(let i = 0; i < dataset.rows.length; i++) {
                            result.push(dataset.rows.item(i));
                        }
                    }
                    return result;
                })
                .catch(e => {
                    console.log('ERROR : select => ' + e.message);
                    return false;
                }))
        });

    }
}