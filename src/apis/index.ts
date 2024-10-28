import axios, { AxiosResponse } from "axios";
import { ResponseDto } from "./dto/response";
import { IdCheckRequestDto, SignInRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./dto/request/auth";
import NicknameCheckRequestDto from "./dto/request/auth/nickname-check.request.dto";
import { ACCESS_TOKEN } from "src/constant";
import { SignInResponseDto } from "./dto/response/auth";
import { GetSignInResponseDto } from "./dto/response/customer";

// variable: API URL 상수 //
const HEALTHCARE_API_DOMAIN = `http://localhost:4000`;

const AUTH_MODULE_URL = `${HEALTHCARE_API_DOMAIN}/api/v1/auth`;

const ID_CHECK_API_URL = `${AUTH_MODULE_URL}/id-check`;
const NICKNAME_CHECK_API_URL = `${AUTH_MODULE_URL}/nickname-check`;
const TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/tel-auth`;
const TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/tel-auth-check`;
const SIGN_UP_API_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;

const CUSTOMER_MODULE_URL = `{HEALTHCARE_API_DOMAIN}/api/v1/customer`;

const GET_SIGN_IN_API_URL = `{CUSTOMER_MODULE_URL}/sign-in`

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

