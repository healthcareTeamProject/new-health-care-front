import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router';
import { fileUploadRequest, getCustomerMyPageRequest, getUserMuscleFatListRequest, getUserThreeMajorLiftListRequest, nicknameCheckRequest, patchCustomerRequest, patchUserMuscleFatRequest, patchUserThreeMajorLiftRequest } from 'src/apis';
import { ACCESS_TOKEN } from 'src/constant';
import { GetCustomerMyPageResponseDto, GetUserMuscleFatListResponseDto, GetUserThreeMajorLiftListResponseDto } from 'src/apis/dto/response/customer';
import { ResponseDto } from 'src/apis/dto/response';
import { useSignInCustomerStroe } from 'src/stores';
import InputBox from 'src/components/InputBox';
import { NicknameCheckRequestDto } from 'src/apis/dto/request/auth';
import { PatchCustomerRequestDto, PatchUserMuscleFatRequestDto, PatchUserThreeMajorLiftRequestDto } from 'src/apis/dto/request/customer';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface changePersonalProps {
    onPersonalChange: () => void;
}

interface changeMucleFatProps {
    onMucleFatChange: () => void;
}

interface changeThreeMajorLiftProps {
    onThreeMajorLiftChange: () => void;
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
    }, [userId, cookies]);

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
    const patchUserMuscleFatResponse = (responseBody: ResponseDto | null) => {
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
        onMucleFatChange();
    }

    // event handler: 몸무게 변경 이벤트 처리 //
    const onWeightChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const pattern = /^\d*\.?\d*$/;
        const isMatched = pattern.test(value);

        if (isMatched) {
            setChangeWeight(value);
        }

    };

    // event handler: 골격근량 변경 이벤트 처리 //
    const onSkeletalMuscleMassChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const pattern = /^\d*\.?\d*$/;
        const isMatched = pattern.test(value);

        if (isMatched) {
            setChangeSkeletalMuscleMass(value);
        }

    };

    // event handler: 체지방량 변경 이벤트 처리 //
    const onBodyFatMassChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const pattern = /^\d*\.?\d*$/;
        const isMatched = pattern.test(value);

        if (isMatched) {
            setChangeBodyFatMass(value);
        }

    };

    // event handler: 저장 버튼 클릭 이벤트 처리 //
    const onUpdateButtonClickHandler = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;
        if (!userId) return;

        const requestBody: PatchUserMuscleFatRequestDto = {
            userId: userId,
            weight: changeWeight ? changeWeight : weight, 
            skeletalMuscleMass: changeSkeletalMuscleMass ? changeSkeletalMuscleMass : skeletalMuscleMass, 
            bodyFatMass: changeBodyFatMass ? changeBodyFatMass : bodyFatMass, 
        }
        patchUserMuscleFatRequest(userId,requestBody, accessToken).then(patchUserMuscleFatResponse);

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
                <div className='pop-up-update' onClick={onUpdateButtonClickHandler}>저장</div>
            </div>
    )

}


// component: 3대측정 컴포넌트 //
function ThreeMajorLift({ onThreeMajorLiftChange }: changeThreeMajorLiftProps) {

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: customer 아이디 상태 //
    const {userId} = useParams();

    // state: 사용자 정보 상태 //
    const [benchPress, setBenchPress] = useState<string>('');
    const [deadlift, setDeadlift] = useState<string>('');
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

        const { benchPress, deadlift, squat } = responseBody as  GetCustomerMyPageResponseDto;
        
        setBenchPress(benchPress);
        setDeadlift(deadlift);
        setSquat(squat);

    };


    // effect: 쿠키 유효성 검사 및 사용자 정보 요청 //
    useEffect(()=>{
        if(!userId) return;
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        getCustomerMyPageRequest(userId, accessToken).then(getCustomerResponse);
    }, [userId, cookies]);

    // render: 3대측정 컴포넌트 렌더딩 //
    return (
        <div className='three-major-lift'>
            <div className='three-major-lift-top'>
                <div className='three-major-lift-top-title'>3대 측정</div>
                <div className='three-major-lift-top-icon' onClick={onThreeMajorLiftChange}></div>
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


// component: 3대측정 변경 팝업 컴포넌트 //
function ThreeMajorLiftChange({ onThreeMajorLiftChange }: changeThreeMajorLiftProps) {

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: customer 아이디 상태 //
    const {userId} = useParams();

    // state: 사용자 정보 상태 //
    const [benchPress, setBenchPress] = useState<string>('');
    const [deadlift, setDeadlift] = useState<string>('');
    const [squat, setSquat] = useState<string>('');

    // state: 변경할 정보 상태 //
    const [changeBenchPress, setChangeBenchPress] = useState<string>('');
    const [changeDeadlift, setChangeDeadlift] = useState<string>('');
    const [changeSquat, setChangeSquat] = useState<string>('');

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

        const { benchPress, deadlift, squat } = responseBody as  GetCustomerMyPageResponseDto;
        
        setBenchPress(benchPress);
        setDeadlift(deadlift);
        setSquat(squat);

    };

    // function: patch user muscle fat response 처리 함수 //
    const patchUserThreeMajorLiftResponse = (responseBody: ResponseDto | null) => {
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
        onThreeMajorLiftChange();
    }

    // event handler: 벤치프레스 변경 이벤트 처리 //
    const onBenchPressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const pattern = /^\d*\.?\d*$/;
        const isMatched = pattern.test(value);

        if (isMatched) {
            setChangeBenchPress(value);
        }

    };

    // event handler: 데드리프트 변경 이벤트 처리 //
    const onDeadliftChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const pattern = /^\d*\.?\d*$/;
        const isMatched = pattern.test(value);

        if (isMatched) {
            setChangeDeadlift(value);
        }

    };

    // event handler: 스쿼트 변경 이벤트 처리 //
    const onSquatChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const pattern = /^\d*\.?\d*$/;
        const isMatched = pattern.test(value);

        if (isMatched) {
            setChangeSquat(value);
        }

    };

    // event handler: 저장 버튼 클릭 이벤트 처리 //
    const onUpdateButtonClickHandler = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;
        if (!userId) return;

        const requestBody: PatchUserThreeMajorLiftRequestDto = {
            userId: userId,
            benchPress: changeBenchPress ? changeBenchPress : benchPress, 
            deadlift: changeDeadlift ? changeDeadlift : deadlift, 
            squat: changeSquat ? changeSquat : squat, 
            }

        patchUserThreeMajorLiftRequest(userId, requestBody, accessToken).then(patchUserThreeMajorLiftResponse);

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

    // render: 3대측정 변경 팝업 컴포넌트 렌더딩 //
    return (
        <div className='threeMajorLift-pop-up'>
                <div className='pop-up-exit' onClick={onThreeMajorLiftChange}></div>
                <div className='threeMajorLift-pop-up-top'>
                    <div className='pop-up-threeMajorLift-title'>신체 정보</div>
                    <div className='pop-up-threeMajorLift-information'>
                        <div className='benchPress'>
                            <InputBox label='벤치프레스' type='text' placeholder={benchPress} value={changeBenchPress} onChange={onBenchPressChangeHandler} />
                        </div>
                        <div className='deadlift'>
                            <InputBox label='데드리프트' type='text' placeholder={deadlift} value={changeDeadlift} onChange={onDeadliftChangeHandler} />
                        </div>
                        <div className='Squat'>
                            <InputBox label='스쿼트' type='text' placeholder={squat} value={changeSquat} onChange={onSquatChangeHandler} />
                        </div>
                    </div>
                </div>
                <div className='pop-up-update' onClick={onUpdateButtonClickHandler}>저장</div>
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


// component: 리스트 그래프 컴포넌트 //
function Graph() {

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: customer 아이디 상태 //
    const { userId } = useParams();

    // state: 그래프 선택 상태 //
    const [selectGraphs, setSelectGraphs] = useState<boolean>(true);

    // state: 신체 정보 리스트 상태 //
    const [weightList, setWeightList] = useState<string[]>([]);
    const [skeletalMuscleMassList, setSkeletalMuscleMassList] = useState<string[]>([]);
    const [bodyFatMassList, setBodyFatMassList] = useState<string[]>([]);
    const [userMuscleFatDate, setUserMuscleFatDate] = useState<string[]>([]);

    // state: 3대 측정 리스트 상태 //
    const [benchPressList, setBenchPressList] = useState<string[]>([]);
    const [deadliftList, setDeadliftList] = useState<string[]>([]);
    const [squatList, setSquatList] = useState<string[]>([]);
    const [userThreeMajorLiftDateList, setUserThreeMajorLiftDateList] = useState<string[]>([]);

    // state: 신체 정보 리스트 차트 상태 //
    const userMuscleFatData = {
        labels: userMuscleFatDate,
        datasets: [
            {
                label: '체중',
                data: weightList,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
                tension: 0,
                borderWidth: 3
            },
            {
                label: '골격근량',
                data: skeletalMuscleMassList,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false,
                tension: 0,
                borderWidth: 3
            },
            {
                label: '체지방량',
                data: bodyFatMassList,
                borderColor: 'rgba(53, 162, 235, 1)',
                backgroundColor: 'rgba(53, 162, 235, 0.2)',
                fill: false,
                tension: 0,
                borderWidth: 3
            }
        ]
    };

    // state: 3대 측정 리스트 차트 상태 //
    const userThreeMajorLiftData = {
        labels: userThreeMajorLiftDateList,
        datasets: [
            {
                label: '벤치프레스',
                data: benchPressList,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
                tension: 0,
                borderWidth: 3
            },
            {
                label: '데드리프트',
                data: deadliftList,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false,
                tension: 0,
                borderWidth: 3
            },
            {
                label: '스쿼트',
                data: squatList,
                borderColor: 'rgba(53, 162, 235, 1)',
                backgroundColor: 'rgba(53, 162, 235, 0.2)',
                fill: false,
                tension: 0,
                borderWidth: 3
            }
        ]
    };

    // state: 그래프 스타일 상태 //
    const options = {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                }
            },
            y: {
                title: {
                    display: true,
                }
            }
        }
    };

    // function: get user muscle fat list response 처리 함수
    const getUserMuscleFatListResponse = (responseBody: GetUserMuscleFatListResponseDto | ResponseDto | null) => {
        const message =
        !responseBody ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.' :
            responseBody.code === 'NI' ? '로그인 유저 정보가 존재하지 않습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.' : '';

            const isSuccessed = responseBody !== null && responseBody.code === 'SU';

        if (!isSuccessed) {
            alert(message);
            return;
        }

        // 서버에서 받은 여러 데이터로 상태 업데이트
        const { userMuscleFatLists } = responseBody as GetUserMuscleFatListResponseDto;

        if (userMuscleFatLists && Array.isArray(userMuscleFatLists) && userMuscleFatLists.length > 0) {
            const weight: string[] = [];
            const skeletalMuscleMass: string[] = [];
            const bodyFatMass: string[] = [];
            const muscleFatDate: string[] = [];

            userMuscleFatLists.forEach((item) => {
                weight.push(item.weight);
                skeletalMuscleMass.push(item.skeletalMuscleMass);
                bodyFatMass.push(item.bodyFatMass);
                muscleFatDate.push(item.userMuscleFatDate);
            });

            // 데이터 포인트 제한 로직
            const maxDataPoints = 6;  // 최대 데이터 포인트 수

            // 데이터가 6개 이하일 경우, 원본 데이터를 그대로 사용
            if (userMuscleFatLists.length <= maxDataPoints) {
                setWeightList(weight);
                setSkeletalMuscleMassList(skeletalMuscleMass);
                setBodyFatMassList(bodyFatMass);
                setUserMuscleFatDate(muscleFatDate);
            } else {
                // 데이터가 6개 이상일 경우, 중간 값에서 균등 간격으로 6개로 조정
                const middleDataCount = maxDataPoints - 2; // 처음과 마지막을 제외한 나머지 데이터 개수

                // 첫 번째와 마지막을 제외한 중간 데이터
                const middleWeight = weight.slice(1, weight.length - 1);
                const middleSkeletalMuscleMass = skeletalMuscleMass.slice(1, skeletalMuscleMass.length - 1);
                const middleBodyFatMass = bodyFatMass.slice(1, bodyFatMass.length - 1);
                const middleMuscleFatDate = muscleFatDate.slice(1, muscleFatDate.length - 1);

                // 균등한 간격으로 중간 데이터 선택 (간격 계산)
                const interval = Math.floor(middleWeight.length / middleDataCount);  // 간격 계산

                let selectedMiddleWeight: string[] = [];
                let selectedMiddleSkeletalMuscleMass: string[] = [];
                let selectedMiddleBodyFatMass: string[] = [];
                let selectedMiddleMuscleFatDate: string[] = [];

                // 간격에 맞춰서 선택
                for (let i = 0; i < middleDataCount; i++) {
                    selectedMiddleWeight.push(middleWeight[i * interval]);  // 일정 간격으로 데이터 선택
                    selectedMiddleSkeletalMuscleMass.push(middleSkeletalMuscleMass[i * interval]);
                    selectedMiddleBodyFatMass.push(middleBodyFatMass[i * interval]);
                    selectedMiddleMuscleFatDate.push(middleMuscleFatDate[i * interval]);
                }

                // 처음과 마지막 값 포함하여 최종 데이터 조합
                const finalWeightList = [weight[0], ...selectedMiddleWeight, weight[weight.length - 1]];
                const finalSkeletalMuscleMassList = [skeletalMuscleMass[0], ...selectedMiddleSkeletalMuscleMass, skeletalMuscleMass[skeletalMuscleMass.length - 1]];
                const finalBodyFatMassList = [bodyFatMass[0], ...selectedMiddleBodyFatMass, bodyFatMass[bodyFatMass.length - 1]];
                const finalMuscleFatDateList = [muscleFatDate[0], ...selectedMiddleMuscleFatDate, muscleFatDate[muscleFatDate.length - 1]];

                setWeightList(finalWeightList);
                setSkeletalMuscleMassList(finalSkeletalMuscleMassList);
                setBodyFatMassList(finalBodyFatMassList);
                setUserMuscleFatDate(finalMuscleFatDateList);
            }
        }

    };

    // function: get user three major lift list response 처리 함수
    const getUserThreeMajorLiftListResponse = (responseBody: GetUserThreeMajorLiftListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.' :
            responseBody.code === 'NI' ? '로그인 유저 정보가 존재하지 않습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.' : '';
    
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    
        if (!isSuccessed) {
            alert(message);
            return;
        }
    
        // 서버에서 받은 여러 데이터로 상태 업데이트
        const { userThreeMajorLiftLists } = responseBody as GetUserThreeMajorLiftListResponseDto;
    
        if (userThreeMajorLiftLists && Array.isArray(userThreeMajorLiftLists) && userThreeMajorLiftLists.length > 0) {
            const benchPress: string[] = [];
            const deadlift: string[] = [];
            const squat: string[] = [];
            const liftDates: string[] = [];
    
            userThreeMajorLiftLists.forEach((item) => {
                benchPress.push(item.benchPress);
                deadlift.push(item.deadlift);
                squat.push(item.squat);
                liftDates.push(item.userThreeMajorLiftDate);
            });
    
            // 데이터 포인트 제한 로직
            const maxDataPoints = 6;  // 최대 데이터 포인트 수를 6으로 설정

            if (userThreeMajorLiftLists.length <= maxDataPoints) {
                // 데이터가 6개 이하일 경우, 해당 개수만큼 원본 데이터를 그대로 사용
                setBenchPressList(benchPress);
                setDeadliftList(deadlift);
                setSquatList(squat);
                setUserThreeMajorLiftDateList(liftDates);
            } else {
                // 데이터가 6개 이상일 경우, 중간 값에서 균등 간격으로 6개로 조정
                const middleDataCount = maxDataPoints - 2; // 처음과 마지막을 제외한 나머지

                const middleBenchPress = benchPress.slice(1, benchPress.length - 1); // 첫 번째와 마지막을 제외한 중간 데이터
                const middleDeadlift = deadlift.slice(1, deadlift.length - 1);
                const middleSquat = squat.slice(1, squat.length - 1);
                const middleLiftDates = liftDates.slice(1, liftDates.length - 1);

                // 균등한 간격으로 중간 데이터 선택 (간격 계산)
                const interval = Math.floor(middleBenchPress.length / middleDataCount);  // 간격 계산

                let selectedMiddleBenchPress: string[] = [];
                let selectedMiddleDeadlift: string[] = [];
                let selectedMiddleSquat: string[] = [];
                let selectedMiddleLiftDates: string[] = [];

                // 간격에 맞춰서 선택
                for (let i = 0; i < middleDataCount; i++) {
                    selectedMiddleBenchPress.push(middleBenchPress[i * interval]);  // 일정 간격으로 데이터 선택
                    selectedMiddleDeadlift.push(middleDeadlift[i * interval]);
                    selectedMiddleSquat.push(middleSquat[i * interval]);
                    selectedMiddleLiftDates.push(middleLiftDates[i * interval]);
                }

                // 처음과 마지막 값 포함하여 최종 데이터 조합
                const finalBenchPressList = [benchPress[0], ...selectedMiddleBenchPress, benchPress[benchPress.length - 1]];
                const finalDeadliftList = [deadlift[0], ...selectedMiddleDeadlift, deadlift[deadlift.length - 1]];
                const finalSquatList = [squat[0], ...selectedMiddleSquat, squat[squat.length - 1]];
                const finalLiftDateList = [liftDates[0], ...selectedMiddleLiftDates, liftDates[liftDates.length - 1]];

                // 상태 업데이트
                setBenchPressList(finalBenchPressList);
                setDeadliftList(finalDeadliftList);
                setSquatList(finalSquatList);
                setUserThreeMajorLiftDateList(finalLiftDateList);
            }
        }
    };

    // event handler: 골격근/ 지방 그래프 선택 //
    const onSelectMuscleFatClickHandler = () => {
        setSelectGraphs(true);
    }

    // event handler: 골격근/ 지방 그래프 선택 //
    const onSelectThreeMajorLiftClickHandler = () => {
        setSelectGraphs(false);
    }

    // effect: 쿠키 유효성 검사 및 사용자 정보 요청
    useEffect(() => {
        if (!userId) return;
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        getUserMuscleFatListRequest(userId, accessToken).then(getUserMuscleFatListResponse);
        getUserThreeMajorLiftListRequest(userId, accessToken).then(getUserThreeMajorLiftListResponse);

    }, [userId, cookies]);


    // render: 리스트 그래프 컴포넌트 렌더딩 //
    return (
        <div className='graph'>
            <div className='graph-top'>
                <div className='graph-title'>계측 변화 그래프</div>
                <div className='graph-select-button-box'>
                    <div className={`muscle-fat-button ${selectGraphs ? 'openGraphs' : ''}`} onClick={onSelectMuscleFatClickHandler}>골격근/지방</div>
                    <div className={`three-major-lift-button ${selectGraphs ? '' : 'openGraphs'}`} onClick={onSelectThreeMajorLiftClickHandler}>3대 측정</div>
                </div>
            </div>
            <div className='graph-bottom'>
                { selectGraphs ? 
                    <Line data={userMuscleFatData} options={options} style={{ width: '100%', height: '100%' }} /> : 
                    <Line data={userThreeMajorLiftData} options={options} style={{ width: '100%', height: '100%' }} />
                }
                
            </div>
        </div>
        
    )

}


// component: 마이페이지 컴포넌트 //
export default function Mypage() {

    // state: cookie 상태 //
    const [cookies] = useCookies();

    const navigate = useNavigate();

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

    // effect: 쿠키 유효성 검사 및 사용자 정보 요청 //
    useEffect(()=>{
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            navigate('/');
        }
    }, [cookies, navigate]);

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
                        <ThreeMajorLift onThreeMajorLiftChange={onThreeMajorLiftChangePopUp} />
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
            {threeMajorLiftChangePopUp ? (
            <div className='pop-up active'>
                <ThreeMajorLiftChange onThreeMajorLiftChange={onThreeMajorLiftChangePopUp} />
            </div>)
            : (<div></div>)
            }

        </div>

    )
}
