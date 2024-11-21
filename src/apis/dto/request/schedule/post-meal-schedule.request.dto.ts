import MealMemo from "src/types/meal-memo.interface";

// interface: post meal request body dto //
export default interface PostMealScheduleRequestDto{
    mealTitle: string;
    mealScheduleStart: string;
    mealScheduleEnd: string;
    mealMemo: MealMemo[];
}