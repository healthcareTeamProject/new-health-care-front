import { HealthSchedule } from "src/types";
import { create } from "zustand";

interface ScheduleStore {
    healthScheduleList: HealthSchedule[];
    setHealthScheduleList: (healthScheduleList: HealthSchedule[]) => void;
}

const useStore = create<ScheduleStore>(set => ({
    healthScheduleList: [],
    setHealthScheduleList: (healthScheduleList: HealthSchedule[]) => set(state => ({ ...state, healthScheduleList })),
}));

export default useStore;