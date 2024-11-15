export default interface PatchBoardRequestDto {
  boardTitle: string;
  boardCategory: string;
  boardTag: string;
  boardContents: string;
  youtubeVideoLink: string | null;
  boardFileContents: string[] | null;
}
