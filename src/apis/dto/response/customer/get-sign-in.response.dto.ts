import ResponseDto from "../response.dto";

// interface: get nurse response body dto //
export default interface GetSignInResponseDto extends ResponseDto {
  userId: string;
  name: string;
  nickname: string;
  profileImage: string;
  personalGoals: string;
}
