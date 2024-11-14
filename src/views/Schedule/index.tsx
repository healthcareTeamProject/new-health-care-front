import React, { useState } from 'react'
import './style.css'
import Calendar from '../../components/MiniCalender'
import dayjs, { Dayjs } from 'dayjs'
import SchedulePopup from '../../components/MiniCalender'
import MiniCalendar from '../../components/MiniCalender'
import BigCalendar from 'src/components/BigCalender'


export default function Schedule() {

    const [selectDate, setSelectDate] = useState<Dayjs>(dayjs());
    const [schedules, setSchedules] = useState<{ startDate: string; endDate: string; title: string }[]>([]);
    const [popupDate, setPopupDate] = useState<Dayjs | null>(null);

    const closePopup = () => setPopupDate(null);

    return (
        <div id='schedule-wrapper'>
            <div className='schedule-detail-box'>
                <div className='mini-planner-box'>
                    <div className='workout-planner-box'>
                        <div className='days-workout'>30 DAYS WORKOUT PLANNER</div>
                    </div>
                    <div className='calender-box'>
                        <MiniCalendar selectDate={selectDate} setSelectDate={setSelectDate} schedules={schedules} setSchedules={setSchedules}/>
                    </div>
                </div>
                <div className='big-schedule-box'>
                    <BigCalendar selectDate={selectDate} setSelectDate={setSelectDate}/>
                </div>
            </div>
        </div>
    );
}
