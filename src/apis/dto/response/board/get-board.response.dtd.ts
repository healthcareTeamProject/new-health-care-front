import ResponseDto from "../response.dto";

// interface: get board response body dto //
export default interface GetBoardResponseDto extends ResponseDto {
  boardNumber: string;
  boardTitle: string;
  userId: string;
  boardUploadDate: string;
  boardContents: string;
  youtubeVideoLink: string;
  boardFileContents: string;
  boardViewCount: number;
  boardLikeCount: number;
  comments: string;
}
