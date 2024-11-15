export default interface PatchHealthBoardRequestDto {
    boardTitle: string;
    boardCategory: string;
    boardTag: string;
    boardContents: string;
    youtubeVideoLink: string | null;
    boardFileContents: string[] | null;
    mapLat: string;
    mapLng: string;
}
