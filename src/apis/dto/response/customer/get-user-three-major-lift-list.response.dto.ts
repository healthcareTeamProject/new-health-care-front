import ResponseDto from "../response.dto";

// interface: get user three major lift list response body dto //
export default interface GetUserThreeMajorLiftListResponseDto extends ResponseDto {
    deadlift: string;
    benchPress: string;
    squat: string;
    userThreeMajorLiftDate: string;
}