// interface: 신체 정보 Request Body Dto //
export default interface PatchUserMuscleFatRequestDto {
    userId: string;
    weight: string;
    skeletalMuscleMass: string;
    bodyFatMass: string;
}