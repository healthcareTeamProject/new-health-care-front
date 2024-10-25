import React from 'react'
import './style.css'

export default function Mypage() {
    return (
        <div id='my-wrapper'>
            <div className='my-page-left'>
                <div className='my-page-title'>마이페이지</div>
            </div>
            <div className='my-page-main'>
                <div className='top'>
                    <div className='personal'>개인정보</div>
                    <div className='user-muscle-fat'>인바디</div>
                </div>
                <div className='buttom'>
                    <div className='buttom-left'>
                        <div className='three-major-lift'>3대측정</div>
                        <div className='board'>내 게시물</div>
                    </div>
                    <div className='buttom-right'>그래프</div>
                </div>
            </div>
        </div>
    )
}
