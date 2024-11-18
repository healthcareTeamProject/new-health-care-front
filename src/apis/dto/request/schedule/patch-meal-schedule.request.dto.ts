import MealMemo from "src/types/meal-memo.interface";

// interface: patch meal request body dto //
export default interface PatchMealScheduleRequestDto{
    mealTitle: string;
    mealScheduleStart: string;
    mealScheduleEnd: string;
    mealMemo: MealMemo[];
}