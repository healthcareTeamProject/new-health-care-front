export default interface PostHealthBoardRequestDto {
  boardTitle: string;
  userId: string | undefined;
  boardCategory: string;
  boardTag: string;
  boardContents: string;
  youtubeVideoLink: string | null;
  boardFileContents: string[] | null;
  mapLat: number;
  mapLng: number;
}
