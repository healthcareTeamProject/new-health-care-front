import MealMemo from "src/types/meal-memo.interface";
import ResponseDto from "../response.dto";

export default interface GetMealMemoListResponseDto extends ResponseDto{
    mealMemoList: MealMemo[]
}