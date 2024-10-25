import { Customer } from "src/types";
import { create } from "zustand";

interface CustomerStore{
    customer : Customer | null;
    setCustomer: (customer: Customer | null) => void;
}

const useStore = create<CustomerStore>((set)=>({
    customer: null,
    setCustomer:(customer: Customer| null) => {set((state) => ({...state, customer}))}
}))

export default useStore;