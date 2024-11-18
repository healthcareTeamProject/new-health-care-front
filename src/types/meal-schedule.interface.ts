import MealMemo from "./meal-memo.interface";

export default interface MealSchedule{
    mealScheduleNumber: number;
    mealTitle: string;
    mealScheduleStart: string;
    mealScheduleEnd: string;
    mealMemo: MealMemo[];
}