import { useCookies } from 'react-cookie'
import './style.css'

import React from 'react'
import { useUserStore } from 'src/stores';
import { useNavigate } from 'react-router';
import { ACCESS_TOKEN, BOARD_LIST_PATH, MAIN_ABSOLUTE_PATH, MAIN_PATH, ROOT_ABSOLUTE_PATH, SCHEDUL_DATH, USER_MYPAGE_DETAIL_PATH } from 'src/constant';

// component: 로그인 전 컴포넌트 //
function LoginTop(){

    // state: 로그인 후 컴포넌트 상태 //
    const[cookies, setCookies, removeCookie] = useCookies();
    // state: 로그인 유저 상태 //
    const {user, setUser} = useUserStore();

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // event handler: 마이페이지 버튼 클릭 이벤트 처리 //
    const onMyPageButtonClickHandler = () => {
        navigator(USER_MYPAGE_DETAIL_PATH(cookies.accessToken))
    }
    
    // event handler: 로그아웃 버튼 클릭 이벤트 처리 //
    const onLogoutButtonClickHandler = () => {
        removeCookie(ACCESS_TOKEN, {path: ROOT_ABSOLUTE_PATH});
        navigator(MAIN_ABSOLUTE_PATH);
    }

    // render: 로그인 후 컴포넌트 렌더링 //
    return(
        <div className='logout-mypage-box'>
            <div className='mypage-button'onClick={onMyPageButtonClickHandler}>{'홍길동'}님</div>
            <div className='logout-button'onClick={onLogoutButtonClickHandler}>{'로그아웃'}</div>
        </div>
    )

}

// component: 상단 기본 컴포넌트 //
export default function TopBar() {

    // state: 쿠키 상태 //
    const [cookies] = useCookies();

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
        navigator(SCHEDUL_DATH);
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
                    <LoginTop />
                </div>
            </div>
    )
}
