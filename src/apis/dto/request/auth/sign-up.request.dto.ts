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
  weight: string;
  height: string;
  skeletalMuscleMass?: string | null;
  bodyFatMass?: string | null;
  deadlift?: string | null;
  benchPress?: string | null;
  squat?: string | null;
  profileImage?: string | null;
  personalGoal?: string | null;
}
