import { useCookies } from 'react-cookie'
import './style.css'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { ACCESS_TOKEN, BOARD_LIST_PATH, CUSTOMER_MYPAGE_DETAIL_PATH, MAIN_ABSOLUTE_PATH, MAIN_PATH,ROOT_ABSOLUTE_PATH, ROOT_PATH, SCHEDULE_PATH} from 'src/constant';
import { SignInCustomer } from 'src/types';
import { getSignInRequest } from 'src/apis';
import { GetSignInResponseDto } from 'src/apis/dto/response/customer';
import { ResponseDto } from 'src/apis/dto/response';
import { useSignInCustomerStroe } from 'src/stores';

// component: 로그인 후 컴포넌트 //
function LoginTop(){

    // state: 로그인 후 컴포넌트 상태 //
    const[cookies, setCookies, removeCookie] = useCookies();
    // state: 로그인 되지 않은 컴포넌트 상태 //
    const [loginstate, setLoginState] = useState<boolean>(false);
    // state: 로그인 유저 정보 상태 //
    const {signInCustomer, setSignInCustomer} = useSignInCustomerStroe();
    const [userId, setUserId] = useState<string>('');

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // event handler: 마이페이지 버튼 클릭 이벤트 처리 //
    const onMyPageButtonClickHandler = () => {
        if (signInCustomer?.userId) {
            navigator(CUSTOMER_MYPAGE_DETAIL_PATH(signInCustomer?.userId))
        }
        
    }
    
    // event handler: 로그아웃 버튼 클릭 이벤트 처리 //
    const onLogoutButtonClickHandler = () => {
        removeCookie(ACCESS_TOKEN, {path: ROOT_ABSOLUTE_PATH});
        navigator(MAIN_ABSOLUTE_PATH);
    }

    // function: get sign in 요청 함수 //
    const getSignInResponse = (responseBody:  GetSignInResponseDto | ResponseDto | null) => {
        const message = 
            !responseBody ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.':
            responseBody.code === 'NI' ? '로그인 유저 정보가 존재하지 않습니다.':
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.': '';
            
    const isSuccessed = responseBody !== null && responseBody.code === 'SU';

    if(!isSuccessed) {
        alert(message);
        removeCookie(ACCESS_TOKEN, {path: ROOT_PATH});
        navigator(MAIN_ABSOLUTE_PATH);
        return;
    }

    const {userId, name, nickname} = responseBody as GetSignInResponseDto;
    setSignInCustomer({userId, name, nickname});

    setUserId(userId);

    }

    console.log(userId);
    console.log(signInCustomer?.userId);

    // effect: cookie의 accessToken 값이 변경될 때마다 로그인 유저 정보를 요청하는 함수 //
    useEffect(() => {
        const accessToken = cookies[ACCESS_TOKEN];
        if(accessToken) getSignInRequest(accessToken).then(getSignInResponse)
        else setSignInCustomer(null);
    }, [cookies[ACCESS_TOKEN]]);

    // effect: 마운트 시 경로 이동 effect //
    useEffect(()=> {
        const accessToken = cookies[ACCESS_TOKEN];
        if(accessToken) navigator(MAIN_PATH);
        return;
    }, []);

    // render: 로그인 후 컴포넌트 렌더링 //
    return(
        <div className='logout-mypage-box'>
            <div className='mypage-button'onClick={onMyPageButtonClickHandler}>{signInCustomer?.nickname}님</div>
            <div className='logout-button'onClick={onLogoutButtonClickHandler}>{'로그아웃'}</div>
        </div>
    )

}

// component: 상단 기본 컴포넌트 //
export default function TopBar() {
    
    // state: 쿠키 상태 //
    const [cookies] = useCookies();

    // 현재 사용자가 로그인되어 있는지 확인하기 위해 accessToken을 쿠키에서 가져온다 //
    const isLoggedIn = !!cookies[ACCESS_TOKEN];

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // event handler: 홈 로고 클릭 이벤트 처리 //
    const onHomeClickHandler = () => {
        navigator(MAIN_PATH);
    };
        
    // event handler: 커뮤니티 클릭 이벤트 처리 //
    const onBoardClickHandler = () => {
        navigator(BOARD_LIST_PATH);
    };
    
    // event handler: 스케줄러 클릭 이벤트 처리 //
    const onScheduleClickHandler = () => {
        navigator(SCHEDULE_PATH);
    };
    return (
            <div id='main-layout'>
                <div id='layout-top-logo'>
                    <div className='menu-box'>
                        <div className='home-button'onClick={onHomeClickHandler}>홈</div>
                        <div className='board-button'onClick={onBoardClickHandler}>커뮤니티</div>
                        <div className='schedule-button'onClick={onScheduleClickHandler}>스케줄표</div>
                    </div>
                    <div className='logo-box'></div>
                    {isLoggedIn && <LoginTop />}
                </div>
            </div>
    )
}
