import React from 'react';
import Topbar from 'src/layouts/Topbar';
import './style.css';
import Pagination from 'src/components/Pagination';
import { usePagination } from 'src/hooks';
import { Board } from 'src/types';
import { useLocation } from 'react-router';
import CommunityBoard from 'src/components/Post';

// 카테고리 컴포넌트

const categories = ['식단', '홈 트레이닝', '운동기구', '헬스장'];

// 인기태그 컴포넌트

const popularTags1 = ['#운동일지', '#영양식단', '#상체', '#어깨', '#하체', '#등',
    '#허리', '#가슴', '#체중감량', '#보충제'
];

const popularTags2 = ['#대회식단', '#일반식단', '#단백질',
    '#부상/재활', '#유산소', '#맨몸운동', '#전신운동', '#다이어트 식단', '#영양제', '#바디프로필'
];

interface BoardItem {
    id: number;
    title: string;
    author: string;
    date: string;
    views: number;
}

const boardData: BoardItem[] = [
    { id: 187, title: '턱걸이 어꺠 뚜둑 소리', author: '마라탕가슴살', date: '2024-10-11 17:15', views: 826 },
    { id: 187, title: '턱걸이 어꺠 뚜둑 소리', author: '마라탕가슴살', date: '2024-10-11 17:15', views: 826 },
    { id: 187, title: '턱걸이 어꺠 뚜둑 소리', author: '마라탕가슴살', date: '2024-10-11 17:15', views: 826 },
    { id: 187, title: '턱걸이 어꺠 뚜둑 소리', author: '마라탕가슴살', date: '2024-10-11 17:15', views: 826 },
    { id: 187, title: '턱걸이 어꺠 뚜둑 소리', author: '마라탕가슴살', date: '2024-10-11 17:15', views: 826 },
    { id: 187, title: '턱걸이 어꺠 뚜둑 소리', author: '마라탕가슴살', date: '2024-10-11 17:15', views: 826 },
    { id: 187, title: '턱걸이 어꺠 뚜둑 소리', author: '마라탕가슴살', date: '2024-10-11 17:15', views: 826 },
    { id: 187, title: '턱걸이 어꺠 뚜둑 소리', author: '마라탕가슴살', date: '2024-10-11 17:15', views: 826 },
    { id: 187, title: '턱걸이 어꺠 뚜둑 소리', author: '마라탕가슴살', date: '2024-10-11 17:15', views: 826 },
    { id: 187, title: '턱걸이 어꺠 뚜둑 소리', author: '마라탕가슴살', date: '2024-10-11 17:15', views: 826 },
];

// component: 카테고리-인기태그 컴포넌트 

function CategoryPopularTag() {

    const { pathname } = useLocation();


    // component: 카테고리-인기태그 컴포넌트 
    return (
        <div className="categoryHead">
                    <label className='category'>카테고리</label>
                    <div className='category-search'>
                        <div className='categories'>
                            {categories.map((category) => (
                                <button key={category} className='category-button'>
                                    {category}
                                </button>
                            ))}
                        </div>
                        <div id="search">
                            <input type="text" placeholder="검색어 입력" />
                            <button className='searchButton'>
                                ''
                            </button>
                        </div>
                    </div>
            <div className='mid'>
                <label className="popularTag">인기태그</label>
                <div className="popularTags1">
                    {popularTags1.map((popularTag) => (
                        <button key={popularTag} className="popularTag-button1">
                            {popularTag}
                        </button>
                    ))}
                </div>
                <div className="popularTags2">
                    {popularTags2.map((popularTag) => (
                        <button key={popularTag} className="popularTag-button2">
                            {popularTag}
                        </button>
                    ))}
                </div>
            </div>
            <div className='main'>
                <div className="board-table">
                    <div className='th'>
                        <div className='td-number'>번호</div>
                        <div className='td-title-button'>제목</div>
                        <div className='td-author'>작성자</div>
                        <div className='td-date'>날짜</div>
                        <div className='td-views'>조회수</div>
                    </div>
                </div>
            </div>
        </div>    
    )
}


export default function Community() {

    const {
        currentPage, totalPage, totalCount, viewList,
        setTotalList, initViewList, ...paginationProps
    } = usePagination<Board>();

    return (
        <div id='cm-wrapper'>
            <Topbar />
            <div className='top'>
                <CategoryPopularTag />
                <div>
                    <tbody>
                        {boardData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.title}</td>
                                <td>{item.author}</td>
                                <td>{item.date}</td>
                                <td>{item.views}</td>
                            </tr>
                        ))}
                    </tbody>
                </div>
            </div>
            <div className='bottom'>
                <Pagination currentPage={currentPage} {...paginationProps} />
                <button className="post-on">글쓰기</button>
            </div>
            <CommunityBoard />
        </div>
    );
}
