export default interface Customer {
  profilImage: string | null;
    name: string;
    userId: String;
    nickname: string;
    height: number ;
    weight: number;
    skeletalMuscleMass: number | null;
    bodyFatMass : number | null;
    deadlift: number | null;
    benchPress : number | null;
    squat: number | null;
    personalGoal : number | null;
}
