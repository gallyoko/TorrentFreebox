export class BinaryEntity{
    id: number;
    subcategoryId: number;
    title: string;
    link: string;
    pubDate: Date;
    size: string;
    langue: string;
    resolution: string;
    newsgroups: string;
    filename: string;

    constructor(id, subcategoryId, title, link, pubDate, size,
                langue, resolution, newsgroups, filename) {
        this.id = id;
        this.subcategoryId = subcategoryId;
        this.title = title;
        this.link = link;
        this.pubDate = pubDate;
        this.size = size;
        this.langue = langue;
        this.resolution = resolution;
        this.newsgroups = newsgroups;
        this.filename = filename;
    }
}