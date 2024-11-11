import ResponseDto from "../response.dto";

export default interface GetHealthScheduleResponseDto extends ResponseDto{
    healthScheduleNumber: number;
    healthTitle: string;
    healthScheduleStart: string;
    healthScheduleEnd: string;
}