import React, { useState } from 'react'
import './style.css'
import Calendar from '../../components/MiniCalender'
import dayjs, { Dayjs } from 'dayjs'
import CalendarProps from '../../components/MiniCalender'
import MiniCalendar from '../../components/MiniCalender'

export default function Schedule() {

    const [selectDate, setSelectDate] = useState<Dayjs>(dayjs());
    const [schedules, setSchedules] = useState<{ date: string; title: string }[]>([]);
    return (
        <div id='schedule-wrapper'>
            <div className='mini-planner-box'>
                <div className='workout-planner-box'>
                    <div className='days-workout'>30 DAYS WORKOUT PLANNER</div>
                </div>
                <div className='calender-box'>
                    <MiniCalendar selectDate={selectDate} setSelectDate={setSelectDate}/>
                </div>
            </div>
            <div className='schedule-detail-box'>
                <div className='big-schedule-box'>

                </div>
                
            </div>
        </div>
    )
}
