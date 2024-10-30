import ResponseDto from "../response.dto";

export default interface GetCustomerResposeDto extends ResponseDto{
    userId: string;
    name: string;
    nickname: string;
    profileImage: string;
    personalGoals: string;
}