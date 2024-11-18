import MealMemo from "src/types/meal-memo.interface";
import ResponseDto from "../response.dto";

export default interface GetMealScheduleResponseDto extends ResponseDto{
    mealScheduleNumber: number;
    mealTitle: string;
    mealScheduleStart: string;
    mealScheduleEnd: string;
    mealMemo: MealMemo[];
}