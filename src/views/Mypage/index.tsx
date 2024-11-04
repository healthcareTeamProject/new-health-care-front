import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router';
import { fileUploadRequest, getCustomerMyPageRequest, nicknameCheckRequest, patchCustomerRequest } from 'src/apis';
import { ACCESS_TOKEN } from 'src/constant';
import { GetCustomerMyPageResponseDto } from 'src/apis/dto/response/customer';
import { ResponseDto } from 'src/apis/dto/response';
import { useSignInCustomerStroe } from 'src/stores';
import InputBox from 'src/components/InputBox';
import { NicknameCheckRequestDto } from 'src/apis/dto/request/auth';
import { PatchCustomerRequestDto } from 'src/apis/dto/request/customer';
import { render } from '@testing-library/react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface changePersonalProps {
    onPersonalChange: () => void;
}

interface changeMucleFatProps {
    onMucleFatChange: () => void;
}


// component: 개인정보 컴포넌트 //
function Personal({ onPersonalChange }: changePersonalProps) {

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
    }, [userId, cookies]);

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
                    <div className='personal-goals-box-icon' onClick={onPersonalChange}></div>
                    <div className='personal-goals-box-buttom'>
                        <div className='personal-goals-box-buttom-title'>개인목표</div>
                        <textarea className='personal-goals-box-buttom-content' value={personalGoals} onChange={(e) => setPersonalGoals(e.target.value)} placeholder='개인목표' disabled />
                    </div>
                </div>
            </div>
        </div>
    )

}

// component: 개인정보 변경 팝업 컴포넌트 //
function PersonalChange({ onPersonalChange }: changePersonalProps) {

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

    // state: 변경할 정보 입력 상태 //
    const [changeProfileImage, setChangeProfileImage] = useState<File|null>(null);
    const [changeName, setChangeName] = useState<string>('');
    const [changeNickname, setChangeNickname] = useState<string>('');
    const [changeHeight, setChangeHeight] = useState<string>('');
    const [changePersonalGoals, setChangePersonalGoals] = useState<string>('');

    // state: 사용자 입력 메시지 상태 //
    const [nicknameMessage, setNicknameMessage] = useState<string>('');

    // state: 사용자 정보 메시지 에러 상태 //
    const [nicknameMessageError, setNicknameMessageError] = useState<boolean>(false);

    // state: 입력값 검증 상태 //
    const [isCheckedNickname, setCheckedNickname] = useState<boolean>(false);

    // state: 이미지 입력 참조 //
    const imageInputRef = useRef<HTMLInputElement|null>(null);

    // state: 프로필 미리보기 URL 상태 //
    const [previewUrl, setPreviewUrl] = useState<string>('');

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

    // function: 닉네임 중복 확인 Response 처리 함수 //
    const nicknameCheckResponse = (responseBody: ResponseDto | null) => {

        const message = 
            !responseBody ? '서버에 문제가 있습니다' : 
            responseBody.code === 'VF' ? '올바른 데이터가 아닙니다' : 
            responseBody.code === 'DN' ? '이미 사용중인 닉네임 입니다' : 
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다' : 
            responseBody.code === 'SU' ? '사용 가능한 닉네임 입니다' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        setNicknameMessage(message);
        setNicknameMessageError(!isSuccessed);
        setCheckedNickname(isSuccessed);

    }

    // function: patch customer response 처리 함수 //
    const patchCustomerResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다' : 
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다' : 
            responseBody.code === 'SU' ? '사용 가능한 닉네임 입니다' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        if(!userId) return;
        const accessToken = cookies[ACCESS_TOKEN];
        if(!accessToken) return;
        onPersonalChange();
    }

    // event handler: 프로필 이미지 클릭 이벤트 처리 //
    const onProfileImageClickHandler = () => {
        const { current } = imageInputRef;
        if (!current) return;
        current.click();
    }

    // event handler: 이미지 변경 이벤트 처리 //
    const onImageInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (!files || !files.length) return;

        const file = files[0];
        setChangeProfileImage(file);

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = () => {
            setPreviewUrl(fileReader.result as string);
        }
    }

    // event handler: 이름 변경 이벤트 처리 //
    const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setChangeName(value);
    };

    // event handler: 닉네임 변경 이벤트 처리 //
    const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setChangeNickname(value);
        setCheckedNickname(false);
        setNicknameMessage('');
    };

    // event handler: 키 변경 이벤트 처리 //
    const onHeightChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const pattern = /^\d*\.?\d*$/;
        const isMatched = pattern.test(value);

        if (isMatched) {
            setChangeHeight(value);
        }

    };

    // event handler: 개인 목표 변경 이벤트 처리 //
    const onUserGoalsChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;

        if (value.length <= 50) {
            setChangePersonalGoals(value);
        }
        console.log(changePersonalGoals);
    };

    // event handler: 닉네임 중복 확인 버튼 클릭 이벤트 처리 //
    const onNicknameCheckClickHandler = () => {
        if (!nickname) return;

        const requestBody: NicknameCheckRequestDto = {
            nickname: changeNickname
        }

        nicknameCheckRequest(requestBody).then(nicknameCheckResponse);

    }

    // event handler: 저장 버튼 클릭 이벤트 처리 //
    const onUpdateButtonClickHandler = async () => {

        if(!previewUrl && !changeName && !changeNickname && !changeHeight && !changePersonalGoals) {
            alert('변경된 값이 없습니다')
            return;
        }

        if (changeNickname) {
            if (!isCheckedNickname) return;
        }

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        let url: string | null = null;
        if (changeProfileImage) {
            const formData = new FormData();
            formData.append('file', changeProfileImage);
            url = await fileUploadRequest(formData);
        }
        url = url ? url : profileImage;

        const requestBody: PatchCustomerRequestDto = {
            profileImage: url,
            name: changeName ? changeName : name, 
            nickname: changeNickname ? changeNickname : nickname, 
            height: changeHeight ? changeHeight : height, 
            personalGoals: changePersonalGoals ? changePersonalGoals : personalGoals
        }
        patchCustomerRequest(requestBody, accessToken).then(patchCustomerResponse);

        // 완료 후 새로고침
        window.location.reload();
    }


    // effect: 쿠키 유효성 검사 및 사용자 정보 요청 //
    useEffect(()=>{
        if(!userId) return;
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        getCustomerMyPageRequest(userId, accessToken).then(getCustomerResponse);
    }, [userId]);

    // render: 개인정보 변경 팝업 컴포넌트 렌더딩 //
    return (
            <div className='personal-pop-up'>
                <div className='pop-up-exit' onClick={onPersonalChange}></div>
                <div className='personal-pop-up-top'>
                    <div className='profile-image' style={{ backgroundImage: previewUrl ? `url(${previewUrl})` : `url(${profileImage})` }} onClick={onProfileImageClickHandler}>
                        <input ref={imageInputRef} style={{ display: 'none' }} type='file' accept='image/*' onChange={onImageInputChangeHandler} />
                    </div>
                    <div className='personal-information'>
                        <div className='name'>
                            <InputBox label='이름' type='text' placeholder={name} value={changeName} onChange={onNameChangeHandler} />
                        </div>
                        <div className='nickname'>
                            <InputBox label='닉네임' type='text' placeholder={nickname} value={changeNickname} messageError={nicknameMessageError} message={nicknameMessage} buttonName='중복 확인' onChange={onNicknameChangeHandler} onButtonClick={onNicknameCheckClickHandler}/>
                        </div>
                        <div className='height'>
                            <InputBox label='키' type='text' placeholder={height} value={changeHeight} onChange={onHeightChangeHandler} />
                        </div>
                    </div>
                </div>
                <div className='personal-goals-box'>
                    <div className='personal-goals-box-title'>개인목표</div>
                    <textarea 
                        className='personal-goals-box-content' 
                        placeholder={personalGoals} 
                        value={changePersonalGoals} 
                        onChange={onUserGoalsChangeHandler}
                    />
                </div>
                <div className='pop-up-update' onClick={onUpdateButtonClickHandler}>저장</div>
            </div>
    )

}

// component: 신체정보 컴포넌트 //
function MucleFat({ onMucleFatChange }: changeMucleFatProps) {

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: customer 아이디 상태 //
    const {userId} = useParams();

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
        <div className='user-muscle-fat'>
            <div className='chart-top'>
                <div className='chart-title'>골격근 - 지방분석 </div>
                <div className='chart-icon' onClick={onMucleFatChange}></div>
            </div>
            <div className='chart-container'>
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
}

// component: 신체정보 변경 팝업 컴포넌트 //
function MucleFatChange({ onMucleFatChange }: changeMucleFatProps) {

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: customer 아이디 상태 //
    const {userId} = useParams();

    // state: 사용자 정보 상태 //
    const [weight, setWeight] = useState<string>('');
    const [skeletalMuscleMass, setSkeletalMuscleMass] = useState<string>('');
    const [bodyFatMass, setBodyFatMass] = useState<string>('');

    // state: 변경할 정보 상태 //
    const [changeWeight, setChangeWeight] = useState<string>('');
    const [changeSkeletalMuscleMass, setChangeSkeletalMuscleMass] = useState<string>('');
    const [changeBodyFatMass, setChangeBodyFatMass] = useState<string>('');

    // event handler: 키 변경 이벤트 처리 //
    const onWeightChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const pattern = /^\d*\.?\d*$/;
        const isMatched = pattern.test(value);

        if (isMatched) {
            setChangeWeight(value);
        }

    };

    // event handler: 키 변경 이벤트 처리 //
    const onSkeletalMuscleMassChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const pattern = /^\d*\.?\d*$/;
        const isMatched = pattern.test(value);

        if (isMatched) {
            setChangeSkeletalMuscleMass(value);
        }

    };

    // event handler: 키 변경 이벤트 처리 //
    const onBodyFatMassChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const pattern = /^\d*\.?\d*$/;
        const isMatched = pattern.test(value);

        if (isMatched) {
            setChangeBodyFatMass(value);
        }

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

    // function: patch user muscle fat response 처리 함수 //

    // function: post user muscle fat response 처리 함수 //


    // effect: 쿠키 유효성 검사 및 사용자 정보 요청 //
    useEffect(()=>{
        if(!userId) return;
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        getCustomerMyPageRequest(userId, accessToken).then(getCustomerResponse);
    }, [userId]);

    // render: 신체정보 변경 팝업 컴포넌트 렌더딩 //
    return (
        <div className='mucleFat-pop-up'>
                <div className='pop-up-exit' onClick={onMucleFatChange}></div>
                <div className='mucleFat-pop-up-top'>
                    <div className='pop-up-mucleFat-title'>신체 정보</div>
                    <div className='pop-up-mucleFat-information'>
                        <div className='weight'>
                            <InputBox label='몸무게' type='text' placeholder={weight} value={changeWeight} onChange={onWeightChangeHandler} />
                        </div>
                        <div className='skeletalMuscleMass'>
                            <InputBox label='골격근량' type='text' placeholder={skeletalMuscleMass} value={changeSkeletalMuscleMass} onChange={onSkeletalMuscleMassChangeHandler} />
                        </div>
                        <div className='bodyFatMass'>
                            <InputBox label='체지방량' type='text' placeholder={bodyFatMass} value={changeBodyFatMass} onChange={onBodyFatMassChangeHandler} />
                        </div>
                    </div>
                </div>
                <div className='pop-up-update'>저장</div>
            </div>
    )

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

    // state: 팝업 상태창 상태 //
    const [personalChangePopUp, setPersonalChangePopUp] = useState(false);
    const [mucleFatChangePopUp, setMucleFatChangePopUp] = useState(false);
    const [threeMajorLiftChangePopUp, setThreeMajorLiftChangePopUp] = useState(false);

    const onPersonalChangePopUp = () => {
        setPersonalChangePopUp(!personalChangePopUp);
    }

    const onMucleFatChangePopUp = () => {
        setMucleFatChangePopUp(!mucleFatChangePopUp);
    }

    const onThreeMajorLiftChangePopUp = () => {
        setThreeMajorLiftChangePopUp(!threeMajorLiftChangePopUp);
    }

    // render: 마이페이지 컴포넌트 렌더딩 //
    return (
        <div id='my-wrapper'>
            
            <div className='my-page-left'>
                <div className='my-page-title'>마이페이지</div>
            </div>
            <div className='my-page-main'>
                <div className='top'>
                    <Personal onPersonalChange={onPersonalChangePopUp} />
                    <MucleFat onMucleFatChange={onMucleFatChangePopUp}/>
                </div>
                <div className='buttom'>
                    <div className='buttom-left'>
                        <ThreeMajorLift />
                        <Board />
                    </div>
                    <Graph />
                </div>
            </div>
            {personalChangePopUp ? (
            <div className='pop-up active'>
                <PersonalChange onPersonalChange={onPersonalChangePopUp} />
            </div>)
            : (<div></div>)
            }
            {mucleFatChangePopUp ? (
            <div className='pop-up active'>
                <MucleFatChange onMucleFatChange={onMucleFatChangePopUp} />
            </div>)
            : (<div></div>)
            }

        </div>

    )
}
