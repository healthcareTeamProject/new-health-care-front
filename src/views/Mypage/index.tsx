import React from 'react'
import './style.css'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// component: 개인정보 컴포넌트 //
function Personal() {

    // render: 개인정보 컴포넌트 렌더딩 //
    return (
        <div className='personal'>
            <div className='personal-logo'></div>
            <div className='personal-buttom'>
                <div className='profile-image'>이미지</div>
                <div className='personal-information'>
                    <div className='name'>
                        <div className='name-title'>이름</div>
                        <div className='name-value'>임의의 이름</div>
                    </div>
                    <div className='nickname'>
                        <div className='nickname-title'>닉네임</div>
                        <div className='nickname-value'>임의의 닉네임</div>
                    </div>
                    <div className='height'>
                        <div className='height-title'>키</div>
                        <div className='height-value'>임의의 키</div>
                    </div>
                </div>
                <div className='personal-goals-box'>
                    <div className='personal-goals-box-icon'></div>
                    <div className='personal-goals-box-buttom'>
                        <div className='personal-goals-box-buttom-title'>개인목표</div>
                        <input className='personal-goals-box-buttom-content' placeholder='개인목표' />
                    </div>
                </div>
            </div>
        </div>
    )

}


// component: 신체정보 컴포넌트 //
function UserMucleFat() {
    const originalData = {
        labels: ['몸무게', '골격근량', '체지방량'],
        values: [70, 30, 15], // 원래 데이터
    };
    
    // 최대 값 설정
    const maxValue = 100;
    
    const data = {
        labels: originalData.labels,
        datasets: [
            {
                data: originalData.values.map(value => (value)), // 정규화하지 않고 실제 값 사용
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y' as const, // 명시적으로 'y'로 설정
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 14,
                        weight: 'bold' as 'bold', // 'bold'로 설정
                        family: 'Arial',
                    },
                },
            },
            x: {
                beginAtZero: true,
                max: maxValue,
                ticks: {
                    stepSize: 20,
                    font: {
                        size: 14,
                        weight: 'bold' as 'bold', // 'bold'로 설정
                        family: 'Arial',
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
        animation: {
            duration: 0,
        },
    };
    
    // render: 신체정보 컴포넌트 렌더딩 //
    return (
        <div className='user-muscle-fat'>
            <div className='chart-top'>
                <div className='chart-title'>골격근 - 지방분석 </div>
                <div className='chart-icon'>ㅇ</div>
            </div>
            <div className='chart-container'>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}


// component: 3대측정 컴포넌트 //
function ThreeMajorLift() {

    // render: 3대측정 컴포넌트 렌더딩 //
    return (
        <div className='three-major-lift'>
            <div className='three-major-lift-top'>
                <div className='three-major-lift-top-title'>3대 측정</div>
                <div className='three-major-lift-top-icon'></div>
            </div>
            <div className='three-major-lift-buttom'>
                <div className='three-major-lift-buttom-title'>
                    <div className='right-border'>밴치프레스</div>
                    <div className='right-border'>데드리프트</div>
                    <div>스쿼트</div>
                </div>
                <div className='three-major-lift-buttom-contents'>
                    <div className='right-border'>110kg</div>
                    <div className='right-border'>120kg</div>
                    <div>100kg</div>
                </div>
            </div>
        </div>
    )

}


// component: 내 게시물 컴포넌트 //
function Board() {

    // render: 내 게시물 컴포넌트 렌더딩 //
    return (
        <div className='board'>
            <div className='board-title'>내 게시물</div>
            <div></div>
        </div>
    )

}


// component: 신체정보 컴포넌트 //
function Graph() {

    // render: 신체정보 컴포넌트 렌더딩 //
    return (
        <div className='graph'>그래프</div>
    )

}


// component: 마이페이지 컴포넌트 //
export default function Mypage() {

    // render: 마이페이지 컴포넌트 렌더딩 //
    return (
        <div id='my-wrapper'>
            
            <div className='my-page-left'>
                <div className='my-page-title'>마이페이지</div>
            </div>
            <div className='my-page-main'>
                <div className='top'>
                    <Personal />
                    <UserMucleFat />
                </div>
                <div className='buttom'>
                    <div className='buttom-left'>
                        <ThreeMajorLift />
                        <Board />
                    </div>
                    <Graph />
                </div>
            </div>
            
        </div>
    )
}
