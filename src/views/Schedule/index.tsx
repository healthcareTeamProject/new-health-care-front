import React, { useEffect, useState } from 'react'
import './style.css'
import Calendar from '../../components/MiniCalender'
import dayjs, { Dayjs } from 'dayjs'
import SchedulePopup from '../../components/MiniCalender'
import MiniCalendar from '../../components/MiniCalender'
import BigCalendar from 'src/components/BigCalender'
import { useCookies } from 'react-cookie'
import { useHealthSchedulStroe, useMealScheduleStroe, useSignInCustomerStroe } from 'src/stores'
import { useNavigate } from 'react-router'
import { ACCESS_TOKEN, MAIN_ABSOLUTE_PATH } from 'src/constant'
import { HealthSchedule } from 'src/types'
import BigCalendarMeal from 'src/components/BigCalenderMeal'
import MiniCalendarMeal from 'src/components/MiniCalenderMeal'
import MealSchedule from 'src/types/meal-schedule.interface'


export default function Schedule() {

    // state: cookie 상태 //
    const [cookies] = useCookies();
    // state: 로그인 사용자 상태 //
    const {signInCustomer} = useSignInCustomerStroe();

    // state: 캘린더 상태 //
    const [selectDate, setSelectDate] = useState<Dayjs>(dayjs());
    const [healthSchedules, setHealthSchedules] = useState<HealthSchedule[]>([]);
    const [mealSchedules, setMealSchedules] = useState<MealSchedule[]>([]);

    // state: 캘린더 선택 상태 //
    const [selectCalendar, setSelectCalendar] = useState<boolean>(true);
     // state: 원본 리스트 상태 //
    const {healthScheduleList, setHealthScheduleList} = useHealthSchedulStroe();
    const {mealScheduleList, setMealScheduleList} = useMealScheduleStroe();

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: 헬스 일정 입력 초기화 함수 //
    const resetHealthScheduleInputs = () => {
        setHealthScheduleList(healthScheduleList);
    }
    // function: 식단 일정 입력 초기화 함수 //
    const resetMealScheduleInputs = () => {
        setMealScheduleList(mealScheduleList);
    }
    // event handler: 운동, 식단 선택 //
    const onSelectHealthCalendarClickHandler = () => {
        setSelectCalendar(true);
    }

    // event handler: 운동, 식단 선택 //
    const onSelectMealCalendarClickHandler = () => {
        setSelectCalendar(false);
    }
    // effect: 쿠키 유효성 검사 및 사용자 로그인 되어있는지 확인 요청 //
    useEffect(() => {
        const accessToken = cookies[ACCESS_TOKEN];
        if(!accessToken){
            navigator(MAIN_ABSOLUTE_PATH)
            return;
        }
    }, [cookies]);
    
    // render: 캘린더 컴포넌트 렌더링 //
    return (
        <div id='schedule-wrapper'>
            <div className='schedule-detail-box'>
                <div className='mini-planner-box'>
                    <div className='workout-planner-box'>
                        <div className='days-workout'>30 DAYS WORKOUT PLANNER</div>
                    </div>
                    <div className='calender-box'>
                        {selectCalendar ?
                            <MiniCalendar selectDate={selectDate} setSelectDate={setSelectDate} schedules={healthSchedules} setSchedules={setHealthSchedules}/> :
                            <MiniCalendarMeal selectDate={selectDate} setSelectDate={setSelectDate} schedules={mealSchedules} setSchedules={setMealSchedules}/>
                        }
                    </div>
                </div>
                <div className='schedule-right-big-box'>
                    <div className='schedule-change-button-box'>
                        <button className='health-schedule-button' onClick={onSelectHealthCalendarClickHandler}>운동</button>
                        <button className='meal-schedule-button' onClick={onSelectMealCalendarClickHandler}>식단</button>
                    </div>
                    <div className='big-schedule-box'>
                        {selectCalendar ?
                            <BigCalendar selectDate={selectDate} setSelectDate={setSelectDate} schedules={healthSchedules} setSchedules={setHealthSchedules} resetScheduleInputs={resetHealthScheduleInputs}/> :
                            <BigCalendarMeal selectDate={selectDate} setSelectDate={setSelectDate} schedules={mealSchedules} setSchedules={setMealSchedules} resetScheduleInputs={resetMealScheduleInputs}/>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
