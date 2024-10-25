import React, { useEffect } from 'react';
import './Healthcare.css';
import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import Main from 'src/views/Main';
import Community from './views/Community';
import SignUp from './views/SignUp';

import { ACCESS_TOKEN, BOARD_LIST_PATH, MAIN_ABSOLUTE_PATH, MAIN_PATH, MAIN_SIGN_IN_PATH, MAIN_SIGN_IN_ABSOLUTE_PATH, ROOT_PATH, SIGN_UP_PATH } from './constant';
import { useCookies } from 'react-cookie';
import { useSignInUserStore } from './stores';
import MainSginIn from './views/MainSginIn';

// component: root path 컴포넌트 //
function Index(){

  // state: 쿠키 상태 //
  const[cookies] = useCookies();

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // effect: 마운트 시 경로 이동 effect //
  useEffect(()=> {
      if(cookies.accessToken) navigator(MAIN_SIGN_IN_PATH);
      else navigator(MAIN_ABSOLUTE_PATH);
  }, []);

  // render: root path 컴포넌트 렌더링 //
  return(
    <></>
  )
}

// component: Sns sucess 컴포넌트 //
function SnsSuccess(){

  // state: Query Parmeter 상태 //
  const [queryParam] = useSearchParams();
  const accessToken = queryParam.get('accessToken');
  const expiration = queryParam.get('expiration');

  // state: cookie 상태 //
  const [cookies, setCookies] = useCookies();

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // effect: Sns Success 컴포넌트 로드시 accessToken과 expiration을 확인하고 로그인 처리 //
  useEffect(()=>{
    if(accessToken && expiration) {
      const expires = new Date(Date.now() + Number(expiration) * 1000);
      setCookies(ACCESS_TOKEN, accessToken, {path: ROOT_PATH, expires});

      navigator(MAIN_SIGN_IN_ABSOLUTE_PATH);
    }
    else navigator(MAIN_ABSOLUTE_PATH);
  }, []);

  // render: Sns success 컴포넌트 렌더링 //
  return <></>
}

// component: Healthcare 컴포넌트 //
export default function Healthcare() {

  return (
    <Routes>
      <Route index element={<Index/>} />
      <Route path={MAIN_PATH} element={<Main />} />
      <Route path={MAIN_SIGN_IN_PATH} element={<MainSginIn />}/>
      <Route path={BOARD_LIST_PATH} element={<Community />} />
      <Route path={SIGN_UP_PATH} element={<SignUp />} />
      <Route path='*' element={<SnsSuccess/>} />
    </Routes>
  );
}
