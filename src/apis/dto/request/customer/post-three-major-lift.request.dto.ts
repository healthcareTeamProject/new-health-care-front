// interface: 운동 정보 Request Body Dto //
export default interface PostThreeMajorLiftRequestDto {
    userId: string;
    deadlift?: string | null;
    benchPress?: string | null;
    squat?: string | null;
}