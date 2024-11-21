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
import { GetMealMemoListResponseDto, GetMealScheduleListResponseDto, GetMealScheduleResponseDto } from "src/apis/dto/response/schedule";
import { useParams } from "react-router";
import { PatchMealScheduleRequestDto, PostMealScheduleRequestDto } from "src/apis/dto/request/schedule";
import { deleteMealScheduleRequest, getMealMemoListRequest, getMealScheduleListRequest, getMealScheduleRequest, patchMealScheduleRequest, postMealScheduleRequest } from "src/apis";
import Schedule from "src/views/Schedule";
import MealSchedule from "src/types/meal-schedule.interface";
import MealMemo from "src/types/meal-memo.interface";
import { usePagination } from "src/hooks";
import Pagination from "../Pagination";

// interface: 캘린더 Props //
interface CalendarProps {
    selectDate: Dayjs;
    setSelectDate: (date: Dayjs) => void;
    schedules: MealSchedule[];
    setSchedules: (schedules: MealSchedule[]) => void;
    resetScheduleInputs: () => void;

}

// interface: 일정 팝업 Props //
interface ScheduleProps{
    scheduleChange: () => void;
    schedules: MealSchedule[];
    popupDate: Dayjs | null;
    getMealScheduleList: () => void;
    MealScheduleNumber: number | null;
    resetScheduleInputs: () => void;
    
}

// component: 일정 팝업 컴포넌트 //
function SchedulePopup({scheduleChange, schedules, popupDate, getMealScheduleList, MealScheduleNumber, resetScheduleInputs}: ScheduleProps){

    // state: 일정 상태 관리 //
    const [cookies] = useCookies();
    // state: 일정 인풋 상태 //
    const [mealTitle, setMealTitle] = useState<string>('');
    const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);
    const [mealScheduleStart, setMealScheduleStart] = useState<Dayjs | null>(null);
    const [mealScheduleEnd, setMealScheduleEnd] = useState<Dayjs | null>(null);
    const [mealMemoList, setMealMemoList] = useState<MealMemo[]>([]);
    // state: 원본 리스트 상태 //
    const {mealScheduleList, setMealScheduleList} = useMealScheduleStroe();
    // state: 검색어 상태 //
    const [searchWord, setSearchWord] = useState<string>('');
    // state: 원본 리스트 상태 //
    const [mealOriginalList, setMealOriginalList] = useState<MealMemo[]>([]);
    // state: 개수 상태 관리 //
    const [mealCounts, setMealCounts] = useState<Record<string, number>>({});
    // state: 검색어 리스트 상태 //
    const [filteredMealMemoList, setFilteredMealMemoList] = useState<MealMemo[]>([]); // 검색된 리스트 상태 추가
    // state: 페이징 관련 상태 //
    const {
        currentPage, totalPage, totalCount, viewList,
        setTotalList, initViewList, ...paginationProps
    } = usePagination<MealMemo>();

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
        scheduleChange();
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

    // function: get Meal Memo list response 처리 함수 //
    const getMealMemoListResponse = (responseBody: GetMealMemoListResponseDto | ResponseDto | null) => {
        const message = 
        !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.': '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if(!isSuccessed){
            alert(message);
            return;
        }
        const {mealMemoList} = responseBody as GetMealMemoListResponseDto;
        setMealMemoList(mealMemoList);
    }
    // event handler: 식사타입 변경 클릭 이벤트 핸들러 //
    const onMealTypeClickHandler = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
        setMealType(mealType);
        setMealTitle(mealType); // 선택한 식사 타입을 설정
    }
    
    // event handler: 팝업 닫기 클릭 이벤트 핸들러 //
    const onClosePopupHandler = () => {
        setMealType(null);
        resetScheduleInputs();
    }

    // event handler: 일정 추가 이벤트 처리 핸들러 //
    const onPostMealScheduleButtonClickHandler = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;
        if(!mealScheduleStart) return;
        if(!mealScheduleEnd) return;

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
        scheduleChange();
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
        resetScheduleInputs();
        
    };

    // event handler: 검색어 입력 이벤트 처리 함수 //
    const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchWord(value);
    
        if (value.trim() === '') {
        // 검색어가 비어있다면 전체 리스트를 보여줍니다.
        setFilteredMealMemoList(mealOriginalList);
        } else {
        // 검색어가 있다면 원본 리스트를 필터링해서 보여줍니다.
        const filteredList = mealOriginalList.filter(mealMemoList =>
            mealMemoList.mealName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredMealMemoList(filteredList);
        }
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

    // event handler: 개수 증가 이벤트 처리 //
    const onUpCountHandler = (mealName: string) =>{
        setMealCounts((prevCounts) => ({
            ...prevCounts,
            [mealName]: (prevCounts[mealName] || 0) + 1,
        }));
    }

    // event handler: 개수 감소 이벤트 처리 //
    const onDownCountHandler = (mealName: string) => {
        setMealCounts((prevCount) => {
            const newCount = Math.max((prevCount[mealName] || 0) - 1, 0);
            return{
                ...prevCount,
                [mealName]: newCount,
            };
        });
    };

    // event handler: 저장 버튼 클릭 이벤트 처리 //
    const onSaveMealMemoClickHandler = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if(!accessToken) return;

        // mealMemo 데이터를 저장할 때 count 값도 포함시킵니다.
        const mealMemoCountToSave = mealMemoList
            .filter((mealMemo) => mealCounts[mealMemo.mealName] > 0) // count가 0보다 큰 것만 저장
            .map((mealMemo) => ({
                ...mealMemo,
                count: mealCounts[mealMemo.mealName] || 0, // 각 항목의 개수를 상태에서 가져옵니다
            }));

            if(mealMemoCountToSave.length === 0){
                alert('하나 이상의 항복을 선택해주세요.');
                return;
            }
        // event handler: 검색어 변경 이벤트 처리 //
        const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setSearchWord(value);
        }

        // event handler: 검색어 버튼 클릭 이벤트 처리 //
        const onSearchButtonClickHandler = () => {
            const searchedMealMemoList = mealOriginalList.filter(mealMemo => mealMemo.mealName.includes(searchWord));
            setTotalList(searchedMealMemoList);
            initViewList(searchedMealMemoList);
        }
    }

    // effect: 식단 스케줄이 변경될 시 실행할 함수 //
    useEffect(() => {
        const accessToken = cookies[ACCESS_TOKEN];
        if(!accessToken || MealScheduleNumber === null) return;
        getMealScheduleRequest(MealScheduleNumber, accessToken).then(getMealScheduleResponse)
        }, [cookies, MealScheduleNumber]);
    
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

    // // effect: meal Memo 데이터 가져올 때 실행할 함수 //
    // useEffect(() => {
    //     const accessToken = cookies[ACCESS_TOKEN];
    //     if(!accessToken) return;
    //     // 모든 mealMemo 리스트 가져오기
    //     getMealMemoListRequest(accessToken).then(getMealMemoListResponse);
    //     // 가져온 mealMemo 리스트에 대해 초기 count 값을 0으로 설정
    //     if(mealScheduleList){
    //         const initialCount: Record<string, number> = {};
    //         mealScheduleList.forEach((mealMemo) => {
    //             initialCount[mealMemo.mealTitle] = 0;
    //         });
    //         setMealCounts(initialCount);
    //     }
    // }, [cookies]);

    // render: 일정 추가 컴포넌트 렌더링 //
    return(
        <div className="meal-schedule-title-popup">
            <div className="meal-schedule-detail-box">
                <div className="meal-schedule-today-box">
                    <div className="meal-schedule-today">TODAY</div>
                </div>
                <div className="meal-schedule-breackfast-box" onClick={() => onMealTypeClickHandler('breakfast')}>
                    <div className="meal-schedule-breackfast">아침</div>
                </div>
                <div className="meal-schedule-lunch-box" onClick={() => onMealTypeClickHandler('lunch')}>
                    <div className="meal-schedule-lunch">점심</div>
                </div>
                <div className="meal-schedule-dinner-box" onClick={() => onMealTypeClickHandler('dinner')}>
                    <div className="meal-schedule-dinner">저녁</div>
                </div>
            </div>
            {mealType && (
                <div className="meal-search-popup">
                    <div className="meal-search-top">
                        <div className="meal-search-detail-box">
                            <input type="text" placeholder="식품명을 입력하세요"/>
                        </div>
                        <div className="meal-search-detail-button"></div>
                    </div>
                    <div className="meal-search-middle">
                        <div className="meal-search-middle-top">
                            <div className="meal-search-middle-top-name">식품명</div>
                            <div className="meal-search-middle-top-kcal">칼로리</div>
                            <div className="meal-search-middle-top-item">개수</div>
                        </div>
                        {/* mealMemo 데이터를 렌더링 */}
                    {filteredMealMemoList.length > 0 ? (
                        filteredMealMemoList.map((mealMemo, index) => (
                        <div key={index} className="meal-search-middle-item">
                            <div className="meal-search-item-name">{mealMemo.mealName}</div>
                            <div className="meal-search-item-kcal">{mealMemo.mealKcal} kcal</div>
                            <div className="meal-search-item-count">
                                <button onClick={() => onDownCountHandler(mealMemo.mealName)}>-</button>
                                <span>{mealCounts[mealMemo.mealName] || 0}</span>
                                <button onClick={() => onUpCountHandler(mealMemo.mealName)}>+</button>
                            </div>
                        </div>
                        ))
                    ) : (
                        <div className="meal-search-middle-no-item">식품이 없습니다.</div>
                    )}
                    </div>
                    <div className="meal-search-pagination">
                        <Pagination currentPage={currentPage} {...paginationProps} />
                    </div>
                    <div className="meal-search-button-box">
                        <div className="meal-search-button-cancel">취소</div>
                        <div className="meal-search-button-save">저장</div>
                    </div>
                <div className="meal-detail-box">
                    <div className="meal-detail-title">
                        <div className="meal-detail-title-name">식품명</div>
                        <div className="meal-detail-title-kcal">칼로리</div>
                        <div className="meal-detail-title-count">개수</div>
                    </div>
                    <div className="meal-detail-middle">맵 존재할 위치</div>
                    <div className="meal-detail-bottom">
                        <div className="meal-detail-bottom-title">총 칼로리</div>
                        <div className="meal-detail-bottom-total-kcal">총 칼로리 넣을 위치</div>
                    </div>
                    <div className="meal-detail-button-box">
                        <div className="meal-detail-button-cancel">취소</div>
                        <div className="meal-detail-button-save">저장</div>
                    </div>
                </div>
                </div>
            )}
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
        resetScheduleInputs();
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
        resetScheduleInputs();
    }

    // function: 일정 입력 초기화 함수 //
    const resetScheduleInputs = () => {
        setMealTitle("");
        setMealScheduleStart(null);
        setMealScheduleEnd(null);
        setMealMemoList([]);
        setMealScheduleNumber(null);
    };

    
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
                        MealScheduleNumber={mealScheduleNumber} 
                        resetScheduleInputs={resetScheduleInputs}/>
                </div>
            ) : null}
        </div>
    );
}