export class NzbModel{
    title: string;
    sizeFile: string;
    sizeElement: string;
    url: string;
    pubDate: Date;

    constructor(title, sizeFile, sizeElement, url, pubDate) {
        this.title = title;
        this.sizeFile = sizeFile;
        this.sizeElement = sizeElement;
        this.url = url;
        this.pubDate = pubDate;
    }
}