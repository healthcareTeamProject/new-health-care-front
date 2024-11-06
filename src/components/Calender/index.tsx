import React, { useMemo, useState } from "react";
import './style.css'
import dayjs, { Dayjs } from "dayjs";
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import {MdArrowBackIos, MdArrowForwardIos} from 'react-icons/md';
import Schedule from "src/views/Schedule";

// interface: 캘린더 Props //
interface CalendarProps{
    selectDate: Dayjs;
    setSelectDate: (date: Dayjs) => void;
    schedules: {date: string; title: string} [];
    setSchedules: (schedules: { date: string; title: string }[]) => void;
}

//  component: 일정 팝업 컴포넌트 //
function ScheduleAddPopup({popupDate, newSchedule, setNewSchedule, handlerAddScheule, setIsPopupOpen}:{
    popupDate: Dayjs | null;
    newSchedule: string;
    setNewSchedule: (value: string) => void;
    handlerAddScheule: () => void;
    setIsPopupOpen: (value: boolean) => void;
}){
    return(
        <div className="pop-up">
            <div className="popup-content">
                <h3>{popupDate?.format('YYYY-MM-DD')} 일정 추가</h3>
                <input type="text" value={newSchedule} onChange={(e) => setNewSchedule(e.target.value)} placeholder="일정을 입력하세요" />
                <button onClick={handlerAddScheule}>추가</button>
                <button onClick={() => setIsPopupOpen(false)}>취소</button>
            </div>
        </div>
    );
}

// component: 캘린더 컴포넌트 //
export default function Calendar({selectDate, setSelectDate, schedules, setSchedules}:CalendarProps) {
    
    dayjs.extend(weekday);
    dayjs.extend(isoWeek);
    dayjs.extend(weekOfYear);

    // state: 보여질 날짜 상태 //
    const [viewDate, setViewDate] = useState<Dayjs>(dayjs());
    // state: 일정 상태 관리 //
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [newSchedule, setNewSchedule] = useState<string>('');
    const [popupDate, setPopupDate] = useState<Dayjs | null>(null);

    // state: 보여질 날짜가 속한 달의 첫 주차 계산 상태 //
    const startWeek = viewDate.startOf('month').week();
    // state: 해당 달의 마지막 주차 상태 //
    const endWeek = viewDate.endOf('month').week() === 1 ? 53 : viewDate.endOf('month').week();
    // state: 요일 배열 상태 //
    const weekDays = useMemo(()=> ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT'], []);

    // event handler: 달 변경 클릭 이벤트 처리 //
    const onCalendarMonthChangeClickButtonHandler = (date: Dayjs, changeString: 'add' | 'subtract' | 'today') => {
        // 다음 달로 이동 //
        if(changeString === 'add'){
            return setViewDate(viewDate.add(1, 'month'));
        // 이전 달로 이동 //
        }else if(changeString === 'subtract'){
            return setViewDate(viewDate.subtract(1, 'month'));
        // 오늘 날짜로 이동 //
        }else if(changeString === 'today'){
            return setViewDate(dayjs());
        }else{
            return date;
        }
    };

    // event handler: 일정 추가 이벤트 처리 //
    const handlerAddScheule = () => {
        if(popupDate && newSchedule){
            const newSchedules = [...schedules, { date: popupDate.format('YYYY-MM-DD'), title: newSchedule }];
            setSchedules(newSchedules);
            setIsPopupOpen(false);
            setNewSchedule('');
        };
    }
    
    // render: 캘린더 컴포넌트 렌더링 //
    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={() => onCalendarMonthChangeClickButtonHandler(viewDate, 'subtract')}>
                    <MdArrowBackIos/>
                </button>
                <span onClick={() => onCalendarMonthChangeClickButtonHandler(viewDate, 'today')}>{viewDate.format('YYYY.M')}</span>
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
                    {Array.from({length: endWeek - startWeek + 1}, (_, index) => startWeek + index).map((week) =>(
                        <div key={week} className="week">
                            {Array(7)
                                .fill(0)
                                .map((_, i) => {
                                    const current = viewDate.week(week).startOf('week').add(i, 'day');
                                    const isSelected = selectDate.format('YYYYMMDD') === current.format('YYYYMMDD') ? 'selected' : '';
                                    const isToday = dayjs().format('YYYYMMDD') === current.format('YYYYMMDD') ? 'today' : '';
                                    const isNone = current.format('MM') === viewDate.format('MM') ? '' : 'none';

                                    const currentSchedules = schedules.filter(schedule => schedule.date === current.format('YYYY-MM-DD'));

                                    return(
                                        <div key={`${week}_${i}`} className={`day-cell ${isSelected} ${isToday} ${isNone}`}>
                                            <div
                                                className="date-box"
                                                onClick={()=> {
                                                    setSelectDate(current);
                                                    setPopupDate(current);
                                                    setIsPopupOpen(true);
                                                }}
                                            >
                                                {current.format('D')}
                                                <div className="schedule-titles">
                                                    {currentSchedules.map((schedule, idx) => (
                                                        <div key={idx} className="schedule-title">{schedule.title}</div>
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
            {isPopupOpen && (
                    <ScheduleAddPopup 
                    popupDate={popupDate} 
                    newSchedule={newSchedule} 
                    setNewSchedule={setNewSchedule}
                    handlerAddScheule={handlerAddScheule}
                    setIsPopupOpen={setIsPopupOpen}
                    /> 
                )
                }
        </div>
    );
};