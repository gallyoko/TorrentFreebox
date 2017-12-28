import { Injectable } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite';
import { OrmDatabase } from '../database/orm.database';
import { CategoryEntity } from '../database/entity/category.entity';
import { SubcategoryEntity } from '../database/entity/subcategory.entity';
import { BinaryEntity } from '../database/entity/binary.entity';
import 'rxjs/add/operator/map';

@Injectable()
export class DatabaseService extends OrmDatabase {
    private config: any = {
        name: 'newsgroup.db',
        location: 'default'
    };

    constructor(public sqlite: SQLite) {
        super(sqlite);
    }

    dropTableBdd() {
        return new Promise(resolve => {
            resolve(this.dropTableCategory().then(() => {
                return this.dropTableSubCategory().then(() => {
                    return this.dropTableBinary().then(() => {
                        return true;
                    });
                });
            }))
        });
    }

    createBdd() {
        return new Promise(resolve => {
            resolve(this.createNewsgroupDatabase().then(createBdd => {
                if (createBdd) {
                    return this.dropTableBdd().then(dropTable => {
                        if (dropTable) {
                            return this.createTableCategory().then(createTable => {
                                if (createTable) {
                                    return this.createTableSubCategory().then(createTable => {
                                        if (createTable) {
                                            return this.createTableBinary().then(createTable => {
                                                if (createTable) {
                                                    return this.insertTableBdd().then(insertTable => {
                                                        return insertTable;
                                                    });
                                                } else {
                                                    return false;
                                                }
                                            });
                                        } else {
                                            return false;
                                        }
                                    });
                                } else {
                                    return false;
                                }
                            });
                        } else {
                            return false;
                        }
                    });
                } else {
                    return false;
                }
            }))
        });
    }

    insertTableBdd() {
        return new Promise(resolve => {
            resolve(this.insertTableCategory().then(insert => {
                if (insert) {
                    return this.insertTableSubCategory().then(insert => {
                        return insert;
                    });
                } else {
                    return false;
                }
            }))
        });
    }

    openBdd() {
        return Promise.resolve(this.createDatabase(this.config));
    }

    createNewsgroupDatabase() {
        return Promise.resolve(this.createDatabase(this.config));
    }

    /** CATEGORY **/

    dropTableCategory() {
        return Promise.resolve(this.dropTable('category'));
    }

    createTableCategory() {
        const sql = 'CREATE TABLE IF NOT EXISTS category (' +
            '  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,' +
            '  name VARCHAR(255) NOT NULL)';
        return Promise.resolve(this.execSql(sql));
    }

    insertTableCategory() {
        const sql = 'INSERT INTO category (name) ' +
            'VALUES ( "series" ), ( "films" ), ( "musique" ), ' +
            '( "logiciels" ), ( "ebook" ), ( "jeux-pc" ), ( "jeux-consoles" );';
        return Promise.resolve(this.execSql(sql));
    }

    getCategories() {
        return new Promise(resolve => {
            this.findBy('category').then(dataset => {
                const brutDataset: any = dataset;
                const categories: any = [];
                for(let i = 0; i < brutDataset.length; i++) {
                    let category:any = new CategoryEntity(
                        brutDataset[i].id,
                        brutDataset[i].name
                    );
                    categories.push(category);
                }
                resolve(categories);
            });
        });
    }

    /** SUBCATEGORY **/

    dropTableSubCategory() {
        return Promise.resolve(this.dropTable('subcategory'));
    }

    createTableSubCategory() {
        return new Promise(resolve => {
            const sql = 'CREATE TABLE IF NOT EXISTS subcategory (' +
                '  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,' +
                '  name VARCHAR(255) NOT NULL,' +
                '  rss VARCHAR(255) NOT NULL,' +
                '  category_id INTEGER NOT NULL,' +
                '  FOREIGN KEY (category_id) REFERENCES category(id));';
            resolve(this.execSql(sql));
        });
    }

    insertTableSubCategory() {
        return new Promise(resolve => {
            const sql = 'INSERT INTO subcategory (name, rss, category_id) VALUES ' +
                '( "SD", "http://www.binnews.in/new_rss/cat-7.html", 1 ), ' +
                '( "HD", "http://www.binnews.in/new_rss/cat-44.html", 1 ), ' +
                '( "SD", "http://www.binnews.in/new_rss/cat-6.html", 2 ), ' +
                '( "HD", "http://www.binnews.in/new_rss/cat-39.html", 2 ), ' +
                '( "Anime SD", "http://www.binnews.in/new_rss/cat-27.html", 2 ), ' +
                '( "Anime HD", "http://www.binnews.in/new_rss/cat-49.html", 2 ), ' +
                '( "Mp3", "http://www.binnews.in/new_rss/cat-8.html", 3 ), ' +
                '( "Lossless", "http://www.binnews.in/new_rss/cat-51.html", 3 ), ' +
                '( "ISO", "http://www.binnews.in/new_rss/cat-3.html", 4 ), ' +
                '( "RIP", "http://www.binnews.in/new_rss/cat-5.html", 4 ), ' +
                '( "Tous", "http://www.binnews.in/new_rss/cat-25.html", 5 ), ' +
                '( "ISO", "http://www.binnews.in/new_rss/cat-20.html", 6 ), ' +
                '( "RIP", "http://www.binnews.in/new_rss/cat-21.html", 6 ), ' +
                '( "PSP", "http://www.binnews.in/new_rss/cat-33.html", 7 ), ' +
                '( "DS", "http://www.binnews.in/new_rss/cat-34.html", 7 ), ' +
                '( "Wii", "http://www.binnews.in/new_rss/cat-41.html", 7 );';
            resolve(this.execSql(sql));
        });
    }

    getSubCategoriesFromCategory(categoryId) {
        return new Promise(resolve => {
            const sql:any = 'SELECT * FROM subcategory where category_id='+categoryId+';';
            this.select(sql).then(dataset => {
                const brutDataset: any = dataset;
                const subcategories: any = [];
                for(let i = 0; i < brutDataset.length; i++) {
                    let subcategory:any = new SubcategoryEntity(
                        brutDataset[i].id,
                        brutDataset[i].name,
                        brutDataset[i].rss,
                        brutDataset[i].category_id
                    );
                    subcategories.push(subcategory);
                }
                resolve(subcategories);
            });
        });
    }

    /** BINARY **/

    dropTableBinary() {
        return Promise.resolve(this.dropTable('binary'));
    }

    createTableBinary() {
        const sql = 'CREATE TABLE IF NOT EXISTS binary (' +
            '  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,' +
            '  subcategory_id INTEGER NOT NULL,' +
            '  title VARCHAR(100) NOT NULL,' +
            '  link VARCHAR(255) NOT NULL,' +
            '  pubDate DATETIME NOT NULL,' +
            '  size VARCHAR(20) NOT NULL,' +
            '  langue VARCHAR(15) NOT NULL,' +
            '  resolution VARCHAR(20) NOT NULL,' +
            '  newsgroups VARCHAR(100) NOT NULL,' +
            '  filename VARCHAR(150) NOT NULL,' +
            '  FOREIGN KEY (subcategory_id) REFERENCES subcategory(id));';
        return Promise.resolve(this.execSql(sql));
    }

    insertTableBinary(subcategoryId, title, link, pubDate, size,
                      langue, resolution, newsgroups, filename) {
        return new Promise(resolve => {
            resolve(this.checkBeforeInsertTableBinary(subcategoryId, title, filename, pubDate).then((exist) => {
                if (!exist) {
                    const sql = 'INSERT INTO binary (subcategory_id, title, link, pubDate, size, '+
                        'langue, resolution, newsgroups, filename) VALUES ' +
                        '( '+subcategoryId+', "'+title+'", "'+link+'", "'+pubDate+'", "'+size+'", '+
                        '"'+langue+'", "'+resolution+'", "'+newsgroups+'", "'+filename+'");';
                    return this.execSql(sql);
                } else {
                    return false;
                }
            }));
        });
    }

    checkBeforeInsertTableBinary(subcategoryId, title, filename, pubDate) {
        return new Promise(resolve => {
            const sql = 'SELECT * FROM binary WHERE subcategory_id=' + subcategoryId +
                ' AND title="'+title+'" AND filename="'+filename+'" AND pubDate="'+pubDate+'";';
            this.select(sql).then(dataset => {
                const brutDataset: any = dataset;
                if (brutDataset.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    getBinaries() {
        return new Promise(resolve => {
            this.findBy('binary').then(dataset => {
                const brutDataset: any = dataset;
                const binaries: any = [];
                for(let i = 0; i < brutDataset.length; i++) {
                    let binary:any = new BinaryEntity(
                        brutDataset[i].id,
                        brutDataset[i].subcategory_id,
                        brutDataset[i].title,
                        brutDataset[i].link,
                        new Date(brutDataset[i].pubDate),
                        brutDataset[i].size,
                        brutDataset[i].langue,
                        brutDataset[i].resolution,
                        brutDataset[i].newsgroups,
                        brutDataset[i].filename,
                    );
                    binaries.push(binary);
                }
                resolve(binaries);
            });
        });
    }

    getBinariesByCategory(categoryId) {
        return new Promise(resolve => {
            const binaries: any = [];
            this.getSubCategoriesFromCategory(categoryId).then(subcategoryies => {
                let subcategories: any = subcategoryies;
                for(let j = 0; j < subcategories.length; j++) {
                    const sql = 'SELECT * FROM binary WHERE subcategory_id=' + subcategories[j].id +';';
                    this.select(sql).then(dataset => {
                        const brutDataset: any = dataset;
                        for(let i = 0; i < brutDataset.length; i++) {
                            let binary:any = new BinaryEntity(
                                brutDataset[i].id,
                                brutDataset[i].subcategory_id,
                                brutDataset[i].title,
                                brutDataset[i].link,
                                new Date(brutDataset[i].pubDate),
                                brutDataset[i].size,
                                brutDataset[i].langue,
                                brutDataset[i].resolution,
                                brutDataset[i].newsgroups,
                                brutDataset[i].filename,
                            );
                            binaries.push(binary);
                        }
                        if ((j+1) >= subcategories.length) {
                            resolve(binaries);
                        }
                    });
                }
            });
        });
    }

    /*insertTableBinary(subcategoryId, title, link) {
        return new Promise(resolve => {
            const sql = 'INSERT INTO binary (subcategory_id, title, link) VALUES ' +
                '( '+subcategoryId+', "'+title+'", "'+link+'" );';
            resolve(this.execSql(sql));
        });
    }*/

    getDataset(table) {
        return new Promise(resolve => {
            this.findBy(table).then(dataset => {
                const brutDataset: any = dataset;
                const categories: any = [];
                for(let i = 0; i < brutDataset.length; i++) {
                    let category:any = new CategoryEntity(
                        brutDataset[i].id,
                        brutDataset[i].name
                    );
                    categories.push(category);
                }
                resolve(categories);
            });
        });
    }
}

