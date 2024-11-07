import React, { useState } from 'react'
import './style.css'
import Calendar from '../../components/Calender'
import dayjs, { Dayjs } from 'dayjs'
import CalendarProps from '../../components/Calender'

export default function Schedule() {

    const [selectDate, setSelectDate] = useState<Dayjs>(dayjs());
    const [schedules, setSchedules] = useState<{ date: string; title: string }[]>([]);
    return (
        <div id='schedule-wrapper'>
            <Calendar selectDate={selectDate} setSelectDate={setSelectDate}/>
        </div>
    )
}
