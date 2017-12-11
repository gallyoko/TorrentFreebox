export class TorrentModel{
    title: string;
    size: string;
    url: string;
    seed: string;

    constructor(title, size, url, seed) {
        this.title = title;
        this.size = size;
        this.url = url;
        this.seed = seed;
    }
}