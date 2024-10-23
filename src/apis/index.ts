import { AxiosResponse } from "axios";
import { ResponseDto } from "./dto/response";

// variable: API URL 상수 //
const HEALTHCARE_API_DOMAIN = process.env.REACT_APP_API_URL;

const AUTH_MODULE_URL = `${HEALTHCARE_API_DOMAIN}/api/v1/auth`;

const ID_CHECK_API_URL = `${AUTH_MODULE_URL}/id-check`;
const TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/tel-auth`;
const TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/tel-auth-check`;
const SIGN_UP_API_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;

const CUSTOMER_MODUEL_URL = `${HEALTHCARE_API_DOMAIN}/api/v1/customer`;

// function: Authorizarion Bearer 헤더 //
const bearerAuthorization = (accessToken: string) => ({
  headers: { Authorization: `Bearer ${accessToken}` },
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
