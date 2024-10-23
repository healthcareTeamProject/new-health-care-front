import ResponseDto from "../response.dto";

// interface: get nurse response body dto //
export default interface GetNurseResponseDto extends ResponseDto {
  userId: string;
  name: string;
  nickname: string;
  telNumber: string;
  profileImage: string;
  personalGoal: string;
  weight: number;
  height: number;
  skeletalMuscleMass: number;
  bodyFatMass: number;
  deadlift: number;
  benchPress: number;
  squat: number;
  userMuscleFatNumber: number;
  userMuscleFatDate: string;
  threeMajorLiftsNumber: number;
  threeMajorLiftsDate: string;
}
