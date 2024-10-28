import { useEffect, useState } from "react";
import { useCookies } from "react-cookie"
import { useNavigate, useParams } from "react-router";
import { getSignInRequest } from "src/apis";
import { ResponseDto } from "src/apis/dto/response";
import { GetSignInResponseDto } from "src/apis/dto/response/customer";
import { ACCESS_TOKEN, MAIN_ABSOLUTE_PATH, MAIN_SIGN_IN_ABSOLUTE_PATH } from "src/constant";
import { useSignInCustomerStroe } from "src/stores";

// component: 로그인 후 개인 정보 박스 컴포넌트 //
function CustomerComponent(){
    // state: cookie 상태 //
    const [cookies] = useCookies();
    // state: 로그인 유저 상태 //
    const {signInCustomer,setSignInCustomer} = useSignInCustomerStroe();
    // state: 고객 정보 상태 //
    const [profileImage, setProfileImage] = useState<string | undefined>('');
    const [name, setName] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [personalGoals, setPersonalGoals] = useState<string | undefined>('');
    
    // function: 네비게이터 변경 함수 //
    const navigator = useNavigate();

    // function: get signInCutomer response 처리 함수 //
    const getSignInCustomerResponse = (responseBody: GetSignInResponseDto | ResponseDto | null) => {
        const message = 
        !responseBody ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.':
        responseBody.code === 'NI' ? '로그인 유저 정보가 존재하지 않습니다.':
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
        responseBody.code === 'DBE' ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.': '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';

        if(!isSuccessed) {
            alert(message);
            setSignInCustomer(null);
            return;
    }

    const { profileImage, name, nickname, personalGoals } = responseBody as  GetSignInResponseDto;
    setProfileImage(profileImage);
    setName(name);
    setNickname(nickname);
    setPersonalGoals(personalGoals);

    navigator(MAIN_SIGN_IN_ABSOLUTE_PATH);
};

    // effect: cookie의 accessToken 값이 변경시 로그인 유저 정보 요청 //
    useEffect(() => {
        const accessToken = cookies[ACCESS_TOKEN];
        if(accessToken) getSignInRequest(accessToken).then(getSignInCustomerResponse)
            else setSignInCustomer(null);
    }, [cookies[ACCESS_TOKEN]]);

    // render: 로그인 후 메인 화면 컴포넌트 렌더링 //
    return (
        <div className='login-box'>
            <div className='login-logo-image-box'>
                <div className='login-logo-image'></div>
            </div>
                <div className='login-big-box'>
                    <div className='login-middle-box'>
                    </div>
                </div>
        </div>
    )
}


// component: 로그인 후 메인 화면 컴포넌트 //
export default function MainSignIn() {

    // render: 로그인 후 메인 화면 컴포넌트 렌더링 //
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
