import ResponseDto from "../response.dto";

export default interface GetHealthScheduleResponseDto extends ResponseDto{
    healthScheduleNumber: number;
    userId: string;
    healthTitle: string;
    healthScheduleStart: string;
    healthScheduleEnd: string;
}