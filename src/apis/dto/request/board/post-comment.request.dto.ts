export default interface PostCommentRequestDto {
    userId: string;
    commentContents: string;
    commentLikeCount: number;
    commentDate: string;
}
