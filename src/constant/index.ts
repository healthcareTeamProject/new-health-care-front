// variable: 상대 경로 상수 //
export const ROOT_PATH = '/';

export const MAIN_PATH = '/main';

export const SIGN_UP_PATH = '/sign-up';

export const CUSTOMER_MYPAGE_DETAIL_PATH = (userId : string) => `/mypage/${userId}`;

export const MY_PAGE_PATH = '/my-page';

export const BOARD_LIST_PATH = '/board';
export const BOARD_DETAIL_PATH = (boardNumber: number | string) => `/board/detail/${boardNumber}`;
export const BOARD_UPDATE_PATH = (boardNumber: number | string) => `/board/update/${boardNumber}`;

export const POST_PATH = '/post';


export const SCHEDULE_PATH = '/schedul';

export const SNS_SUCCESS_PATH = '/sns-success';
export const OTHERS_PATH = '*';


// variable: 절대 경로 상수 //
export const ROOT_ABSOLUTE_PATH = ROOT_PATH;

export const MAIN_ABSOLUTE_PATH = MAIN_PATH;
export const SIGN_UP_ABSOLUTE_PATH = SIGN_UP_PATH;

export const CUSTOMER_MYPAGE_DETAIL_ABSOLUTE_PATH = CUSTOMER_MYPAGE_DETAIL_PATH;

export const MY_PAGE_ABSOLUTE_PATH = MY_PAGE_PATH;

export const BOARD_LIST_ABSOLUTE_PATH = BOARD_LIST_PATH;
export const BOARD_DETAIL_ABSOLUTE_PATH = BOARD_DETAIL_PATH;
export const BOARD_UPDATE_ABSOLUTE_PATH = BOARD_UPDATE_PATH;



export const POST_ABSOLUTE_PATH = POST_PATH;


export const SCHEDULE_ABSOLUTE_DATH = SCHEDULE_PATH;

// variable: HTTP BEARER TOKEN COOKIE NAME //
export const ACCESS_TOKEN = 'accessToken';