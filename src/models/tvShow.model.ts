export class TvShowModel{
    title: string;
    episodes:any = [];

    constructor(title, episodes) {
        this.title = title;
        this.episodes = episodes;
    }
}