export default interface PatchBoardRequestDto {
  boardTitle: string;
  userId: string | undefined;
  boardCategory: string;
  boardTag: string;
  boardContents: string;
  youtubeVideoLink: string | null;
  boardFileContents: string[];
}
