import { HealthSchedule } from "src/types";
import { create } from "zustand";

interface HealthScheduleStore {
    healthScheduleList: HealthSchedule[];
    setHealthScheduleList: (healthScheduleList: HealthSchedule[]) => void;
}

const useStore = create<HealthScheduleStore>(set => ({
    healthScheduleList: [],
    setHealthScheduleList: (healthScheduleList: HealthSchedule[]) => set(state => ({ ...state, healthScheduleList })),
}));

export default useStore;