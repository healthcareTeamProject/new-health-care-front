export default interface PostHealthBoardRequestDto {
  boardTitle: string;
  boardCategory: string;
  boardTag: string;
  boardContents: string;
  youtubeVideoLink: string | null;
  boardFileContents: string[] | null;
  mapLat: string;
  mapLng: string;
}
