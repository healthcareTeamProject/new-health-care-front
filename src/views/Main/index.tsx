import React, { ChangeEvent, useEffect, useState } from 'react'
import './style.css'
import TopBar from 'src/layouts/Topbar'
import CommunityBoard from 'src/components/Post'

export default function Main() {
    return (
        <div id='main-wrapper'>
            <div className='main-detail-box'>
                <div className='main-top-detail-box'>
                    <div className='main-image'></div>
                    <div className='main-top-right-detail-box'>
                        <div className='login-box'>
                            <div className='login-logo-image-box'>
                                <div className='login-logo-image'></div>
                            </div>
                                <div className='login-big-box'>
                                    <div className='login-id-password-box'>
                                        <div className='login-id-box'>
                                            <div className='login-in-id-text'>아이디</div>
                                            <div className='login-in-id-box'>
                                                <div className='login-input-id-text'>아이디를 입력해주세요</div>
                                            </div>
                                        </div>
                                        <div className='login-password-box'>
                                            <div className='login-in-password-text'>비밀번호</div>
                                            <div className='login-in-password-box'>
                                                <div className='login-input-password-text'>비밀번호를 입력해주세요</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='login-sign-up-button-box'>
                                        <div className='login-button-box'>
                                            <div className='login-button-top'>
                                                <div className='login-button-text'>로그인</div>
                                            </div>
                                        </div>
                                        <div className='sign-up-button-box'>
                                            <div className='sign-up-button-text'>회원가입</div>
                                        </div>
                                    </div>
                                    <div className='sns-login-big-box'>
                                        <div className='sns-login-text-box'>
                                            <div className='sns-login-text'>SNS 로그인</div>
                                        </div>
                                        <div className='sns-login-button-box'>
                                            <div className='sns-login-kakao-button-box'>
                                                <div className='sns-login-kakao-button-image'></div>
                                            </div>
                                            <div className='sns-login-naver-button-box'>
                                                <div className='sns-login-naver-button-image'></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            
                        </div>
                        <div className='scadul-mini-box'></div>
                    </div>
                </div>
                <div className='main-under-detail-box'>
                    <CommunityBoard />
                    <div className='main-user-detail-grap-box'></div>
                </div>
            </div>
        </div>
    )
}
