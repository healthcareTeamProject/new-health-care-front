import React from 'react'
import './style.css'

// component: 개인정보 컴포넌트 //
function Personal() {

    // render: 개인정보 컴포넌트 렌더딩 //
    return (
        <div className='personal'>
            <div className='personal-logo'></div>
            <div className='personal-buttom'>
                <div className='profile-image'>이미지</div>
                <div className='personal-information'>
                    <div className='name'>
                        <div className='name title'>이름</div>
                        <div className='name-value'>임의의 이름</div>
                    </div>
                    <div className='nickname'>
                        <div className='nickname title'>닉네임</div>
                        <div className='nickname-value'>임의의 닉네임</div>
                    </div>
                    <div className='height'>
                        <div className='height title'>키</div>
                        <div className='height-value'>임의의 키</div>
                    </div>
                </div>
                <div className='personal-goals-box'>
                    <div className='personal-goals-box-icon'></div>
                    <div className='personal-goals-box-buttom'>
                        <div className='personal-goals-box-buttom-title'>개인목표</div>
                        <input className='personal-goals-box-buttom-content' placeholder='개인목표' />
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
        <div className='three-major-lift'>
            <div className='three-major-lift-top'>
                <div className='three-major-lift-top-title'></div>
                <div className='three-major-lift-top-icon'></div>
            </div>
            <div className='three-major-lift-buttom'>내용물</div>
        </div>
    )

}

// component: 내 게시물 컴포넌트 //
function Board() {

    // render: 내 게시물 컴포넌트 렌더딩 //
    return (
        <div className='board'>
            <div className='board-title'>내 게시물</div>
            <div></div>
        </div>
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
