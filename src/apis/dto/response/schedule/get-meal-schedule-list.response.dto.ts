import MealSchedule from "src/types/meal-schedule.interface";
import ResponseDto from "../response.dto";

export default interface GetMealScheduleListResponseDto extends ResponseDto{
    mealSchedulelist: MealSchedule[];
}