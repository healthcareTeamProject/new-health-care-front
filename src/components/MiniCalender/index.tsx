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
import { useSignInCustomerStroe } from "src/stores";
import { HealthSchedule } from "src/types";
import { postHealthScheduleRequest } from "src/apis";
import { PostHealthScheduleRequestDto } from "src/apis/dto/request/schedule";

// interface: 캘린더 Props //
interface CalendarProps {
    selectDate: Dayjs;
    setSelectDate: (date: Dayjs) => void;
    schedules: { startDate: string; endDate: string; title: string }[];
    setSchedules: (schedules: { startDate: string; endDate: string; title: string }[]) => void;

}

// interface: 일정 팝업 Props //
interface ScheduleProps{
    scheduleChange: () => void;
    schedules: { startDate: string; endDate: string; title: string }[];
    setSchedules: (schedules: { startDate: string; endDate: string; title: string }[]) => void;
    popupDate: Dayjs | null;
    setPopupDate: (date: Dayjs | null) => void;
    getScheduleList: () => void;
}

// component: 일정 팝업 컴포넌트 //
function SchedulePopup({scheduleChange, schedules, setSchedules, popupDate, setPopupDate, getScheduleList}: ScheduleProps){

    // state: 일정 상태 관리 //
    const [cookies] = useCookies();
    // state: 일정 인풋 상태 //
    const [healthTitle, setHealthTitle] = useState<string>('');
    const [healthScheduleStart, setHealthScheduleStart] = useState<Dayjs | null>(null);
    const [healthScheduleEnd, setHealthScheduleEnd] = useState<Dayjs | null>(null);
    // state: 팝업 상태창 상태 //
    const [scheduleChangePopup, setSchedulesChangePopup] = useState(false);
    // state: 수정 중인 일정 상태 //
    const [editIndex, setEditIndex] = useState<number | null>(null);

    // function: post schedule response 처리 함수 //
    const postHealthScheduleResponse= (responseBody: ResponseDto | null ) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다,' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' : 
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if(!isSuccessed) {
            alert(message);
            return;
        }; 
        getScheduleList();
    };

    // event handler: 일정 추가 이벤트 처리 //
    const handlerAddOrUpdateSchedule = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if(!accessToken) return;

        if (healthScheduleStart && healthScheduleEnd && healthTitle) {
            const newSchedules = [...schedules];
            if (editIndex !== null) {
                // 일정 수정
                newSchedules[editIndex] = {
                    startDate: healthScheduleStart.format("YYYYMMDD"),
                    endDate: healthScheduleEnd.format("YYYYMMDD"),
                    title: healthTitle,
                };
            } else {
                // 새로운 일정 추가
                let current = healthScheduleStart;
                while (current.isBefore(healthScheduleEnd) || current.isSame(healthScheduleEnd)) {
                    newSchedules.push({
                        startDate: current.format("YYYYMMDD"),
                        endDate: current.format("YYYYMMDD"),
                        title: healthTitle,
                    });
                    current = current.add(1, "day");
                }
            }
            setSchedules(newSchedules);
            setHealthTitle("");
            setPopupDate(null);
            setHealthScheduleStart(null);
            setHealthScheduleEnd(null);
            scheduleChange();
        };
        
        const requestBody: PostHealthScheduleRequestDto = {
            healthScheduleNumber: Number(),
            userId: String(),
            healthTitle: String(),
            healthScheduleStart: String(),
            healthScheduleEnd: String()
        };
        
        postHealthScheduleRequest(requestBody, accessToken).then(postHealthScheduleResponse);
    };

    // event handler: 일정 변경 이벤트 처리 //
    const onScheduleChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = event?.target;
        setHealthTitle(value);
    };

    // event handler: 시작 날짜 선택 이벤트 처리 //
    const onStartDateChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setHealthScheduleStart(dayjs(value));
    };

    // event handler: 종료 날짜 선택 이벤트 처리 //
    const onEndDateChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setHealthScheduleEnd(dayjs(value));
    };
    // effect: 일정이 변경될 시 실행할 함수 //
    useEffect(() => {
        if (popupDate) {
            const existingScheduleIndex = schedules.findIndex(
                (schedule) =>
                    dayjs(schedule.startDate).isSame(popupDate, "day") &&
                    dayjs(schedule.endDate).isSame(popupDate, "day")
            );

            if (existingScheduleIndex !== -1) {
                const existingSchedule = schedules[existingScheduleIndex];
                setHealthTitle(existingSchedule.title);
                setHealthScheduleStart(dayjs(existingSchedule.startDate));
                setHealthScheduleEnd(dayjs(existingSchedule.endDate));
                setEditIndex(existingScheduleIndex);
            } else {
                setHealthTitle("");
                setHealthScheduleStart(popupDate);
                setHealthScheduleEnd(popupDate);
                setEditIndex(null);
            }
        }
    }, [popupDate, schedules]);
    
    return(
        <div className="pop-up-content">
            <div className="pop-up-schedule-date">
                {healthScheduleStart && healthScheduleEnd
                ? `${healthScheduleStart.format('YYYY-MM-DD')} ~ ${healthScheduleEnd.format('YYYY-MM-DD')} 일정`
                : popupDate?.format('YYYY-MM-DD')}
            </div>
            <div className="pop-up-schedule-box">
                <div className="pop-up-select-schedule-box">
                    <input className="day-select-start" type="date" value={healthScheduleStart ? healthScheduleStart.format('YYYYMMDD'):''}
                    onChange={onStartDateChangeHandler}
                    />
                    <input className="day-select-end"
                        type="date" value={healthScheduleEnd ? healthScheduleEnd.format('YYYYMMDD') : ''} 
                        onChange={onEndDateChangeHandler} 
                    />
                    <textarea className="pop-up-schedule"
                        placeholder="일정을 입력하세요"
                        value={healthTitle}
                        onChange={onScheduleChangeHandler}
                    />
                </div>
            </div>
            <div className="pop-up-button-box">
                <button onClick={handlerAddOrUpdateSchedule}>{editIndex !== null ? "수정" : "추가"}</button>
                <button onClick={scheduleChange}>취소</button>
            </div>
        </div>
    )
};
// component: 캘린더 컴포넌트 //
export default function MiniCalendar({ selectDate, setSelectDate, schedules, setSchedules}: CalendarProps) {
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
    const [scheduleChangePopup, setSchedulesChangePopup] = useState(false);
    
    // state: 보여질 날짜가 속한 달의 첫 주차 계산 상태 //
    const startWeek = viewDate.startOf('month').week();
    // state: 해당 달의 마지막 주차 상태 //
    const endWeek = viewDate.endOf('month').week() === 1 ? 53 : viewDate.endOf('month').week();
    // state: 요일 배열 상태 //
    const weekDays = useMemo(() => ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT'], []);
    // state: 일정 시작일과 종료일 상태 //
    const [healthScheduleStart, setHealthScheduleStart] = useState<Dayjs | null>(null);
    const [healthScheduleEnd, setHealthScheduleEnd] = useState<Dayjs | null>(null);

    const isLoggIn = !!signInCustomer;

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
        if(isLoggIn)
        setSchedulesChangePopup(!scheduleChangePopup);
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
                                    const isSelected = selectDate.format('YYYYMMDD') === current.format('YYYYMMDD') ? 'selected' : '';
                                    // 오늘 날짜 여부
                                    const isToday = dayjs().format('YYYYMMDD') === current.format('YYYYMMDD') ? 'today' : '';
                                    // 보여질 날짜가 아닌 경우 (다른 달의 날짜인 경우)
                                    const isNone = current.format('MM') === viewDate.format('MM') ? '' : 'none';

                                    // 해당 날짜의 일정 필터링
                                    const currentSchedules = schedules.filter(schedule => schedule.startDate <= current.format('YYYYMMDD') && schedule.endDate >= current.format('YYYYMMDD'));

                                    return (
                                        <div key={`${week}_${i}`} className={`day-cell ${isSelected} ${isToday} ${isNone}`}onClick={() =>{
                                            if(!healthScheduleStart){
                                                setHealthScheduleStart(current);
                                            }else if(!healthScheduleEnd && current.isAfter(healthScheduleStart)){
                                                setHealthScheduleEnd(current);
                                            }else{
                                                setHealthScheduleStart(current);
                                                setHealthScheduleEnd(null);
                                            }
                                            setSelectDate(current);
                                            setPopupDate(current);
                                            onScheduleChangePopup();
                                        }}>
                                            <div className="date-box">
                                                {current.format('D')}
                                                <div className="schedule-titles">
                                                    {currentSchedules.map((schedule, idx) => (
                                                        <div key={idx} style={{ backgroundColor: 'yellow', width: '100%' }} className="schedule-title">{schedule.title}</div>
                                                    ))}
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
                        scheduleChange={() => setSchedulesChangePopup(false)} 
                        schedules={schedules} 
                        setSchedules={setSchedules} 
                        popupDate={popupDate}
                        setPopupDate={setPopupDate}
                        getScheduleList={() => {}}
                    />
                </div>
            ) : null}
        </div>
    );
}