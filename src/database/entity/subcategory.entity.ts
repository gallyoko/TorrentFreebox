export class SubcategoryEntity{
    id: number;
    name: string;
    rss: string;
    categoryId: number;

    constructor(id, name, rss, categoryId) {
        this.id = id;
        this.name = name;
        this.rss = rss;
        this.categoryId = categoryId;
    }
}