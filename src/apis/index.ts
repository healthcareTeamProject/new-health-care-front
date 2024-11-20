import axios, { AxiosResponse } from "axios";
import { ResponseDto } from "./dto/response";
import { IdCheckRequestDto, SignInRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./dto/request/auth";
import NicknameCheckRequestDto from "./dto/request/auth/nickname-check.request.dto";
import { ACCESS_TOKEN } from "src/constant";
import { SignInResponseDto } from "./dto/response/auth";
import { GetCustomerMyPageResponseDto, GetSignInResponseDto, GetUserMuscleFatListResponseDto, GetUserThreeMajorLiftListResponseDto } from "./dto/response/customer";
import { PatchCustomerRequestDto, PatchUserMuscleFatRequestDto, PostThreeMajorLiftRequestDto, PostUserMuscleFatRequestDto } from "./dto/request/customer";
import GetCustomerResposeDto from "./dto/response/customer/get-customer.response.dto";

import { PatchCommentRequestDto, PostBoardRequestDto, PostCommentRequestDto } from "./dto/request/board";

import PostHealthScheduleRequestDto from "./dto/request/schedule/post-health-schedule.request.dto";
import { GetHealthScheduleListResponseDto, GetHealthScheduleResponseDto, GetMealResponseDto, GetMealScheduleListResponseDto, GetMealScheduleResponseDto } from "./dto/response/schedule";

import { GetBoardListResponseDto, GetBoardResponseDto } from "./dto/response/board";
import PatchUserThreeMajorLiftRequestDto from "./dto/request/customer/patch-user-three-major-lift.request.dto";

import GetCommentListResponseDto from "./dto/response/board/get-comment.response.dto";
import GetCommentResponseDto from "./dto/response/board/get-comment.response.dto";
import { PatchHealthScheduleRequestDto, PatchMealScheduleRequestDto, PostMealScheduleRequestDto } from "./dto/request/schedule";
import GetBoardUserResponseDto from "./dto/response/board/get-board-user.response.dto";


// variable: API URL 상수 //
const HEALTHCARE_API_DOMAIN = `http://localhost:4000`;

const AUTH_MODULE_URL = `${HEALTHCARE_API_DOMAIN}/api/v1/auth`;

const ID_CHECK_API_URL = `${AUTH_MODULE_URL}/id-check`;
const NICKNAME_CHECK_API_URL = `${AUTH_MODULE_URL}/nickname-check`;
const TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/tel-auth`;
const TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/tel-auth-check`;
const SIGN_UP_API_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;

const CUSTOMER_MODULE_URL = `${HEALTHCARE_API_DOMAIN}/api/v1/customer`;

const GET_SIGN_IN_API_URL = `${CUSTOMER_MODULE_URL}/sign-in`;
const GET_CUSTOMER_API_URL = (userId: string) => `${CUSTOMER_MODULE_URL}/${userId}`;
const GET_USER_MUSCLE_FAT_LIST_URL = (userId: string) => `${CUSTOMER_MODULE_URL}/${userId}/user-muscle-fat-list`
const GET_USER_THREE_MAJOR_LIFT_LIST_URL = (userId: string) => `${CUSTOMER_MODULE_URL}/${userId}/user-three-major-lift-list`

const PATCH_CUSTOMER_URL = `${CUSTOMER_MODULE_URL}`
const PATCH_USER_MUSCLE_FAT_URL = (userId: string) => `${CUSTOMER_MODULE_URL}/${userId}/user-muscle-fat`
const PATCH_USER_THREE_MAJOR_LIFT_URL = (userId: string) => `${CUSTOMER_MODULE_URL}/${userId}/user-three-major-lift`

const BOARD_MODULE_URL = `${HEALTHCARE_API_DOMAIN}/api/v1/board`;

const POST_BOARD_API_URL = `${BOARD_MODULE_URL}`;
const DELETE_BOARD_API_URL = (boardNumber: number | string) => `${BOARD_MODULE_URL}/${boardNumber}`;

const GET_BOARD_NUMBER_URL = (boardNumber: string) => `${BOARD_MODULE_URL}/${boardNumber}`;
const GET_BOARD_LIST_API_URL = `${BOARD_MODULE_URL}`;

const POST_COMMENTS_API_URL = (boardNumber : string | number) => `${BOARD_MODULE_URL}/${boardNumber}/comments`;
const PATCH_COMMENTS_API_URL = (boardNumber : string | number, commentNumber : number | string) => `${BOARD_MODULE_URL}/${boardNumber}/comments/${commentNumber}`;
const GET_COMMENT_LIST_API_URL = (boardNumber: string | number) => `${BOARD_MODULE_URL}/${boardNumber}/comment-list`;
const DELETE_COMMENT_API_URL = (boardNumber: string | number, commentNumber: number | string) => `${BOARD_MODULE_URL}/${boardNumber}/comments/${commentNumber}`;

const GET_BOARD_USER_API_URL = `${BOARD_MODULE_URL}/user`


const HEALTH_SCHEDULE_API_URL = `${HEALTHCARE_API_DOMAIN}/api/v1/health-schedule`;

const POST_HEALTH_SCHEDULE_API_URL = `${HEALTH_SCHEDULE_API_URL}`;
const GET_HEALTH_SCHEDULE_LIST_API_URL = `${HEALTH_SCHEDULE_API_URL}`;
const GET_HEALTH_SCHEDULE_API_URL = (healthSchedulenumber: number | string) => `${HEALTH_SCHEDULE_API_URL}/${healthSchedulenumber}`;
const PATCH_HEALTH_SCHEDULE_API_URL = (healthScheduleNumber: number | string) => `${HEALTH_SCHEDULE_API_URL}/${healthScheduleNumber}`;
const DELETE_HEALTH_SCHEDULE_API_URL = (healthSchedulenumber: number | string) => `${HEALTH_SCHEDULE_API_URL}/${healthSchedulenumber}`;

const MEAL_SCHEDULE_API_URL = `${HEALTHCARE_API_DOMAIN}/api/v1/meal-schedule`;

const POST_MEAL_SCHEDULE_API_URL = `${MEAL_SCHEDULE_API_URL}`;
const GET_MEAL_SCHEDULE_LIST_API_URL = `${MEAL_SCHEDULE_API_URL}`;
const GET_MEAL_SCHEDULE_API_URL = (mealSchedulenumber: number | string) => `${MEAL_SCHEDULE_API_URL}/${mealSchedulenumber}`;
const PATCH_MEAL_SCHEDULE_API_URL = (mealScheduleNumber: number | string) => `${MEAL_SCHEDULE_API_URL}/${mealScheduleNumber}`;
const DELETE_MEAL_SCHEDULE_API_URL = (mealScheduleNumber: number | string) => `${MEAL_SCHEDULE_API_URL}/${mealScheduleNumber}`;

const GET_MEAL_MEMO_API_URL = `${MEAL_SCHEDULE_API_URL}/food-data`;
const POST_SEARCH_MEAL_LIST_API_URL = `${MEAL_SCHEDULE_API_URL}/search`;

// function: Authorizarion Bearer 헤더 //
const bearerAuthorization = (accessToken: string) => ({
  headers: { 'Authorization': `Bearer ${accessToken}` }
});

// function: response data 처리 함수 //
const responseDataHandler = <T>(response: AxiosResponse<T, any>) => {
  const { data } = response;
  return data;
};

// function: response error 처리 함수 //
const responseErrorHandler = (error: any) => {
  if (!error.response) return null;
  const { data } = error.response;
  return data as ResponseDto;
};

// function: id check api 요청 함수 //
export const idCheckRequest = async (requestBody: IdCheckRequestDto) => {
  const responseBody = await axios.post(ID_CHECK_API_URL, requestBody)
          .then(responseDataHandler<ResponseDto>)
          .catch(responseErrorHandler);
  return responseBody;
};

// function: nickname check api 요청 함수 //
export const nicknameCheckRequest = async (requestBody: NicknameCheckRequestDto) => {
  const responseBody = await axios.post(NICKNAME_CHECK_API_URL, requestBody)
      .then(responseDataHandler<ResponseDto>)
      .catch(responseErrorHandler);
  return responseBody;
};

// function: tel auth api 요청 함수 //
export const telAuthRequest = async (requestBody: TelAuthRequestDto) => {
  const responseBody = await axios.post(TEL_AUTH_API_URL, requestBody)
      .then(responseDataHandler<ResponseDto>)
      .catch(responseErrorHandler);
  return responseBody;
};

// function: tel auth check 요청 함수 //
export const telAuthCheckRequest = async (requestBody: TelAuthCheckRequestDto) => {
  const responseBody = await axios.post(TEL_AUTH_CHECK_API_URL, requestBody)
      .then(responseDataHandler<ResponseDto>)
      .catch(responseErrorHandler);
  return responseBody;
};

// function: sign in 요청 함수 //
export const signInRequest = async (requestBody: SignInRequestDto) => {
  const responseBody = await axios.post(SIGN_IN_API_URL, requestBody)
  .then(responseDataHandler<SignInResponseDto>)
  .catch(responseErrorHandler);
  return responseBody;
};

// function: get sign in 요청 함수 //
export const getSignInRequest = async (accessToken: string) => {
  const responseBody = await axios.get(GET_SIGN_IN_API_URL, bearerAuthorization(accessToken))
  .then(responseDataHandler<GetSignInResponseDto>)
  .catch(responseErrorHandler);
  return responseBody;
};

// function: sign up 요청 함수 //
export const signUpRequest = async (requestBody: SignUpRequestDto) => {
  const responseBody = await axios.post(SIGN_UP_API_URL, requestBody)
      .then(responseDataHandler<ResponseDto>)
      .catch(responseErrorHandler);
  return responseBody;
};

// function: get customer 요청 함수 //
export const getCustomerRequest = async (userId: string, accessToken: string) => {
  const responseBody = await axios.get(GET_CUSTOMER_API_URL(userId),bearerAuthorization(accessToken))
  .then(responseDataHandler<GetCustomerResposeDto>)
  .catch(responseErrorHandler);
  return responseBody;
};

// function: get customer mypage 요청 함수 //
export const getCustomerMyPageRequest = async (userId: string, accessToken: string) => {
  const responseBody = await axios.get(GET_CUSTOMER_API_URL(userId),bearerAuthorization(accessToken))
  .then(responseDataHandler<GetCustomerMyPageResponseDto>)
  .catch(responseErrorHandler);
  return responseBody;
};

// function: get user muscle fat list 요청 함수 //
export const getUserMuscleFatListRequest = async (userId: string, accessToken: string) => {
  const responseBody = await axios.get(GET_USER_MUSCLE_FAT_LIST_URL(userId), bearerAuthorization(accessToken))
    .then(responseDataHandler<GetUserMuscleFatListResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: get user three major lift list 요청 함수 //
export const getUserThreeMajorLiftListRequest = async (userId: string, accessToken: string) => {
  const responseBody = await axios.get(GET_USER_THREE_MAJOR_LIFT_LIST_URL(userId), bearerAuthorization(accessToken))
    .then(responseDataHandler<GetUserThreeMajorLiftListResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: patch customer 요청 함수 //
export const patchCustomerRequest = async (requsetBody: PatchCustomerRequestDto, accessToken: string) => {
  const responseBody = await axios.patch(PATCH_CUSTOMER_URL, requsetBody, bearerAuthorization(accessToken))
    .then(responseDataHandler<ResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: patch user muscle fat 요청 함수 //
export const patchUserMuscleFatRequest = async (userId: string, requestBody: PatchUserMuscleFatRequestDto, accessToken: string) => {
  const responseBody = await axios.patch(PATCH_USER_MUSCLE_FAT_URL(userId), requestBody, bearerAuthorization(accessToken))
    .then(responseDataHandler<ResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: patch user-three-major-lift 요청 함수
export const patchUserThreeMajorLiftRequest = async (userId: string, requestBody: PatchUserThreeMajorLiftRequestDto, accessToken: string) => {
  const responseBody = await axios.patch(PATCH_USER_THREE_MAJOR_LIFT_URL(userId), requestBody, bearerAuthorization(accessToken))
    .then(responseDataHandler<ResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

const FILE_UPLOAD_URL = `${HEALTHCARE_API_DOMAIN}/file/upload`;

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } }

// function: file upload 요청 함수 //
export const fileUploadRequest = async (requestBody: FormData) => {
    const url = await axios.post(FILE_UPLOAD_URL, requestBody, multipart)
        .then(responseDataHandler<string>)
        .catch(error => null);
    return url;
};

// function: post health schedule 요청 함수 //
export const postHealthScheduleRequest = async (requestBody: PostHealthScheduleRequestDto, accessToken: string) => {
  const responseBody = await axios.post(POST_HEALTH_SCHEDULE_API_URL, requestBody, bearerAuthorization(accessToken))
    .then(responseDataHandler<ResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: get health schedule 요청 함수 //
export const getHealthScheduleRequest = async (healthScheduleNumber: number | string, accessToken: string) => {
  const responseBody = await axios.get(GET_HEALTH_SCHEDULE_API_URL(healthScheduleNumber), bearerAuthorization(accessToken))
    .then(responseDataHandler<GetHealthScheduleResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: get health schedule list 요청 함수 //
export const getHealthScheduleListRequest = async (accessToken: string) => {
  const responseBody = await axios.get(GET_HEALTH_SCHEDULE_LIST_API_URL, bearerAuthorization(accessToken))
    .then(responseDataHandler<GetHealthScheduleListResponseDto>)
    .catch(responseErrorHandler)
  return responseBody;
};

// function: patch health schedule 요청 함수 //
export const patchHealthScheduleRequest = async(requestBody: PatchHealthScheduleRequestDto, healthScheduleNumber: number | string, accessToken: string) => {
  const responseBody = await axios.patch(PATCH_HEALTH_SCHEDULE_API_URL(healthScheduleNumber), requestBody, bearerAuthorization(accessToken))
    .then(responseDataHandler<ResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
}

// function: delete health schedule 요청 함수 //
export const deleteHealthScheduleRequest = async (healthScheduleNumber: number | string, accessToken: string) => {
  const responseBody = await axios.delete(DELETE_HEALTH_SCHEDULE_API_URL(healthScheduleNumber), bearerAuthorization(accessToken))
    .then(responseDataHandler<ResponseDto>)
    .catch(responseErrorHandler)
  return responseBody;
}


// function: post meal schedule 요청 함수 //
export const postMealScheduleRequest = async (requestBody: PostMealScheduleRequestDto, accessToken: string) => {
  const responseBody = await axios.post(POST_MEAL_SCHEDULE_API_URL, requestBody, bearerAuthorization(accessToken))
    .then(responseDataHandler<ResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: get meal schedule 요청 함수 //
export const getMealScheduleRequest = async (mealScheduleNumber: number | string, accessToken: string) => {
  const responseBody = await axios.get(GET_MEAL_SCHEDULE_API_URL(mealScheduleNumber), bearerAuthorization(accessToken))
    .then(responseDataHandler<GetMealScheduleResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: get meal schedule list 요청 함수 //
export const getMealScheduleListRequest = async (accessToken: string) => {
  const responseBody = await axios.get(GET_MEAL_SCHEDULE_LIST_API_URL, bearerAuthorization(accessToken))
    .then(responseDataHandler<GetMealScheduleListResponseDto>)
    .catch(responseErrorHandler)
  return responseBody;
};

// function: patch meal schedule 요청 함수 //
export const patchMealScheduleRequest = async(requestBody: PatchMealScheduleRequestDto, mealScheduleNumber: number | string, accessToken: string) => {
  const responseBody = await axios.patch(PATCH_MEAL_SCHEDULE_API_URL(mealScheduleNumber), requestBody, bearerAuthorization(accessToken))
    .then(responseDataHandler<ResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
}

// function: delete meal schedule 요청 함수 //
export const deleteMealScheduleRequest = async (mealScheduleNumber: number | string, accessToken: string) => {
  const responseBody = await axios.delete(DELETE_MEAL_SCHEDULE_API_URL(mealScheduleNumber), bearerAuthorization(accessToken))
    .then(responseDataHandler<ResponseDto>)
    .catch(responseErrorHandler)
  return responseBody;
}

// function: get meal memo 요청합수 //
export const getMealMemoRequest = async (accessToken: string) => {
  const responseBody = await axios.get(GET_MEAL_MEMO_API_URL, bearerAuthorization(accessToken))
    .then(responseDataHandler<GetMealResponseDto>)
    .catch(responseErrorHandler)
  return responseBody;
};

// function: post search meal List 요청함수 //
// export const postSearchMealList = async ()


// function: post board 요청 함수 //
export const postBoardRequest = async (requestBody: PostBoardRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_BOARD_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}  

// function: get board 요청함수 List //
export const getBoardListRequest = async () => {
    const responseBody = await axios.get(GET_BOARD_LIST_API_URL)
        .then(responseDataHandler<GetBoardListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get board 요청함수 //
export const getBoardRequest = async (boardNumber: string) => {
    const responseBody = await axios.get(GET_BOARD_NUMBER_URL(boardNumber))
        .then(responseDataHandler<GetBoardResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get board user 요청 함수 //
export const getBoardUserRequest = async (accessToken: string) => {
  const responseBody = await axios.get(GET_BOARD_USER_API_URL, bearerAuthorization(accessToken))
  .then(responseDataHandler<GetBoardUserResponseDto>)
  .catch(responseErrorHandler);
  return responseBody;
};


// function: delete board 요청 함수 //
export const deleteBoardRequest = async (boardNumber: number | string, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_BOARD_API_URL(boardNumber), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
  }

// function: get comment list 요청 함수 //
export const getCommentListRequest = async (boardNumber: string | number) => {
    const responseBody = await axios.get(GET_COMMENT_LIST_API_URL(boardNumber))
        .then(responseDataHandler<GetCommentListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: post comments 요청 함수 //
export const postCommentsRequest = async (requestBody: PostCommentRequestDto, boardNumber: string | number, accessToken: string) => {
    const responseBody = await axios.post(POST_COMMENTS_API_URL(boardNumber), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
  }

// function: patch comment 요청 함수 //
export const patchCommentRequest = async (requestBody: PatchCommentRequestDto, commentNumber: number | string, boardNumber: string | number, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_COMMENTS_API_URL(boardNumber,commentNumber), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
  }

// function: delete comment 요청 함수 //
export const deleteCommentRequest = async (boardNumber: string | number, commentNumber: number | string, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_COMMENT_API_URL(boardNumber,commentNumber), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}
