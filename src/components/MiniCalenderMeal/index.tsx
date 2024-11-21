import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import './style.css'
import dayjs, { Dayjs } from "dayjs";
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import { Cookies, useCookies } from "react-cookie";
import { ResponseDto } from "src/apis/dto/response";
import { ACCESS_TOKEN } from "src/constant";
import { access } from "fs";
import { useLocation, useParams } from "react-router";
import MealSchedule from "src/types/meal-schedule.interface";
import { GetMealScheduleResponseDto } from "src/apis/dto/response/schedule";
import MealMemo from "src/types/meal-memo.interface";
import { PatchMealScheduleRequestDto, PostMealScheduleRequestDto } from "src/apis/dto/request/schedule";
import { deleteMealScheduleRequest, patchMealScheduleRequest, postMealScheduleRequest } from "src/apis";
import { useMealScheduleStroe, useSignInCustomerStroe } from "src/stores";

// interface: 캘린더 Props //
interface CalendarProps {
    selectDate: Dayjs;
    setSelectDate: (date: Dayjs) => void;
    schedules: MealSchedule[];
    setSchedules: (schedules:MealSchedule[]) => void;

}

// interface: 일정 팝업 Props //
interface ScheduleProps{
    scheduleChange: () => void;
    schedules: MealSchedule[];
    setSchedules: (schedules: MealSchedule[]) => void;
    popupDate: Dayjs | null;
    setPopupDate: (date: Dayjs | null) => void;
    getMealScheduleList: () => void;
    
}

// component: 일정 팝업 컴포넌트 //
function SchedulePopup({scheduleChange, schedules, setSchedules, popupDate, setPopupDate, getMealScheduleList}: ScheduleProps){

    // state: 일정 상태 관리 //
    const [cookies] = useCookies();
    // state: 일정 인풋 상태 //
    const [mealTitle, setMealTitle] = useState<string>('');
    const [mealScheduleStart, setMealScheduleStart] = useState<Dayjs | null>(null);
    const [mealScheduleEnd, setMealScheduleEnd] = useState<Dayjs | null>(null);
    const [mealMemoList, setMealMemoList] = useState<MealMemo[]>([]);
    // state: 팝업 상태창 상태 //
    const [scheduleChangePopup, setSchedulesChangePopup] = useState(false);
    // state: 수정 중인 일정 상태 //
    const [editIndex, setEditIndex] = useState<number | null>(null);
    // state: 헬스 일정 번호 상태 //
    const{mealScheduleNumber} = useParams();

    // function: useLocation 함수 //
    const locationNow = useLocation();

    // function: post schedule response 처리 함수 //
    const postmealScheduleResponse= (responseBody: ResponseDto | null ) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다,' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' : 
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if(!isSuccessed) {
            alert(message);
            return;
        }; 
        getMealScheduleList();
    };

    // function: get schedule response 처리 함수 //
    const getmealScheduleResponse = (responseBody: GetMealScheduleResponseDto | ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NS' ? '존재하지 않는 스케줄입니다' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if(!isSuccessed){
            alert(message);
            return;
        }

        const {mealTitle, mealScheduleStart, mealScheduleEnd, mealMemo} = responseBody as GetMealScheduleResponseDto;
        setMealTitle(mealTitle);
        setMealScheduleStart(dayjs(mealScheduleStart));
        setMealScheduleEnd(dayjs(mealScheduleEnd));
        setMealMemoList(mealMemo)
    };

    // function: patch schedule 처리 함수 //
    const patchmealScheduleResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.':
            responseBody.code === 'VF' ? '잘못된 접근입니다.':
            responseBody.code === 'NS' ? '존재하지 않는 스케줄입니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.':
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if(!isSuccessed){
            alert(message);
            return;
        }
        getMealScheduleList();
    }

    // function: delete schedule response 처리 함수 //
    const deletemealScheduleResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NS' ? '존재하지 않는 스케줄입니다' :
            responseBody.code === 'AF' ? '인증이 실패하였습니다..' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed){
            alert(message);
            return;
        }
        getMealScheduleList();
    }

    // effect: 헤더 Hidden 처리 함수 //
    useEffect(() => {
        if(locationNow.pathname === "/main"){
            return;
        }
    })

    // event handler: 일정 추가 이벤트 처리 //
    const handlerAddOrUpdateSchedule = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if(!accessToken) return;

        if (mealScheduleStart && mealScheduleEnd && mealTitle && mealMemoList) {
            const newSchedules = [...schedules];
            if (editIndex !== null) {
                // 일정 수정
                newSchedules[editIndex] = {
                    mealScheduleStart: mealScheduleStart.format("YYYY-MM-DD"),
                    mealScheduleEnd: mealScheduleEnd.format("YYYY-MM-DD"),
                    mealTitle: mealTitle,
                    mealMemo: mealMemoList,
                    mealScheduleNumber: newSchedules[editIndex].mealScheduleNumber
                };
            } else {
                // 새로운 일정 추가
                let current = mealScheduleStart;
                while (current.isBefore(mealScheduleEnd) || current.isSame(mealScheduleEnd)) {
                    newSchedules.push({
                        mealScheduleStart: current.format("YYYY-MM-DD"),
                        mealScheduleEnd: current.format("YYYY-MM-DD"),
                        mealTitle: mealTitle,
                        mealMemo: mealMemoList,
                        mealScheduleNumber: 0
                    });
                    current = current.add(1, "day");
                }
            }
            setSchedules(newSchedules);
            setMealTitle("");
            setPopupDate(null);
            setMealScheduleStart(null);
            setMealScheduleEnd(null);
            setMealMemoList([]);
            scheduleChange();
        };
        
        const requestBody: PostMealScheduleRequestDto = {
            mealTitle: String(),
            mealScheduleStart: String(),
            mealScheduleEnd: String(),
            mealMemo: mealMemoList
        };
        
        postMealScheduleRequest(requestBody, accessToken).then(postmealScheduleResponse);
    };
    

    // event handler: 일정 변경 이벤트 처리 //
    const onScheduleChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = event?.target;
        setMealTitle(value);
    };

    // event handler: 시작 날짜 선택 이벤트 처리 //
    const onStartDateChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setMealScheduleStart(dayjs(value));
    };

    // event handler: 종료 날짜 선택 이벤트 처리 //
    const onEndDateChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setMealScheduleEnd(dayjs(value));
    };

    // event handler: 수정 버튼 클릭 이벤트 처리 함수 //
    const onUpdateButtononClickHandler = () => {
        if(!mealTitle || !mealScheduleStart || !mealScheduleEnd){
            alert('모든값을 입력해주세요.');
            return;
        }

        const accessToken = cookies[ACCESS_TOKEN];
        if(!accessToken) return;

        const requestBody: PatchMealScheduleRequestDto = {
            mealTitle, 
            mealScheduleStart: mealScheduleStart.format("YYYY-MM-DD"), 
            mealScheduleEnd: mealScheduleEnd.format("YYYY-MM-DD"),
            mealMemo: mealMemoList
        };
        if (!mealScheduleNumber) return;

        patchMealScheduleRequest( requestBody, mealScheduleNumber, accessToken).then(patchmealScheduleResponse);
    };
    
    //event handler: 삭제 버튼 클릭 이벤트 처리 함수 //
    const onDeletButtonClickHandler = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if(!accessToken) return;
        if(!mealScheduleNumber) return;
        deleteMealScheduleRequest(mealScheduleNumber, accessToken).then(deletemealScheduleResponse);
    }

    
    // effect: 일정이 변경될 시 실행할 함수 //
    useEffect(() => {
        if (popupDate) {
            const existingScheduleIndex = schedules.findIndex(
                (schedule) =>
                    dayjs(schedule.mealScheduleStart).isSame(popupDate, "day") &&
                    dayjs(schedule.mealScheduleEnd).isSame(popupDate, "day")
            );

            if (existingScheduleIndex !== -1) {
                const existingSchedule = schedules[existingScheduleIndex];
                setMealTitle(existingSchedule.mealTitle);
                setMealScheduleStart(dayjs(existingSchedule.mealScheduleStart));
                setMealScheduleEnd(dayjs(existingSchedule.mealScheduleEnd));
                setMealMemoList(mealMemoList)
                setEditIndex(existingScheduleIndex);
            } else {
                setMealTitle("");
                setMealScheduleStart(popupDate);
                setMealScheduleEnd(popupDate);
                setMealMemoList([]);
                setEditIndex(null);
            }
        }
    }, [popupDate, schedules]);
    
    return(
        <div className="pop-up-content">
            <div className="pop-up-schedule-date">
                {mealScheduleStart && mealScheduleEnd
                ? `${mealScheduleStart.format('YYYY-MM-DD')} ~ ${mealScheduleEnd.format('YYYY-MM-DD')} 일정`
                : popupDate?.format('YYYY-MM-DD')}
            </div>
            <div className="pop-up-schedule-box">
                <div className="pop-up-select-schedule-box">
                    <input className="day-select-start" type="date" value={mealScheduleStart ? mealScheduleStart.format('YYYY-MM-DD'):''}
                    onChange={onStartDateChangeHandler}
                    />
                    <input className="day-select-end"
                        type="date" value={mealScheduleEnd ? mealScheduleEnd.format('YYYY-MM-DD') : ''} 
                        onChange={onEndDateChangeHandler} 
                    />
                    <textarea className="pop-up-schedule"
                        placeholder="일정을 입력하세요"
                        value={mealTitle}
                        onChange={onScheduleChangeHandler}
                    />
                </div>
            </div>
            <div className="pop-up-button-box">
                {editIndex !== null ? (
                    <>
                        <button onClick={onUpdateButtononClickHandler}>수정</button>
                        <button onClick={onDeletButtonClickHandler}>삭제</button>
                    </>
                ) : (
                    <button onClick={handlerAddOrUpdateSchedule}>추가</button>
                )}
                <button onClick={scheduleChange}>취소</button>
            </div>
        </div>
    )
};
// component: 캘린더 컴포넌트 //
export default function MiniCalendarMeal({ selectDate, setSelectDate, schedules, setSchedules}: CalendarProps) {
    dayjs.extend(weekday);
    dayjs.extend(isoWeek);
    dayjs.extend(weekOfYear);

    // state: 보여질 날짜 상태 //
    const [viewDate, setViewDate] = useState<Dayjs>(dayjs());
    // state: cookie 상태 //
    const [cookies] = useCookies();
    // state: 스케쥴 리스트 상태 //
    const {mealScheduleList} = useMealScheduleStroe();
    // state: 로그인 사용자 상태 //
    const {signInCustomer} = useSignInCustomerStroe();
    // state: 팝업에 표시할 날짜 상태 //
    const [popupDate, setPopupDate] = useState<Dayjs|null>(null);
    // state: 팝업 상태창 상태 //
    const [scheduleChangePopup, setSchedulesChangePopup] = useState(false);
    
    // state: 보여질 날짜가 속한 달의 첫 주차 계산 상태 //
    const startWeek = viewDate.startOf('month').week();
    // state: 해당 달의 마지막 주차 상태 //
    const endWeek = viewDate.endOf('month').week() === 1 ? 53 : viewDate.endOf('month').week();
    // state: 요일 배열 상태 //
    const weekDays = useMemo(() => ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT'], []);
    // state: 일정 시작일과 종료일 상태 //
    const [mealScheduleStart, setmealScheduleStart] = useState<Dayjs | null>(null);
    const [mealScheduleEnd, setmealScheduleEnd] = useState<Dayjs | null>(null);

    // function: 로그인 된 사용자 함수 //
    const isLoggIn = !!signInCustomer;
    // function: useLocation 함수 //
    const locationNow = useLocation();

    // event handler: 달 변경 클릭 이벤트 처리 //
    const onCalendarMonthChangeClickButtonHandler = (date: Dayjs, changeString: 'add' | 'subtract' | 'today') => {
        if (changeString === 'add') {
            return setViewDate(viewDate.add(1, 'month'));
        } else if (changeString === 'subtract') {
            return setViewDate(viewDate.subtract(1, 'month'));
        } else if (changeString === 'today') {
            return setViewDate(dayjs());
        } else {
            return date;
        }
    };

    // event handler: 스케줄 팝업 이벤트 처리 //
    const onScheduleChangePopup = () => {
        if(isLoggIn && locationNow.pathname !== '/main'){
            setSchedulesChangePopup(!scheduleChangePopup);
        }
    };


    // render: 캘린더 컴포넌트 렌더링 //
    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={() => onCalendarMonthChangeClickButtonHandler(viewDate, 'subtract')}>
                    <MdArrowBackIos />
                </button>
                <span>{viewDate.format('YYYY.MM')}</span>
                <button onClick={() => onCalendarMonthChangeClickButtonHandler(viewDate, 'add')}>
                    <MdArrowForwardIos />
                </button>
            </div>
            <div className="calendar-content">
                <div className="week-header">
                    {weekDays.map((day, i) => (
                        <div key={i} className={`day-header ${i === 0 ? 'sunday' : ''}`}>
                            {day}
                        </div>
                    ))}
                </div>
                <div className="dates">
                    {Array.from({ length: endWeek - startWeek + 1 }, (_, index) => startWeek + index).map((week) => (
                        <div key={week} className="week">
                            {Array(7)
                                .fill(0)
                                .map((_, i) => {
                                    // 나타낼 날짜
                                    const current = viewDate.week(week).startOf('week').add(i, 'day');
                                    // 선택됐는지 여부
                                    const isSelected = selectDate.format('YYYY-MM-DD') === current.format('YYYY-MM-DD') ? 'selected' : '';
                                    // 오늘 날짜 여부
                                    const isToday = dayjs().format('YYYY-MM-DD') === current.format('YYYY-MM-DD') ? 'today' : '';
                                    // 보여질 날짜가 아닌 경우 (다른 달의 날짜인 경우)
                                    const isNone = current.format('MM') === viewDate.format('MM') ? '' : 'none';

                                    // 해당 날짜의 일정 필터링
                                    const isExisted = mealScheduleList.some(schedule => schedule.mealScheduleStart <= current.format('YYYY-MM-DD') && schedule.mealScheduleEnd >= current.format('YYYY-MM-DD'));

                                    return (
                                        <div key={`${week}_${i}`} className={`day-cell ${isSelected} ${isToday} ${isNone}`}onClick={() =>{
                                            if(!mealScheduleStart){
                                                setmealScheduleStart(current);
                                            }else if(!mealScheduleEnd && current.isAfter(mealScheduleStart)){
                                                setmealScheduleEnd(current);
                                            }else{
                                                setmealScheduleStart(current);
                                                setmealScheduleEnd(null);
                                            }
                                            setSelectDate(current);
                                            setPopupDate(current);
                                            onScheduleChangePopup();
                                        }}>
                                            <div className="date-box">
                                                {current.format('D')}
                                            </div>
                                            {isExisted && (
                                                <div className="dot-box">
                                                    <div className="yellow-dot"></div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    ))}
                </div>
            </div>
            {isLoggIn && scheduleChangePopup ? (
                <div className="pop-up active">
                    <SchedulePopup 
                        scheduleChange={() => setSchedulesChangePopup(false)} 
                        schedules={schedules} 
                        setSchedules={setSchedules} 
                        popupDate={popupDate}
                        setPopupDate={setPopupDate}
                        getMealScheduleList={() => {}}
                    />
                </div>
            ) : null}
        </div>
    );
}