// variable: 상대 경로 상수 //
export const ROOT_PATH = '/';

export const MAIN_PATH = '/main';

export const SIGN_UP_PATH = '/sign-up';

export const CUSTOMER_MYPAGE_DETAIL_PATH = `/mypage`;

export const MY_PAGE_PATH = '/my-page';

export const BOARD_LIST_PATH = '/board';
export const BOARD_DETAIL_PATH = (boardNumber: number | string) => `/board/detail/${boardNumber}`;
export const BOARD_UPDATE_PATH =  (boardNumber: number | string) => `/board/detail/${boardNumber}/update`;

export const MA_PATH = '/board/ma';
export const HT_PATH = '/board/ht';
export const GE_PATH = '/board/ge';
export const GM_PATH = '/board/gm';

export const ED_PATH = '/board/ed';
export const NM_PATH = '/board/nm';
export const UB_PATH = '/board/ub';
export const SD_PATH = '/board/sd';
export const LB_PATH = '/board/lb';
export const BC_PATH = '/board/bc';
export const WI_PATH = '/board/wi';
export const CH_PATH = '/board/ch';
export const WL_PATH = '/board/wl';
export const SM_PATH = '/board/sm';
export const CM_PATH = '/board/cm';
export const RM_PATH = '/board/rm';
export const PT_PATH = '/board/pt';
export const IR_PATH = '/board/ir';
export const CO_PATH = '/board/co';
export const BE_PATH = '/board/be';
export const FE_PATH = '/board/fe';
export const DM_PATH = '/board/dm';
export const NS_PATH = '/board/ns';
export const BP_PATH = '/board/bp';




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
export const BOARD_DETAIL_ABSOLUTE_PATH = (boardNumber: number | string) => `${BOARD_LIST_PATH}/${BOARD_DETAIL_PATH(boardNumber)}`;
export const BOARD_UPDATE_ABSOLUTE_PATH =  (boardNumber: number | string) => `${BOARD_LIST_PATH}/${BOARD_UPDATE_PATH(boardNumber)}`;
export const MA_ABSOLUTE_PATH = MA_PATH;
export const HT_ABSOLUTE_PATH = HT_PATH;
export const GE_ABSOLUTE_PATH = GE_PATH;
export const GM_ABSOLUTE_PATH = GM_PATH;

export const ED_ABSOLUTE_PATH = ED_PATH;
export const NM_ABSOLUTE_PATH = NM_PATH;
export const UB_ABSOLUTE_PATH = UB_PATH;
export const SD_ABSOLUTE_PATH = SD_PATH;
export const LB_ABSOLUTE_PATH = LB_PATH;
export const BC_ABSOLUTE_PATH = BC_PATH;
export const WI_ABSOLUTE_PATH = WI_PATH;
export const CH_ABSOLUTE_PATH = CH_PATH;
export const WL_ABSOLUTE_PATH = WL_PATH;
export const SM_ABSOLUTE_PATH = SM_PATH;
export const CM_ABSOLUTE_PATH = CM_PATH;
export const RM_ABSOLUTE_PATH = RM_PATH;
export const PT_ABSOLUTE_PATH = PT_PATH;
export const IR_ABSOLUTE_PATH = IR_PATH;
export const CO_ABSOLUTE_PATH = CO_PATH;
export const BE_ABSOLUTE_PATH = BE_PATH;
export const FE_ABSOLUTE_PATH = FE_PATH;
export const DM_ABSOLUTE_PATH = DM_PATH;
export const NS_ABSOLUTE_PATH = NS_PATH;
export const BP_ABSOLUTE_PATH = BP_PATH;




export const POST_ABSOLUTE_PATH = POST_PATH;


export const SCHEDULE_ABSOLUTE_DATH = SCHEDULE_PATH;

// variable: HTTP BEARER TOKEN COOKIE NAME //
export const ACCESS_TOKEN = 'accessToken';