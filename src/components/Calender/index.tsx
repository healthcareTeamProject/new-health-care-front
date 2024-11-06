import React, { ChangeEvent, useMemo, useState } from "react";
import './style.css'
import dayjs, { Dayjs } from "dayjs";
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';

// interface: 캘린더 Props //
interface CalendarProps {
    selectDate: Dayjs;
    setSelectDate: (date: Dayjs) => void;
    schedules: { date: string; title: string }[];
    setSchedules: (schedules: { date: string; title: string }[]) => void;
}

// component: 캘린더 컴포넌트 //
export default function Calendar({ selectDate, setSelectDate, schedules, setSchedules }: CalendarProps) {
    dayjs.extend(weekday);
    dayjs.extend(isoWeek);
    dayjs.extend(weekOfYear);

    // state: 보여질 날짜 상태 //
    const [viewDate, setViewDate] = useState<Dayjs>(dayjs());
    // state: 일정 상태 관리 //
    const [isPopupOpen, setIsPoupOpen] = useState<boolean>(false);
    const [newSchedule, setNewSchedule] = useState<string>('');
    const [popupDate, setPopupDate] = useState<Dayjs | null>(null);

    // state: 보여질 날짜가 속한 달의 첫 주차 계산 상태 //
    const startWeek = viewDate.startOf('month').week();
    // state: 해당 달의 마지막 주차 상태 //
    const endWeek = viewDate.endOf('month').week() === 1 ? 53 : viewDate.endOf('month').week();
    // state: 요일 배열 상태 //
    const weekDays = useMemo(() => ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT'], []);

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

    // event handler: 일정 추가 이벤트 처리 //
    const handlerAddSchedule = () => {
        if (popupDate && newSchedule) {
            const newSchedules = [...schedules, { date: popupDate.format('YYYY-MM-DD'), title: newSchedule }];
            setSchedules(newSchedules);
            setIsPoupOpen(false);
            setNewSchedule('');
        };
    }

    // event handler: 일정 변경 이벤트 처리 //
    const onScheduleChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = event?.target;
        setNewSchedule(value);
    }
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
                                    const currentSchedules = schedules.filter(schedule => schedule.date === current.format('YYYY-MM-DD'));

                                    return (
                                        <div key={`${week}_${i}`} className={`day-cell ${isSelected} ${isToday} ${isNone}`}>
                                            <div
                                                className="date-box"
                                                onClick={() => {
                                                    setSelectDate(current);
                                                    setPopupDate(current);
                                                    setIsPoupOpen(true);
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
                <div className="pop-up active">
                    <div className="pop-up-content">
                        <div className="pop-up-schedule-date">{popupDate?.format('YYYY-MM-DD')} 일정</div>
                        <div className="pop-up-schedule-box">
                            <textarea className="pop-up-schedule"
                                placeholder="일정을 입력하세요"
                                value={newSchedule}
                                onChange={onScheduleChangeHandler}
                            />
                        </div>
                        <div className="pop-up-button-box">
                            <button onClick={handlerAddSchedule}>추가</button>
                            <button onClick={() => setIsPoupOpen(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
