import ResponseDto from "../response.dto";

// interface: get comment response body dto //
export default interface GetCommentResponseDto extends ResponseDto {
    commentsNumber: number;
    userId: string;
    commentContents: string;
    commentLikeCount: number;
    commentDate: string;
}