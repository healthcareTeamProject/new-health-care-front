import React from 'react';
import './style.css';
import TopBar from 'src/layouts/Topbar';

// 카테고리 컴포넌트

const categories = ['식단', '홈 트레이닝', '운동기구', '헬스장'];



function Category () {

    return (
        <>
        <TopBar />
        <div className="categoryKing">
            <label className='category'>카테고리</label>
            <div className='category-search'>
                <div className='categories'>
                        {categories.map((category) => (
                            <button key={category} className='category-button'>
                                {category}
                            </button>
                        ))}
                </div>
                    <div id="container">
                        <input type="text" placeholder="검색어 입력" />   
                        <button>
                            <img src="/images/searchIcon.png" alt="search" />
                        </button>
                    </div>
            </div>
        </div> 
        </>   
    );

};

// 인기태그 컴포넌트

const popularTags1 = ['#운동일지', '#영양식단', '#상체', '#어깨', '#하체', '#등',
    '#허리', '#가슴', '#체중감량', '#보충제'
];

const popularTags2 = ['#대회식단', '#일반식단', '#단백질',
    '#부상/재활', '#유산소', '#맨몸운동', '#전신운동', '#다이어트 식단', '#영양제', '#바디프로필'
];

function PopularTag() {

    return (
        <div>
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
    );
};

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

function Table() {
    return (
        <table className="board-table">
            <thead>
                <tr className="table1">
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성 날짜</th>
                    <th>조회수</th>
                </tr>
            </thead>
            <tbody>
                {boardData.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.title}</td>
                        <td>{item.author}</td>
                        <td>{item.date}</td>
                        <td>{item.views}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function Pagination() {

    return (
        <div className="pagination">
            <button>&lt; Previous</button>
            <button>1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
            <button>5</button>
            <button>6</button>
            <button>7</button>
            <button>8</button>
            <button>9</button>
            <button>10</button>
            <button>Next &gt;</button>
            <div>
                <button>글쓰기</button>
            </div>
        </div>
        );
};



export default function Community() {

    return (
        <>
        <Category />
        <PopularTag />
        <Table />
        <Pagination />
        </>
    );
}