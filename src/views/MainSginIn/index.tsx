import { useCookies } from "react-cookie"

// component: 로그인 후 메인 화면 컴포넌트 //
function MainSignIn(){

    // state: cookie 상태 //
    const [cookies] = useCookies();
}

// component: 로그인 메인 화면 컴포넌트 //
export default function () {
    return (
        <div id='main-wrapper'>
            <div className='main-detail-box'>
                <div className='main-top-detail-box'>
                    <div className='main-image'></div>
                    <div className='main-top-right-detail-box'>
                        
                        <div className='scadul-mini-box'></div>
                    </div>
                </div>
                <div className='main-under-detail-box'>
                    <div className='main-community-latest-box'></div>
                    <div className='main-user-detail-grap-box'></div>
                </div>
            </div>
        </div>
    )
}
