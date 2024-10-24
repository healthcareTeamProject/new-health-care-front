import React from 'react';

interface Post {
    id: number;
    title: string;
    author: string;
    date: string;
    views: number;
};

const posts: Post[] = [
    { id: 187, title: '턱걸이 어꺠 뚜둑 소리', author: '마라닭가슴살', date: '2024-10-11 17:15', views: 826 },
    { id: 187, title: '턱걸이 어꺠 뚜둑 소리', author: '마라닭가슴살', date: '2024-10-11 17:15', views: 826 },
    { id: 187, title: '턱걸이 어꺠 뚜둑 소리', author: '마라닭가슴살', date: '2024-10-11 17:15', views: 826 },
    { id: 187, title: '턱걸이 어꺠 뚜둑 소리', author: '마라닭가슴살', date: '2024-10-11 17:15', views: 826 },
    { id: 187, title: '턱걸이 어꺠 뚜둑 소리', author: '마라닭가슴살', date: '2024-10-11 17:15', views: 826 },
    { id: 187, title: '턱걸이 어꺠 뚜둑 소리', author: '마라닭가슴살', date: '2024-10-11 17:15', views: 826 },
];

function CommunityBoard() {
    return (
        <div className="community-board">
            <h2>커뮤니티 게시판</h2>
            <div className='table'>
                <div className='th'>
                    <div className='td-number'>번호</div>
                    <div className='td-title'>제목</div>
                    <div className='td-author'>작성자</div>
                    <div className='td-date'>작성 날짜</div>
                    <div className='td-views'>조회수</div>
                </div>
                {posts.map((post, index) => (
                    <div key={index}>
                        <div>{post.id}</div>
                        <div>{post.title}</div>
                        <div>{post.author}</div>
                        <div>{post.date}</div>
                        <div>{post.views}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CommunityBoard;