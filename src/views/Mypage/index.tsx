import React from 'react'
import './style.css'

// component: 개인정보 컴포넌트 //
function Personal() {

    // render: 개인정보 컴포넌트 렌더딩 //
    return (
        <div className='personal'>
            <div className='personal-logo'></div>
            <div className='personal-buttom'>
                <div className='profile-image'></div>
                <div className='personal-information'>
                    <div className='name'></div>
                    <div className='nickname'></div>
                    <div className='height'></div>
                </div>
                <div className='personal-goals-box'>
                    <div className='personal-goals-box-icon'></div>
                    <div>
                        <div className='personal-goals-box-title'></div>
                        <input className='personal-goals-box-content' />
                    </div>
                </div>
            </div>
        </div>
    )

}

// component: 신체정보 컴포넌트 //
function UserMucleFat() {

    // render: 신체정보 컴포넌트 렌더딩 //
    return (
        <div className='user-muscle-fat'>인바디</div>
    )

}

// component: 3대측정 컴포넌트 //
function ThreeMajorLift() {

    // render: 3대측정 컴포넌트 렌더딩 //
    return (
        <div className='three-major-lift'>3대측정</div>
    )

}

// component: 내 게시물 컴포넌트 //
function Board() {

    // render: 내 게시물 컴포넌트 렌더딩 //
    return (
        <div className='board'>내 게시물</div>
    )

}

// component: 신체정보 컴포넌트 //
function Graph() {

    // render: 신체정보 컴포넌트 렌더딩 //
    return (
        <div className='graph'>그래프</div>
    )

}



// component: 마이페이지 컴포넌트 //
export default function Mypage() {

    // render: 마이페이지 컴포넌트 렌더딩 //
    return (
        <div id='my-wrapper'>
            <div className='my-page-left'>
                <div className='my-page-title'>마이페이지</div>
            </div>
            <div className='my-page-main'>
                <div className='top'>
                    <Personal />
                    <UserMucleFat />
                </div>
                <div className='buttom'>
                    <div className='buttom-left'>
                        <ThreeMajorLift />
                        <Board />
                    </div>
                    <Graph />
                </div>
            </div>
        </div>
    )
}
