import axios, { AxiosResponse } from "axios";
import { ResponseDto } from "./dto/response";
import { IdCheckRequestDto, SignInRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./dto/request/auth";
import NicknameCheckRequestDto from "./dto/request/auth/nickname-check.request.dto";
import { ACCESS_TOKEN } from "src/constant";
import { SignInResponseDto } from "./dto/response/auth";
import { GetCustomerMyPageResponseDto, GetSignInResponseDto } from "./dto/response/customer";
import { PostThreeMajorLiftRequestDto, PostUserMuscleFatRequestDto } from "./dto/request/customer";
import GetCustomerResposeDto from "./dto/response/customer/get-customer.response.dto";

// variable: API URL 상수 //
const HEALTHCARE_API_DOMAIN = `http://localhost:4000`;

const AUTH_MODULE_URL = `${HEALTHCARE_API_DOMAIN}/api/v1/auth`;

const ID_CHECK_API_URL = `${AUTH_MODULE_URL}/id-check`;
const NICKNAME_CHECK_API_URL = `${AUTH_MODULE_URL}/nickname-check`;
const TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/tel-auth`;
const TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/tel-auth-check`;
const SIGN_UP_API_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;

const POST_USER_MUSCLE_FAT = `${HEALTHCARE_API_DOMAIN}/api/v1/muscle-fat`
const POST_THREE_MAJOR_LIFT = `${HEALTHCARE_API_DOMAIN}/api/v1/three-major-lift`

const CUSTOMER_MODULE_URL = `${HEALTHCARE_API_DOMAIN}/api/v1/customer`;

const GET_SIGN_IN_API_URL = `${CUSTOMER_MODULE_URL}/sign-in`;
const GET_CUSTOMER_API_URL = (userId: string) => `${CUSTOMER_MODULE_URL}/${userId}`;


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
}

// function: nickname check api 요청 함수 //
export const nicknameCheckRequest = async (requestBody: NicknameCheckRequestDto) => {
  const responseBody = await axios.post(NICKNAME_CHECK_API_URL, requestBody)
      .then(responseDataHandler<ResponseDto>)
      .catch(responseErrorHandler);
  return responseBody;
}

// function: tel auth api 요청 함수 //
export const telAuthRequest = async (requestBody: TelAuthRequestDto) => {
  const responseBody = await axios.post(TEL_AUTH_API_URL, requestBody)
      .then(responseDataHandler<ResponseDto>)
      .catch(responseErrorHandler);
  return responseBody;
}

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
}

// function: get sign in 요청 함수 //
export const getSignInRequest = async (accessToken: string) => {
  const responseBody = await axios.get(GET_SIGN_IN_API_URL, bearerAuthorization(accessToken))
  .then(responseDataHandler<GetSignInResponseDto>)
  .catch(responseErrorHandler);
  return responseBody;
}

// function: sign up 요청 함수 //
export const signUpRequest = async (requestBody: SignUpRequestDto) => {
  const responseBody = await axios.post(SIGN_UP_API_URL, requestBody)
      .then(responseDataHandler<ResponseDto>)
      .catch(responseErrorHandler);
  return responseBody;
}

// function: get customer 요청 함수 //
export const getCustomerRequest = async (userId: string, accessToken: string) => {
  const responseBody = await axios.get(GET_CUSTOMER_API_URL(userId),bearerAuthorization(accessToken))
  .then(responseDataHandler<GetCustomerResposeDto>)
  .catch(responseErrorHandler);
  return responseBody;
}

// function: get customer mypage 요청 함수 //
export const getCustomerMyPageRequest = async (userId: string, accessToken: string) => {
  const responseBody = await axios.get(GET_CUSTOMER_API_URL(userId),bearerAuthorization(accessToken))
  .then(responseDataHandler<GetCustomerMyPageResponseDto>)
  .catch(responseErrorHandler);
  return responseBody;
}

// function: post user muscle fat 요청 함수 //
export const postUserMuscleFatRequest = async (requestBody: PostUserMuscleFatRequestDto) => {
  const responseBody = await axios.post(POST_USER_MUSCLE_FAT, requestBody)
      .then(responseDataHandler<ResponseDto>)
      .catch(responseErrorHandler);
  return responseBody;
}

// function: post three major lift 요청 함수 //
export const postThreeMajorLiftRequest = async (requestBody: PostThreeMajorLiftRequestDto) => {
  const responseBody = await axios.post(POST_THREE_MAJOR_LIFT, requestBody)
      .then(responseDataHandler<ResponseDto>)
      .catch(responseErrorHandler);
  return responseBody;
}

const FILE_UPLOAD_URL = `${HEALTHCARE_API_DOMAIN}/file/upload`;

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } }

// function: file upload 요청 함수 //
export const fileUploadRequest = async (requestBody: FormData) => {
    const url = await axios.post(FILE_UPLOAD_URL, requestBody, multipart)
        .then(responseDataHandler<string>)
        .catch(error => null);
    return url;
}

