import ResponseDto from "../response.dto";

export default interface GetMealResponseDto extends ResponseDto{
    mealKcal: number;
    mealName: string;
}