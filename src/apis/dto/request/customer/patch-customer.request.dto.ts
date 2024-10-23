// interface: patch customer request body dto //
export default interface PatchCustomerRequestDto {
  name: string;
  nickname: string;
  profileImage: string | null;
  personalGoal: string | null;
  weight: number;
  height: number;
  skeletalMuscleMass: number | null;
  bodyFatMass: number | null;
  deadlift: number | null;
  benchPress: number | null;
  squat: number | null;
}
