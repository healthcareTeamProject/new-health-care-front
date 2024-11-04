// interface: patch customer request body dto //
export default interface PatchCustomerRequestDto {
  profileImage: string | null;
  name: string;
  nickname: string;
  height: string;
  personalGoal: string | null;
}
