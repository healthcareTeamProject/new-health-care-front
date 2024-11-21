import { HealthSchedule } from "src/types";
import ResponseDto from "../response.dto";

export default interface GetHealthScheduleListResponseDto extends ResponseDto{
    healthSchedulelist: HealthSchedule[];
}