export class DownloadModel{
    id: number;
    title: string;
    sizeByte: number;
    sizeMo: string;
    position: number;
    status: string;
    icon: string;
    byteDownloaded: number;
    remainingTime: string;
    progress: number;
    speed: string;

    constructor(id, title, sizeByte, sizeMo, position, status, icon,
                byteDownloaded, remainingTime, progress, speed) {
        this.id = id;
        this.title = title;
        this.sizeByte = sizeByte;
        this.sizeMo = sizeMo;
        this.position = position;
        this.status = status;
        this.icon = icon;
        this.byteDownloaded = byteDownloaded;
        this.remainingTime = remainingTime;
        this.progress = progress;
        this.speed = speed;
    }
}