import React, { useEffect, useState } from 'react'
import './style.css'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router';
import { getCustomerMyPageRequest } from 'src/apis';
import { ACCESS_TOKEN } from 'src/constant';
import { GetCustomerMyPageResponseDto } from 'src/apis/dto/response/customer';
import { ResponseDto } from 'src/apis/dto/response';
import { useSignInCustomerStroe } from 'src/stores';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// component: 개인정보 컴포넌트 //
function Personal() {

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: customer 아이디 상태 //
    const {userId} = useParams();

    // state: 로그인 유저 상태 //
    const {signInCustomer} = useSignInCustomerStroe();

    // state: 사용자 정보 상태 //
    const [profileImage, setProfileImage] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [personalGoals, setPersonalGoals] = useState<string>('');


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
        }

        const { profileImage, name, nickname, height, personalGoals } = responseBody as  GetCustomerMyPageResponseDto;
        setProfileImage(profileImage);
        setName(name);
        setNickname(nickname);
        setHeight(height);
        setPersonalGoals(personalGoals);

    };


    // effect: 쿠키 유효성 검사 및 사용자 정보 요청 //
    useEffect(()=>{
        if(!userId) return;
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        getCustomerMyPageRequest(userId, accessToken).then(getCustomerResponse);
    }, [userId]);

    // render: 개인정보 컴포넌트 렌더딩 //
    return (
        <div className='personal'>
            <div className='personal-logo'></div>
            <div className='personal-buttom'>
                <div className='profile-image' style={{ backgroundImage: `url(${profileImage})` }}></div>
                <div className='personal-information'>
                    <div className='name'>
                        <div className='name-title'>이름</div>
                        <div className='name-value'>{name}</div>
                    </div>
                    <div className='nickname'>
                        <div className='nickname-title'>닉네임</div>
                        <div className='nickname-value'>{nickname}</div>
                    </div>
                    <div className='height'>
                        <div className='height-title'>키</div>
                        <div className='height-value'>{height}</div>
                    </div>
                </div>
                <div className='personal-goals-box'>
                    <div className='personal-goals-box-icon'></div>
                    <div className='personal-goals-box-buttom'>
                        <div className='personal-goals-box-buttom-title'>개인목표</div>
                        <input className='personal-goals-box-buttom-content' value={personalGoals} onChange={(e) => setPersonalGoals(e.target.value)} placeholder='개인목표' disabled />
                    </div>
                </div>
            </div>
        </div>
    )

}

// component: 개인정보 변경 팝업 컴포넌트 //
function PersonalChage() {

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: customer 아이디 상태 //
    const {userId} = useParams();

    // state: 로그인 유저 상태 //
    const {signInCustomer} = useSignInCustomerStroe();

    // state: 사용자 정보 상태 //
    const [profileImage, setProfileImage] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [personalGoals, setPersonalGoals] = useState<string>('');


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
        }

        const { profileImage, name, nickname, height, personalGoals } = responseBody as  GetCustomerMyPageResponseDto;
        setProfileImage(profileImage);
        setName(name);
        setNickname(nickname);
        setHeight(height);
        setPersonalGoals(personalGoals);

    };


    // effect: 쿠키 유효성 검사 및 사용자 정보 요청 //
    useEffect(()=>{
        if(!userId) return;
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        getCustomerMyPageRequest(userId, accessToken).then(getCustomerResponse);
    }, [userId]);

    // render: 개인정보 컴포넌트 렌더딩 //
    return (
        <div className='popup'>
            <div className='personal'>
                <div className='personal-logo'></div>
                <div className='personal-buttom'>
                    <div className='profile-image' style={{ backgroundImage: `url(${profileImage})` }}></div>
                    <div className='personal-information'>
                        <div className='name'>
                            <div className='name-title'>이름</div>
                            <div className='name-value'>{name}</div>
                        </div>
                        <div className='nickname'>
                            <div className='nickname-title'>닉네임</div>
                            <div className='nickname-value'>{nickname}</div>
                        </div>
                        <div className='height'>
                            <div className='height-title'>키</div>
                            <div className='height-value'>{height}</div>
                        </div>
                    </div>
                    <div className='personal-goals-box'>
                        <div className='personal-goals-box-icon'></div>
                        <div className='personal-goals-box-buttom'>
                            <div className='personal-goals-box-buttom-title'>개인목표</div>
                            <input className='personal-goals-box-buttom-content' value={personalGoals} onChange={(e) => setPersonalGoals(e.target.value)} placeholder='개인목표' disabled />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}


// component: 신체정보 컴포넌트 //
function UserMucleFat() {

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: customer 아이디 상태 //
    const {userId} = useParams();

    // state: 사용자 정보 상태 //
    const [weight, setWeight] = useState<string>('');
    const [skeletalMuscleMass, setSkeletalMuscleMass] = useState<string>('');
    const [bodyFatMass, setBodyFatMass] = useState<string>('');

    // state: 차트 데이터 설정 //
    const chartData = {
        labels: ['몸무게', '골격근량', '체지방량'],
        datasets: [{
            data: [weight, skeletalMuscleMass, bodyFatMass].map(Number), // 숫자로 변환
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
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
                    stepSize: 20,
                    font: {
                        size: 14,
                    },
                    color: 'black',
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
        <div className='user-muscle-fat'>
            <div className='chart-top'>
                <div className='chart-title'>골격근 - 지방분석 </div>
                <div className='chart-icon'></div>
            </div>
            <div className='chart-container'>
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
}


// component: 3대측정 컴포넌트 //
function ThreeMajorLift() {

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: customer 아이디 상태 //
    const {userId} = useParams();

    // state: 사용자 정보 상태 //
    const [deadlift, setDeadlift] = useState<string>('');
    const [benchPress, setBenchPress] = useState<string>('');
    const [squat, setSquat] = useState<string>('');

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
        }

        const { deadlift, benchPress, squat } = responseBody as  GetCustomerMyPageResponseDto;
        
        setDeadlift(deadlift);
        setBenchPress(benchPress);
        setSquat(squat);

    };


    // effect: 쿠키 유효성 검사 및 사용자 정보 요청 //
    useEffect(()=>{
        if(!userId) return;
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        getCustomerMyPageRequest(userId, accessToken).then(getCustomerResponse);
    }, [userId]);

    // render: 3대측정 컴포넌트 렌더딩 //
    return (
        <div className='three-major-lift'>
            <div className='three-major-lift-top'>
                <div className='three-major-lift-top-title'>3대 측정</div>
                <div className='three-major-lift-top-icon'></div>
            </div>
            <div className='three-major-lift-buttom'>
                <div className='three-major-lift-buttom-title'>
                    <div className='right-border'>밴치프레스</div>
                    <div className='right-border'>데드리프트</div>
                    <div>스쿼트</div>
                </div>
                <div className='three-major-lift-buttom-contents'>
                    <div className='right-border'>{benchPress}</div>
                    <div className='right-border'>{deadlift}</div>
                    <div>{squat}</div>
                </div>
            </div>
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

            <div className='pop-up active'>
                <PersonalChage />
            </div>

        </div>

    )
}
