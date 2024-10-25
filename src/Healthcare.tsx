import React, { useEffect } from 'react';
import './Healthcare.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Main from 'src/views/Main';
import Community from './views/Community';
import SignUp from './views/SignUp';
import { BOARD_LIST_ABSOLUTE_PATH, MAIN_ABSOLUTE_PATH, MY_PAGE_ABSOLUTE_PATH, SIGN_UP_ABSOLUTE_PATH } from './constant';
import Mypage from './views/Mypage';

// component: root path 컴포넌트 //
function Index(){

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // effect: 마운트 시 경로 이동 effect //
  useEffect(()=> {
      navigator(MAIN_ABSOLUTE_PATH);
  }, []);

  // render: root path 컴포넌트 렌더링 //
  return(
    <></>
  )
}
export default function Healthcare() {
  return (
    <Routes>
      <Route index element={<Index/>} />
      <Route path={MAIN_ABSOLUTE_PATH} element={<Main />} />
      <Route path={SIGN_UP_ABSOLUTE_PATH} element={<SignUp />} />
      <Route path={MY_PAGE_ABSOLUTE_PATH} element={<Mypage />} />
      <Route path={BOARD_LIST_ABSOLUTE_PATH} element={<Community />} />
    </Routes>
  );
}
