// interface: 회원가입 Request Body Dto //
export default interface SignUpRequestDto {
  name: string;
  userId: string;
  nickname: string;
  password: string;
  telNumber: string;
  authNumber: string;
  joinPath: string;
  snsId?: string | null;
  height: string;
  profileImage?: string | null;
  personalGoals?: string | null;
}
