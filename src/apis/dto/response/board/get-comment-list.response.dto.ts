import { Comment } from "src/types";
import ResponseDto from "../response.dto";

// interface: get comment list response body Dto //
export default interface GetCommentListResponseDto extends ResponseDto {
    commentList: Comment[]
}