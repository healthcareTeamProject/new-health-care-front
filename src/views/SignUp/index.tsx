import React, { ChangeEvent, useEffect, useState } from 'react'
import './style.css'
import InputBox from 'src/components/InputBox'
import TopBar from 'src/layouts/Topbar'

interface SignUpFirstProps {
    onNext: () => void;
}

interface SignUpSecondProps {
    onPrevious: () => void;
}

function SignUpFirst({ onNext }: SignUpFirstProps) {

    // state: 사용자 입력 정보 상태 //
    const [name, setName] = useState<string>('');
    const [id, setId] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordCheck, setPasswordCheck] = useState<string>('');
    const [telNumber, setTelNumber] = useState<string>('');
    const [authNumber, setAuthNumber] = useState<string>('');

    // state: 사용자 입력 메시지 상태 //
    const [idMessage, setIdMessage] = useState<string>('');
    const [nicknameMessage, setNicknameMessage] = useState<string>('');
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');
    const [telNumberMessage, setTelNumberMessage] = useState<string>('');
    const [authNumberMessage, setAuthNumberMessage] = useState<string>('');

    // state: 사용자 정보 메시지 에러 상태 //
    const [idMessageError, setIdMessageError] = useState<boolean>(false);
    const [nicknameMessageError, setNicknameMessageError] = useState<boolean>(false);
    const [passwordMessageError, setPasswordMessageError] = useState<boolean>(false);
    const [passwordCheckMessageError, setPasswordCheckMessageError] = useState<boolean>(false);
    const [telNumberMessageError, setTelNumberMessageError] = useState<boolean>(false);
    const [authNumberMessageError, setAuthNumberMessageError] = useState<boolean>(false);

    // state: 입력값 검증 상태 //
    const [isCheckedId, setCheckedId] = useState<boolean>(false);
    const [isCheckedNickname, setCheckedNickname] = useState<boolean>(false);
    const [isMatchedPassword, setMatchedPassword] = useState<boolean>(false);
    const [isCheckedPassword, setCheckedPassword] = useState<boolean>(false);
    const [isSend, setSend] = useState<boolean>(false);
    const [isCheckedAuthNumber, setCheckedAuthNumber] = useState<boolean>(false);

    // variable: 다음페이지 이동 가능 여부 //
    const isComplete = name && id && isCheckedId && nickname && isCheckedNickname && password && passwordCheck && isMatchedPassword && isCheckedPassword
    && telNumber && isSend && authNumber && isCheckedAuthNumber;

    // event handler: 이름 변경 이벤트 처리 //
    const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setName(value);
    };

    // event handler: 아이디 변경 이벤트 처리 //
    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setId(value);
        setCheckedId(false);
        setIdMessage('');

        const pattern = /^[a-zA-Z0-9]*$/;
        if (!pattern.test(value) && value.length > 0) {
            setIdMessage('영어와 숫자만 사용 가능한 아이디입니다.');
            setIdMessageError(true);
            return;
        }

        setIdMessageError(false);
    };

    // event handler: 닉네임 변경 이벤트 처리 //
    const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setNickname(value);
        setCheckedNickname(false);
        setNicknameMessage('');
    };

    // event handler: 비밀번호 변경 이벤트 처리 //
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPassword(value);

        const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
        const isMatched = pattern.test(value);

        const message = (isMatched || !value) ? '' : '영문, 숫자를 혼용하여 8 ~ 13자 입력해주세요';
        setPasswordMessage(message);
        setPasswordMessageError(!isMatched);
        setMatchedPassword(isMatched);
    };

    // event handler: 비밀번호 확인 변경 이벤트 처리 //
    const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPasswordCheck(value);
    };

    const isValidTelNumber = (value: string): boolean => {
        const pattern = /^[0-9]*$/;
        return (pattern.test(value) || value === '') && value.length <= 11;
    };
    
    // event handler: 전화번호 변경 이벤트 처리 //
    const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
    
        if (isValidTelNumber(value)) {
            setTelNumber(value);
            setTelNumberMessage('');
            return;
        }
    };

    // event handler: 인증번호 변경 이벤트 처리 //
    const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        const pattern = /^[0-9]{11}$/;

        // value를 검사하여 조건에 맞는 경우에만 상태 업데이트
        if (pattern.test(value) || value === '') {
            setAuthNumber(value);
        }

        setCheckedAuthNumber(false);
        setAuthNumberMessage('');
    };

    // event handler: 아이디 중복 확인 버튼 클릭 이벤트 처리 //
    const onIdCheckClickHandler = () => {
        if (!id) return;

        const pattern = /^[a-zA-Z0-9]*$/;
        if (!pattern.test(id)) {
            setIdMessage('영어와 숫자만 사용 가능한 아이디입니다.');
            setIdMessageError(true);
            return;
        }

        if (id === 'qwer1234') {
            setIdMessage('중복된 아이디입니다');
            setIdMessageError(true);
            setCheckedId(false);
        } else {
            setIdMessage('사용 가능한 아이디입니다');
            setIdMessageError(false);
            setCheckedId(true);
        }

    }

    // event handler: 닉네임 중복 확인 버튼 클릭 이벤트 처리 //
    const onNicknameCheckClickHandler = () => {
        if (!id) return;

        if (id === 'qwer1234') {
            setNicknameMessage('중복된 닉네임입니다');
            setNicknameMessageError(true);
            setCheckedNickname(false);
        } else {
            setNicknameMessage('사용 가능한 닉네임입니다');
            setNicknameMessageError(false);
            setCheckedNickname(true);
        }

    }

    // event handler: 전화번호 인증 버튼 클릭 이벤트 처리 //
    const onTelNumberSendClickHandler = () => {
        if (!telNumber) return;

        const pattern = /^[0-9]{11}$/;
        const isMatched = pattern.test(telNumber);

        if (!isMatched) {
            setTelNumberMessage('숫자 11자 입력해주세요');
            setTelNumberMessageError(true);
            return;
        }

        setTelNumberMessage('인증번호가 전송되었습니다');

    }

    // event handler: 인증 확인 버튼 클릭 이벤트 처리 //
    const onAuthNumberCheckClickHandler = () => {
        if (!authNumber) return;

        if (authNumber === '1234') {
            setAuthNumberMessage('인증번호가 일치합니다');
            setAuthNumberMessageError(true);
        } else {
            setAuthNumberMessage('인증번호가 일치하지않습니다');
            setAuthNumberMessageError(true);
        }

    }

    // effect: 비밀번호 및 비밀번호 확인 변경 시 실행할 함수 //
    useEffect(() => {
        if (!password || !passwordCheck) return;

        const isEqual = password === passwordCheck;
        const message = isEqual ? '' : '비밀번호가 일치하지 않습니다';
        setPasswordCheckMessage(message);
        setPasswordCheckMessageError(!isEqual);
        setCheckedPassword(isEqual);
    }, [password, passwordCheck]);

    // render: 회원가입 화면1 컴포넌트 렌더딩 //
    return (
        <div className='auth-box'>
            <div className='sns-box'>
                <div className='sns-title'>sns 간편 로그인</div>
                <div className='icon-box'>
                    <div>카카오</div>
                    <div>네이버</div>
                </div>
            </div>
            <div className="input-container">
                <InputBox label='이름' type='text' placeholder='이름을 입력해주세요' value={name} onChange={onNameChangeHandler} />
                <InputBox label='아이디' type='text' placeholder='아이디를 입력해주세요' value={id} messageError={idMessageError} message={idMessage} buttonName='중복 확인' onChange={onIdChangeHandler} onButtonClick={onIdCheckClickHandler} />
                <InputBox label='닉네임' type='text' placeholder='닉네임을 입력해주세요' value={nickname} messageError={nicknameMessageError} message={nicknameMessage} buttonName='중복 확인' onChange={onNicknameChangeHandler} onButtonClick={onNicknameCheckClickHandler} />
                <InputBox label='비밀번호' type='password' placeholder='비밀번호를 입력해주세요' value={password} messageError={passwordMessageError} message={passwordMessage} onChange={onPasswordChangeHandler} />
                <InputBox label='비밀번호 확인' type='password' placeholder='비밀번호를 다시 입력해주세요' value={passwordCheck} messageError={passwordCheckMessageError} message={passwordCheckMessage} onChange={onPasswordCheckChangeHandler} />
                <InputBox label='전화번호' type='text' placeholder='전화번호를 입력해주세요' value={telNumber} messageError={telNumberMessageError} message={telNumberMessage} buttonName='전화번호 인증' onChange={onTelNumberChangeHandler} onButtonClick={onTelNumberSendClickHandler} />
                <InputBox label='인증번호' type='text' placeholder='인증번호를 입력해주세요' value={authNumber} messageError={authNumberMessageError} message={authNumberMessage} buttonName='인증 확인' onChange={onAuthNumberChangeHandler} onButtonClick={onAuthNumberCheckClickHandler} />
            </div>
            <div className='button-box'>
                <div className='main-home-button'>홈</div>
                <div className='next-button' onClick={onNext}>다음페이지</div>
            </div>
        </div>
    );
}

function SignUpSecond({ onPrevious }: SignUpSecondProps) {

    // state: 사용자 입력 정보 상태 //
    const [height, setHeight] = useState<string>('');
    const [weight, setWeight] = useState<string>('');
    const [skeletalMuscleMass, setSkeletalMuscleMass] = useState<string>('');
    const [bodyFatMass, setBodyFatMass] = useState<string>('');
    const [deadlift, setDeadlift] = useState<string>('');
    const [benchPress, setBenchPress] = useState<string>('');
    const [squat, setSquat] = useState<string>('');

    // state: 사용자 입력 메시지 상태 //
    const [heightMessage, setHeightMessage] = useState<string>('');
    const [weightMessage, setWeightMessage] = useState<string>('');

    // state: 사용자 정보 메시지 에러 상태 //
    const [heightMessageError, setHeightMessageError] = useState<boolean>(false);
    const [weightMessageError, setWeightMessageError] = useState<boolean>(false);

    // state: 입력값 검증 상태 //
    const [isCheckedHeight, setCheckedHeight] = useState<boolean>(false);
    const [isCheckedWeight, setCheckedWeight] = useState<boolean>(false);

    // event handler: 키 변경 이벤트 처리 //
    const onHeightChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setHeight(value);
    };

    // event handler: 몸무게 변경 이벤트 처리 //
    const onWeightChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setWeight(value);
    };

    // event handler: 골격근량 변경 이벤트 처리 //
    const onSkeletalMuscleMassChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSkeletalMuscleMass(value);
    };

    // event handler: 체지방량 변경 이벤트 처리 //
    const onBodyFatMassChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setBodyFatMass(value);
    };

    // event handler: 데드리프트 변경 이벤트 처리 //
    const onDeadliftChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setDeadlift(value);
    };

    // event handler: 벤치프레스 변경 이벤트 처리 //
    const onBenchPressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setBenchPress(value);
    };

    // event handler: 스쿼트 변경 이벤트 처리 //
    const onSquatChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSquat(value);
    };

    // render: 회원가입 화면2 컴포넌트 렌더딩 //
    return (
        <div className='auth-box'>
            <div className='auth-second-box'>
                <div className='input-left'>
                    <div className='profile-box'>
                        <div className='profile-tile'>프로필 이미지</div>
                        <div className='profile-image'>프로필 등록</div>
                    </div>
                    <div className='bigthree-box'>
                        <div className='bigthree-title'>3대측정</div>
                        <div className='bigthree-unit'>(1RM)</div>
                    </div>
                    <div className='goal-title'>개인목표</div>
                </div>
                <div className="input-container">
                    <InputBox label='키(cm)' type='text' placeholder='키(cm)를 입력해주세요' value={height} messageError={heightMessageError} message={'키를 입력해주세요'} unit='cm' onChange={onHeightChangeHandler} />
                    <InputBox label='몸무게(kg)' type='text' placeholder='몸무게(kg)을 입력해주세요' value={weight} messageError={weightMessageError} message={'몸무게를 입력해주세요'} unit='kg' onChange={onWeightChangeHandler} />
                    <InputBox label='골격근량(kg)' type='text' placeholder='골격근량(kg)을 입력해주세요' value={skeletalMuscleMass} unit='kg' onChange={onSkeletalMuscleMassChangeHandler} />
                    <InputBox label='체지방량(kg)' type='text' placeholder='체지방량(kg)을 입력해주세요' value={bodyFatMass} unit='kg' onChange={onBodyFatMassChangeHandler} />
                    <InputBox label='벤치프레스(kg)' type='text' placeholder='중량을(kg)을 입력해주세요' value={deadlift} unit='kg' onChange={onBenchPressChangeHandler} />
                    <InputBox label='데드리프트(kg)' type='text' placeholder='중량을(kg)을 입력해주세요' value={benchPress} unit='kg' onChange={onDeadliftChangeHandler} />
                    <InputBox label='스쿼트(kg)' type='text' placeholder='중량을(kg)을 입력해주세요' value={squat} unit='kg' onChange={onSquatChangeHandler} />
                    <input className='user-goal' placeholder='개인 목표를 입력해 주세요' />
                </div>
            </div>
            <div className='button-box'>
                <div className='previous-button' onClick={onPrevious}>이전 페이지</div>
                <div className='signup-button'>회원가입</div>
            </div>
        </div>
    );
}

export default function SignUp() {
    const [signUpPage, setSignUpPage] = useState(true);

    // event handler: 회원가입 페이지 전환 핸들러 //
    const onSignUpPageChangeHandler = () => {
        setSignUpPage(prev => !prev);
    };

    // render: 회원가입 컴포넌트 렌더딩 //
    return (
        <div id='su-wrapper'>
            <TopBar />
            <div id='su-main'>
                <div className='sign-up-contain'>
                    <div className='sign-up-title'>회원가입</div>
                    
                    {signUpPage ? 
                        (<SignUpFirst onNext={onSignUpPageChangeHandler} />) : 
                        (<SignUpSecond onPrevious={onSignUpPageChangeHandler} />)
                    }
                </div>
            </div>
        </div>
    );
}
