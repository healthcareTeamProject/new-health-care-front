export default interface PostBoardRequestDto {
    boardTitle: string;
    userId: string | undefined;
    boardCategory: string;
    boardTag: string;
    boardContents: string;
    youtubeVideoLink: string | null;
    boardFileContents: [] | null;
    lat: number;
    lng: number;
}