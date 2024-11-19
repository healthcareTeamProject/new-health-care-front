import React, { ChangeEvent, useEffect, useState } from 'react'
import './style.css'
import TopBar from 'src/layouts/Topbar'
import { useCookies } from 'react-cookie'
import { useNavigate, useParams } from 'react-router';
import { SignInRequestDto } from 'src/apis/dto/request/auth';
import { ResponseDto } from 'src/apis/dto/response';
import { SignInResponseDto } from 'src/apis/dto/response/auth';
import { ACCESS_TOKEN, MAIN_ABSOLUTE_PATH, MAIN_PATH, ROOT_PATH, SCHEDULE_ABSOLUTE_DATH, SIGN_UP_ABSOLUTE_PATH, SIGN_UP_PATH } from 'src/constant';
import { getCustomerMyPageRequest, getCustomerRequest, getHealthScheduleListRequest, getSignInRequest, patchUserMuscleFatRequest, signInRequest } from 'src/apis';

import InputBox from 'src/components/InputBox';
import { useSearchParams } from 'react-router-dom';
import MainInputBox from 'src/components/MainInputBox';
import { GetCustomerMyPageResponseDto, GetCustomerResponseDto, GetSignInResponseDto } from 'src/apis/dto/response/customer';
import { useHealthSchedulStroe, useSignInCustomerStroe } from 'src/stores';
import CommunityBoard from 'src/components/Board';
import { SignInCustomer } from 'src/types';
import dayjs, { Dayjs } from 'dayjs';
import Calendar from 'src/components/MiniCalender';
import MiniCalendar from 'src/components/MiniCalender';
import { PatchUserMuscleFatRequestDto } from 'src/apis/dto/request/customer';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { GetHealthScheduleListResponseDto } from 'src/apis/dto/response/schedule';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);


interface SignInCustomerProps{
    customer: SignInCustomer;
}

// component: 로그인 후 개인 정보 박스 컴포넌트 //
function CustomerComponent({customer}: SignInCustomerProps){

    // state: cookie 상태 //
    const [cookies] = useCookies();
    // state: customer 아이디 상태 //
    const {userId} = useParams();
    // state: 로그인 유저 정보 상태 //
    const {signInCustomer, setSignInCustomer} = useSignInCustomerStroe();
    // state: 고객 정보 상태 //
    const [profileImage, setProfileImage] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [personalGoals, setPersonalGoals] = useState<string>('');
    
    // function: 네비게이터 변경 함수 //
    const navigator = useNavigate();

    // function: get customer response 처리 함수 //
    const getSignInCustomerResponse = (responseBody: GetCustomerMyPageResponseDto | ResponseDto | null) => {
        const message = 
        !responseBody ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.':
        responseBody.code === 'NI' ? '로그인 유저 정보가 존재하지 않습니다.':
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
        responseBody.code === 'DBE' ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.': '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if(!isSuccessed) {
            alert(message);
            setSignInCustomer(null);
            navigator(MAIN_ABSOLUTE_PATH);
            return;
    }
        const { profileImage, name, nickname, personalGoals } = responseBody as  GetCustomerMyPageResponseDto;
        setProfileImage(profileImage);
        setName(name);
        setNickname(nickname);
        setPersonalGoals(personalGoals);
    };


    // effect: 쿠키 유효성 검사 및 사용자 정보 요청 //
    useEffect(() => {
        if(!customer.userId)return;
        const accessToken = cookies[ACCESS_TOKEN];
        if(!accessToken) return;

        getCustomerMyPageRequest(customer.userId, accessToken).then(getSignInCustomerResponse);
        
    }, [customer.userId, cookies])

    // render: 로그인 후 메인 개인정보 박스 컴포넌트 렌더링 //
    return (
        <div className='login-box'>
            <div className='login-logo-image-box'>
                <div className='login-logo-image'></div>
            </div>
            <div className='login-customer-box'>
                <div className='login-customer-left-box'>
                    <div className="login-customer-image-box">
                        <div className='login-customer-image' style={{ backgroundImage: `url(${profileImage})` }}></div>
                    </div>
                    <div className='login-customer-big-detail-box'>
                        <div className="login-customer-detail-box">
                            <div className="login-customer-name">이름</div>
                            <div className="login-customer-detail-name">{name}</div>
                        </div>
                        <div className="login-customer-detail-box">
                            <div className="login-customer-nickname">닉네임</div>
                            <div className="login-customer-detail-nickname">{nickname}</div>
                        </div>
                    </div>
                </div>
                <div className="login-cutomer-right-box">
                    <div className="login-customer-big-personal-goals-box">
                        <div className="login-customer-personal-goals-box">
                            <div className="login-customer-personal-goals-text">개인목표</div>
                        </div>
                    </div>
                        <div className="login-customer-personal-goals-detail-box">
                            <div className="login-customer-personal-goals-detail">{personalGoals}</div>
                        </div>
                    
                </div>
            </div>
        </div>
    )
}

// component: 로그인 상자 컴포넌트 //
function SignInComponent(){

    // state: 쿠키 상태 //
    const [cookies, setCookies] = useCookies();
    // state: 로그인 입력 정보 상태 //
    const [userId, setUserId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    // state: 로그인 입력 메세지 상태 //
    const [message, setMessage] = useState<string>('');
    // state: Query Parameyer 상태 //
    const[queryParam] = useSearchParams();
    const snsId = queryParam.get('snsId');
    const joinPath = queryParam.get('joinPath');
    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: 로그인 Response 처리 함수 //
    const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '아이디와 비밀번호를 모두 입력하세요.' :
            responseBody.code === 'SF' ? '로그인 정보가 일치하지 않습니다.':
            responseBody.code === 'TCF' ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if(!isSuccessed){
            setMessage(message);
            return;
        }

        const {accessToken, expiration} = responseBody as SignInResponseDto;
        const expires = new Date(Date.now() + (expiration * 1000));
        setCookies(ACCESS_TOKEN, accessToken, {path: ROOT_PATH, expires});

        navigator(MAIN_PATH);
    };

    // event handler: 아이디 변경 이벤트 처리 //
    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setUserId(value);
    }

    // event handler: 비밀번호 변경 이벤트 처리 //
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const{value} = event.target;
        setPassword(value);
    };

    // event handler: SNS 버튼 클릭 이벤트 처리 //
    const onSnsButtonClickHandler = (sns: 'kakao' | 'naver' ) => {
        window.location.href = `http://localhost:4000/api/v1/auth/sns-sign-in/${sns}`;
    }

    // event handler: 로그인 버튼 클릭 이벤트 처리 //
    const onSignInButtonClickHandler = () => {
        if(!userId || !password) return;

        const requestBody: SignInRequestDto = {userId, password};
        signInRequest(requestBody).then(signInResponse);
    }
    // event handler: 회원가입 버튼 클릭 이벤트 처리 //
    const onSignUpButtonClickHandler = () => {
        navigator(SIGN_UP_ABSOLUTE_PATH);
        };
    
    // effect: 아이디 및 비밀번호 변경시 실행할 함수 //
    useEffect(() => {
        setMessage('');
    }, [userId, password]);

    // effect: 첫 로드시에 Query Param의 snsId와 joinPath 존재시 회원가입 화면전환 함수 //
    useEffect(()=> {
        if (snsId && joinPath) navigator(SIGN_UP_PATH);
    }, []);

    // render: 로그인 전 메인 화면 컴포넌트 렌더링 //
    return(
        <div className='login-box'>
            <div className='login-logo-image-box'>
                <div className='login-logo-image'></div>
            </div>
                <div className='login-big-box'>
                    <div className='login-middle-box'>
                        <MainInputBox value={userId} onChange={onIdChangeHandler} message='' messageError type='text' label='아이디' placeholder='아이디를 입력해주세요' />
                        <MainInputBox value={password} onChange={onPasswordChangeHandler} message={message} messageError type='password' label = '비밀번호' placeholder='비밀번호를 입력해주세요' />
                    </div>
                        <div className='login-sign-up-button-box'>
                            <div className='login-button-box'>
                                <div className='login-button-top'onClick={onSignInButtonClickHandler}>
                                    <div className='login-button-text'>로그인</div>
                                </div>
                            </div>
                            <div className='sign-up-button-box' onClick={onSignUpButtonClickHandler}>
                                <div className='sign-up-button-text'>회원가입</div>
                            </div>
                        </div>
                        <div className='sns-login-big-box'>
                            <div className='sns-login-text-box'>
                                <div className='sns-login-text'>SNS 로그인</div>
                            </div>
                            <div className='sns-login-button-box'>
                                <div className='sns-login-kakao-button-box'>
                                    <div className='sns-login-kakao-button-image'onClick={()=> onSnsButtonClickHandler('kakao')}></div>
                                </div>
                                <div className='sns-login-naver-button-box'>
                                    <div className='sns-login-naver-button-image'onClick={()=> onSnsButtonClickHandler('naver')}></div>
                                </div>
                            </div>
                        </div>
                </div>
        </div>
    )

};

// component: 신체정보 컴포넌트 //
function MucleFat({ userId }: { userId?: string }) {

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: 사용자 정보 상태 //
    const [weight, setWeight] = useState<string>('');
    const [skeletalMuscleMass, setSkeletalMuscleMass] = useState<string>('');
    const [bodyFatMass, setBodyFatMass] = useState<string>('');

    // state: 차트 데이터 설정 //
    const dataValues = [weight, skeletalMuscleMass, bodyFatMass].map(Number);
    const maxValue = Math.max(...dataValues);
    const stepSize = maxValue ? maxValue * 0.2 : 1; // 최대값의 20% 설정
    const chartData = {
        labels: ['몸무게', '골격근량', '체지방량'],
        datasets: [{
            data: dataValues,
            backgroundColor: 'rgba(53, 162, 235, 0.6)',
        }],
    };

    // state: 차트 옵션 설정 //
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y' as const,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 14,
                    },
                    color: 'black',
                },
            },
            x: {
                beginAtZero: true,
                ticks: {
                    stepSize: stepSize, // 최대값의 20%로 설정
                    font: {
                        size: 14,
                    },
                    color: 'black',
                    callback: (value: string | number) => Math.floor(Number(value)), // 소수점 아래를 없애고 정수로 표시
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    // function: get customer response 처리 함수 //
    const getCustomerResponse = (responseBody: GetCustomerMyPageResponseDto | ResponseDto | null) => {
        const message = 
        !responseBody ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.':
        responseBody.code === 'NI' ? '로그인 유저 정보가 존재하지 않습니다.':
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
        responseBody.code === 'DBE' ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.': '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';

        if(!isSuccessed) {
            alert(message);
            return;
        };

        const { weight, skeletalMuscleMass, bodyFatMass } = responseBody as  GetCustomerMyPageResponseDto;
        setWeight(weight);
        setSkeletalMuscleMass(skeletalMuscleMass);
        setBodyFatMass(bodyFatMass);

    };


    // effect: 쿠키 유효성 검사 및 사용자 정보 요청 //
    useEffect(()=>{
        if(!userId) return;
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        getCustomerMyPageRequest(userId, accessToken).then(getCustomerResponse);
    }, [userId]);

    // render: 신체정보 컴포넌트 렌더딩 //
    return (
        <div className='main-user-muscle-fat'>
            <div className='chart-top'>
                <div className='chart-title'>골격근 - 지방분석 </div>
            </div>
            <div className='chart-container'>
                <Bar data={chartData} options={options} style={{width:'860px', height:'300px'}}/>
            </div>
        </div>
    );
}

// component: 로그인 전 메인 화면 컴포넌트 //
export default function Main() {

    // state: 쿠키 상태 //
    const [cookies] = useCookies();
    // state: 로그인 유저 정보 상태 //
    const {signInCustomer, setSignInCustomer} = useSignInCustomerStroe();
    // state: 달력 정보 상태 //
    const [selectDate, setSelectDate] = useState<Dayjs>(dayjs());
    const {healthScheduleList, setHealthScheduleList} = useHealthSchedulStroe();

    // 현재 사용자가 로그인되어 있는지 확인하기 위해 accessToken을 쿠키에서 가져온다 //
    const isLoggedIn = !!signInCustomer;

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    const getHealthScheduleListResponse = (responseBody: GetHealthScheduleListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.': '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if(!isSuccessed){
            alert(message);
            return;
        }

        const {healthSchedulelist} = responseBody as GetHealthScheduleListResponseDto;
        setHealthScheduleList(healthSchedulelist);
    }

    // event handler: 켈린더 버튼 클릭 이벤트 처리 //
    const onCalendarButtonClickHandler = () => {
        if(!signInCustomer) return;
        navigator(SCHEDULE_ABSOLUTE_DATH);
    }

    // effect: cookie의 accessToken 값이 변경될 때마다 로그인 유저 정보를 요청하는 함수 //
    useEffect(() => {
        const accessToken = cookies[ACCESS_TOKEN];
        if(accessToken) {   
            getSignInRequest(accessToken).then((responseBody: GetSignInResponseDto | ResponseDto | null) => {
                const message = 
                    !responseBody ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.':
                    responseBody.code === 'NI' ? '로그인 유저 정보가 존재하지 않습니다.':
                    responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                    responseBody.code === 'DBE' ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.': '';
                    
                const isSuccessed = responseBody !== null && responseBody.code === 'SU';

                if(!isSuccessed) {
                    alert(message);
                    navigator(MAIN_ABSOLUTE_PATH);
                    return;
                }

                const {userId, name, nickname, profileImage, personalGoals} = responseBody as GetSignInResponseDto;
                setSignInCustomer({userId, name, nickname, profileImage, personalGoals});
            });
            
        getHealthScheduleListRequest(accessToken).then(getHealthScheduleListResponse)
        } else {
            setSignInCustomer(null);
        }
        
    }, [cookies[ACCESS_TOKEN]]);


    // render: 로그인 전 메인 화면 컴포넌트 //
    return (
        <div id='main-wrapper'>
            <div className='main-detail-box'>
                <div className='main-top-detail-box'>
                    <div className='main-image'></div>
                    <div className='main-top-right-detail-box'>
                        {isLoggedIn ? <CustomerComponent customer={signInCustomer}/> : <SignInComponent />}
                        <div className='calendar-box'onClick={onCalendarButtonClickHandler}>
                            <MiniCalendar selectDate={selectDate} setSelectDate={setSelectDate} schedules={healthScheduleList} setSchedules={setHealthScheduleList} />
                        </div>
                    </div>
                </div>
                <div className='main-under-detail-box'>
                    <CommunityBoard />
                    <div className='main-user-detail-grap-box'>
                        <MucleFat userId={signInCustomer?.userId}/>
                    </div>
                </div>
            </div>
        </div>
    )
}