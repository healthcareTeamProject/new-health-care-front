import MealSchedule from "src/types/meal-schedule.interface";
import { create } from "zustand";

interface MealScheduleStore{
    mealScheduleList: MealSchedule[];
    setMealScheduleList: (mealScheduleList: MealSchedule[]) => void;
}

const useStore = create<MealScheduleStore>(set => ({
    mealScheduleList: [],
    setMealScheduleList: (mealScheduleList: MealSchedule[]) => set(state => ({ ...state, mealScheduleList})),
}));

export default useStore;