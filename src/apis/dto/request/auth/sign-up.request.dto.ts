// interface: 회원가입 Request Body Dto //
export default interface SignUpRequestDto {
  name: string;
  nickname: string;
  userId: string;
  password: string;
  telNumber: string;
  authNumber: string;
  joinPath: string;
  snsId?: string | null;
  weight: number;
  height: number;
  skeletalMuscleMass?: number | null;
  bodyFatMass?: number | null;
  deadlift?: number | null;
  benchPress?: number | null;
  squat?: number | null;
  profileImage?: string | null;
  personalGoal?: string | null;
}
