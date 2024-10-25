import React, { useMemo, useState } from "react";

import dayjs, { Dayjs } from "dayjs";
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';



// interface: 캘린더 Props //
interface CalendarProps{
    selectDate: Dayjs;
    setSelectDate: (date: Dayjs) => void;
}

// component: 캘린더 컴포넌트 //
export default function Calendar({selectDate, setSelectDate}:CalendarProps) {
    
    dayjs.extend(weekday);
    dayjs.extend(isoWeek);
    dayjs.extend(weekOfYear);

    // state: 보여질 날짜 상태 //
    const [viewDate, setViewDate] = useState<Dayjs>(dayjs());

    // state: 보여질 날짜가 속한 달의 첫 주차 계산 상태 //
    const startWeek = viewDate.startOf('month').week();
    // state: 해당 달의 마지막 주차 상태 //
    const endWeek = viewDate.endOf('month').week() === 1 ? 53 : viewDate.endOf('month').week();
    // state: 요일 배열 상태 //
    const weekDays = useMemo(()=> ['일', '월', '화', '수', '목', '금', '토'], []);

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
    } 
    
    // render: 캘린더 컴포넌트 렌더링 //
    return <div className="calendar-container">
                <div className="calendar-header">
                    <button onClick={() => onCalendarMonthChangeClickButtonHandler(viewDate, 'subtract')}>

                    </button>
                </div>
            </div>;
}
