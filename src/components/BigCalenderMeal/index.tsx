import React, { ChangeEvent, useEffect, useImperativeHandle, useMemo, useState } from "react";
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
import { useMealScheduleStroe, useSignInCustomerStroe } from "src/stores";
import { GetMealScheduleListResponseDto, GetMealScheduleResponseDto } from "src/apis/dto/response/schedule";
import { useParams } from "react-router";
import { PatchMealScheduleRequestDto, PostMealScheduleRequestDto } from "src/apis/dto/request/schedule";
import { deleteMealScheduleRequest, getMealScheduleListRequest, getMealScheduleRequest, patchMealScheduleRequest, postMealScheduleRequest } from "src/apis";
import Schedule from "src/views/Schedule";
import MealSchedule from "src/types/meal-schedule.interface";
import MealMemo from "src/types/meal-memo.interface";

// interface: 캘린더 Props //
interface CalendarProps {
    selectDate: Dayjs;
    setSelectDate: (date: Dayjs) => void;
    schedules: MealSchedule[];
    setSchedules: (schedules: MealSchedule[]) => void;

}

// interface: 일정 팝업 Props //
interface ScheduleProps{
    scheduleChange: () => void;
    schedules: MealSchedule[];
    popupDate: Dayjs | null;
    getMealScheduleList: () => void;
    MealScheduleNumber: number | null;
    
}

// component: 일정 팝업 컴포넌트 //
function SchedulePopup({scheduleChange, schedules, popupDate, getMealScheduleList, MealScheduleNumber}: ScheduleProps){

    // state: 일정 상태 관리 //
    const [cookies] = useCookies();
    // state: 일정 인풋 상태 //
    const [mealTitle, setMealTitle] = useState<string>('');
    const [mealScheduleStart, setMealScheduleStart] = useState<Dayjs | null>(null);
    const [mealScheduleEnd, setMealScheduleEnd] = useState<Dayjs | null>(null);
    const [mealMemoList, setMealMemoList] = useState<MealMemo[]>([]);
    // state: 원본 리스트 상태 //
    const {mealScheduleList, setMealScheduleList} = useMealScheduleStroe();

    // function: post schedule response 처리 함수 //
    const postMealScheduleResponse= (responseBody: ResponseDto | null ) => {
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
    const getMealScheduleResponse = (responseBody: GetMealScheduleResponseDto | ResponseDto | null) => {
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
        setMealMemoList(mealMemoList);
    };

    // function: patch schedule response 처리 함수 //
    const patchMealScheduleResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.':
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NT' ? '존재하지 않는 일정입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if(!isSuccessed){
            alert(message);
            return;
        }
        getMealScheduleList();
        scheduleChange();
    }

    // function: get Meal schedule list response 처리 함수 //
    const getMealScheduleListResponse = (responseBody: GetMealScheduleListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.': '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if(!isSuccessed){
            alert(message);
            return;
        }
        const {mealSchedulelist} = responseBody as GetMealScheduleListResponseDto; 
        setMealScheduleList(mealSchedulelist);
    }

    // event handler: 일정 추가 이벤트 처리 핸들러 //
    const onPostMealScheduleButtonClickHandler = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;
        if(!mealScheduleStart) return;
        if(!mealScheduleEnd) return;

        if(mealScheduleStart > mealScheduleEnd) {
            alert('종료날짜가 시작날짜 보다 작을수 없습니다.')
            return;
        }

        if (mealScheduleStart && mealScheduleEnd && mealTitle && mealMemoList) {

            const requestBody: PostMealScheduleRequestDto = {
                mealTitle, 
                mealScheduleStart: mealScheduleStart.format(),
                mealScheduleEnd: mealScheduleEnd.format(),
                mealMemo: mealMemoList
            };
            
            postMealScheduleRequest(requestBody, accessToken).then(postMealScheduleResponse);
        }

        getMealScheduleListRequest(accessToken).then(getMealScheduleListResponse);
    };

    // event handler: 일정 수정 이벤트 처리 핸들러//
    const onUpdateMealScheduleClickHandler = () => {

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        if (mealScheduleStart && mealScheduleEnd && mealTitle && mealMemoList && MealScheduleNumber ) {

            const requestBody: PatchMealScheduleRequestDto = {
                mealTitle, 
                mealScheduleStart: mealScheduleStart.format(),
                mealScheduleEnd: mealScheduleEnd.format(),
                mealMemo: mealMemoList
            }
            if (MealScheduleNumber) {
                patchMealScheduleRequest(requestBody, MealScheduleNumber, accessToken).then(patchMealScheduleResponse);
            }
        }
        getMealScheduleListRequest(accessToken).then(getMealScheduleListResponse);
        
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

    // effect: 헬스 스케줄이 변경될 시 실행할 함수 //
    useEffect(() => {
        const accessToken = cookies[ACCESS_TOKEN];
        if(!accessToken || MealScheduleNumber === null) return;
        getMealScheduleRequest(MealScheduleNumber, accessToken).then(getMealScheduleResponse)
        }, [cookies, MealScheduleNumber]);

    // function: delete schedule response 처리 함수 //
    const deleteMealScheduleResponse = (responseBody: ResponseDto | null) => {
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
        // // 성공적으로 삭제된 경우 상태 업데이트
        // const updatedSchedules = schedules.filter(schedule => 
        //     schedule.MealScheduleStart !== MealScheduleStart?.format('YYYY-MM-DD') || 
        //     schedule.MealScheduleEnd !== MealScheduleEnd?.format('YYYY-MM-DD')
        // );

        scheduleChange(); // 팝업 닫기
        getMealScheduleList(); // 최신 스케줄 리스트 가져오기
    };
    //event handler: 삭제 버튼 클릭 이벤트 처리 함수 //
    const onDeletButtonClickHandler = (MealScheduleNumber: number | null) => {
        if(MealScheduleNumber === null) {
            return;
        }

        const accessToken = cookies[ACCESS_TOKEN];
        if(!accessToken) return;

        deleteMealScheduleRequest(MealScheduleNumber, accessToken).then(deleteMealScheduleResponse);
    };
    
    // effect: 일정이 변경될 시 실행할 함수 //
    useEffect(() => {
        if (MealScheduleNumber) {
            const schedule = schedules.find(item => item.mealScheduleNumber === MealScheduleNumber);
            if (!schedule) return;
            setMealTitle(schedule.mealTitle);
            setMealScheduleStart(dayjs(schedule.mealScheduleStart));
            setMealScheduleEnd(dayjs(schedule.mealScheduleEnd));
            setMealMemoList(schedule.mealMemo)
        }
        if (popupDate) {
            // popupDate가 설정되면 이를 시작일과 종료일로 사용
            setMealScheduleStart(popupDate);
            setMealScheduleEnd(popupDate); // 종료일도 동일하게 설정 (원하는 대로 조정 가능)
        }
    }, [MealScheduleNumber, popupDate]);

    // render: 일정 추가 컴포넌트 렌더링 //
    return(
        <div className="pop-up-content">
            <div className="pop-up-schedule-date">
                {mealScheduleStart && mealScheduleEnd
                ? `${mealScheduleStart.format('YYYY-MM-DD')} ~ ${mealScheduleEnd.format('YYYY-MM-DD')} 일정`
                : popupDate?.format('YYYY-MM-DD')}
            </div>
            
            <div className="pop-up-schedule-box">
                <div className="pop-up-select-schedule-box">
                    <input className="day-select-start" type="date" value={mealScheduleStart ? mealScheduleStart.format('YYYY-MM-DD'):popupDate?.format('YYYY-MM-DD')}
                    onChange={onStartDateChangeHandler}
                    />
                    <input className="day-select-end"
                        type="date" value={mealScheduleEnd ? mealScheduleEnd.format('YYYY-MM-DD') : popupDate?.format('YYYY-MM-DD')} 
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
                {MealScheduleNumber !== null ? (
                    // 일정이 있을 때 - 수정 버튼과 삭제 버튼 표시
                    <>
                        <button onClick={onUpdateMealScheduleClickHandler}>수정</button>
                        <button onClick={()=>{
                            if(MealScheduleNumber !== null){
                                onDeletButtonClickHandler(MealScheduleNumber);
                            }
                        }}>삭제</button>
                    </>
                ) : (
                    // 일정이 없을 때 - 추가 버튼만 표시
                    <button onClick={onPostMealScheduleButtonClickHandler}>추가</button>
                )}
                <button onClick={scheduleChange}>취소</button>
            </div>
        </div>
    )
};
// component: 캘린더 컴포넌트 //
export default function BigCalendarMeal({ selectDate, setSelectDate, schedules, setSchedules}: CalendarProps) {
    dayjs.extend(weekday);
    dayjs.extend(isoWeek);
    dayjs.extend(weekOfYear);

    // state: 보여질 날짜 상태 //
    const [viewDate, setViewDate] = useState<Dayjs>(dayjs());
    // state: cookie 상태 //
    const [cookies] = useCookies();
    // state: 로그인 사용자 상태 //
    const {signInCustomer} = useSignInCustomerStroe();
    // state: 팝업에 표시할 날짜 상태 //
    const [popupDate, setPopupDate] = useState<Dayjs|null>(null);
    // state: 팝업 상태창 상태 //
    const [scheduleChangePopup, setSchedulesChangePopup] = useState<boolean>(false);
    // state: 원본 리스트 상태 //
    const {mealScheduleList, setMealScheduleList} = useMealScheduleStroe();
    // state: 헬스 일정 번호 경로 변수 상태 //
    const [mealScheduleNumber, setMealScheduleNumber] = useState<number | null>(null);
    // state: 보여질 날짜가 속한 달의 첫 주차 계산 상태 //
    const startWeek = viewDate.startOf('month').week();
    // state: 해당 달의 마지막 주차 상태 //
    const endWeek = viewDate.endOf('month').week() === 1 ? 53 : viewDate.endOf('month').week();
    // state: 요일 배열 상태 //
    const weekDays = useMemo(() => ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT'], []);
    // state: 모든 일정 상태 //
    const [mealTitle, setMealTitle] = useState<string>('');
    const [mealScheduleStart, setMealScheduleStart] = useState<Dayjs | null>(null);
    const [mealScheduleEnd, setMealScheduleEnd] = useState<Dayjs | null>(null);
    const [mealMemoList, setMealMemoList] = useState<MealMemo[]>([]);
    // state: 수정 중인 일정 상태 //
    const [editIndex, setEditIndex] = useState<number | null>(null);

    // function: 로그인 된 사용자 함수 //
    const isLoggIn = !!signInCustomer;

    // function: Meal schedule list 불러오기 함수 //
    const getMealScheduleList = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if(!accessToken) return;
        getMealScheduleListRequest(accessToken).then(getMealScheduleListResponse);
    }

    // function: get Meal schedule list response 처리 함수 //
    const getMealScheduleListResponse = (responseBody: GetMealScheduleListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.': '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if(!isSuccessed){
            alert(message);
            return;
        }
        const {mealSchedulelist} = responseBody as GetMealScheduleListResponseDto; 
        setMealScheduleList(mealSchedulelist);
    }

    
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
        if(isLoggIn){
            setSchedulesChangePopup(!scheduleChangePopup);
        }
        if(scheduleChangePopup === true) {
            window.location.reload();
        }
    };

    // event handler: 일정 수정 클릭 이벤트 처리 //
    const onUpdateScheduleListClickHandler = (MealScheduleNumber: number) => {
        const selectedSchedule = mealScheduleList.find(schedule => schedule.mealScheduleNumber === MealScheduleNumber);
        if(selectedSchedule){
            setMealTitle(selectedSchedule.mealTitle);
            setMealScheduleStart(dayjs(selectedSchedule.mealScheduleStart));
            setMealScheduleEnd(dayjs(selectedSchedule.mealScheduleEnd));
            setMealMemoList(selectedSchedule.mealMemo);
            setEditIndex(mealScheduleList.findIndex(Schedule => Schedule.mealScheduleNumber === MealScheduleNumber));
            setPopupDate(dayjs(selectedSchedule.mealScheduleStart));
        }
        setSchedulesChangePopup(true);
    }

    // effect: 컴포넌트 로드시 헬스 스케줄 불러오기 함수//
    useEffect(()=>{
        const accessToken = cookies[ACCESS_TOKEN];
        if(!accessToken) return;
        getMealScheduleListRequest(accessToken).then(getMealScheduleListResponse)
    },[mealScheduleNumber])



    // render: 큰 캘린더 상세 컴포넌트 렌더링 //
    return (
        <div className="big-calendar-container">
            <div className="calendar-header">
                <button onClick={() => onCalendarMonthChangeClickButtonHandler(viewDate, 'subtract')}>
                    <MdArrowBackIos />
                </button>
                <span>{viewDate.format('YYYY.MM')}</span>
                <button onClick={() => onCalendarMonthChangeClickButtonHandler(viewDate, 'add')}>
                    <MdArrowForwardIos />
                </button>
            </div>
            <div className="big-calendar-content">
                <div className="big-week-header">
                    {weekDays.map((day, i) => (
                        <div key={i} className={`big-day-header ${i === 0 ? 'sunday' : ''}`}>
                            {day}
                        </div>
                    ))}
                </div>
                <div className="dates">
                    {Array.from({ length: endWeek - startWeek + 1 }, (_, index) => startWeek + index).map((week) => (
                        <div key={week} className="big-week">
                            {Array(7)
                                .fill(0)
                                .map((_, i) => {
                                    // 나타낼 날짜
                                    const current = viewDate.week(week).startOf('week').add(i, 'day');
                                    // // 선택됐는지 여부
                                    // const isSelected = selectDate.format('YYYY-MM-DD') === current.format('YYYY-MM-DD') ? 'selected' : '';
                                    // // 오늘 날짜 여부
                                    // const isToday = dayjs().format('YYYY-MM-DD') === current.format('YYYY-MM-DD') ? 'today' : '';
                                    // // 보여질 날짜가 아닌 경우 (다른 달의 날짜인 경우)
                                    // const isNone = current.format('MM') === viewDate.format('MM') ? '' : 'none';

                                    // 해당 날짜의 일정 필터링
                                    const currentSchedules = mealScheduleList.filter(schedule => schedule.mealScheduleStart <= current.format('YYYY-MM-DD') && schedule.mealScheduleEnd >= current.format('YYYY-MM-DD'));
                                    return (
                                        <div key={`${week}_${i}`} className={`big-day-cell`} onClick={() => {
                                            setSelectDate(current);

                                            if(currentSchedules.length >= 3)
                                                return;
                                            if (currentSchedules.length > 0) {
                                                // 기존 일정이 있는 경우, 해당 일정을 수정하기 위해 팝업을 띄움
                                                const mealScheduleNumber = currentSchedules[0].mealScheduleNumber; // 첫 번째 일정 선택
                                                onUpdateScheduleListClickHandler(mealScheduleNumber);
                                            } else {
                                                // 새로운 일정을 추가하는 팝업을 띄움
                                                setPopupDate(current);
                                                setSchedulesChangePopup(true);
                                            }
                                        }}>
                                            <div className="big-date-box">
                                                <div className="date-number">{current.format('D')}</div>
                                                <div className="schedule-title-box">
                                                    <div className="big-schedule-titles">
                                                        {currentSchedules.slice(0, 3).map((schedule, idx) => (
                                                            <div key={idx} 
                                                                className="schedule-title" 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setMealTitle(schedule.mealTitle);
                                                                    setMealScheduleStart(dayjs(schedule.mealScheduleStart));
                                                                    setMealScheduleEnd(dayjs(schedule.mealScheduleEnd));
                                                                    setMealMemoList(schedule.mealMemo)
                                                                    setEditIndex(mealScheduleList.findIndex(s => s.mealScheduleNumber === schedule.mealScheduleNumber));
                                                                    setPopupDate(current);
                                                                    setSchedulesChangePopup(true);
                                                                    setMealScheduleNumber(schedule.mealScheduleNumber)
                                                                }}>
                                                                {schedule.mealTitle}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        
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
                        scheduleChange={onScheduleChangePopup}
                        schedules={mealScheduleList}
                        popupDate={popupDate}
                        getMealScheduleList={getMealScheduleList} 
                        MealScheduleNumber={mealScheduleNumber} />
                </div>
            ) : null}
        </div>
    );
}