export default interface PatchCommentRequestDto {
    userId: string;
    commentContents: string;
    commentLikeCount: number;
    commentDate: string;
}
