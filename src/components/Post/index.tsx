import React from 'react';
import { Board } from 'src/types';
import './style.css'

interface Post {
    id: number;
    title: string;
    author: string;
    date: string;
    views: number;
};

const posts: Board[] = [
    { boardNumber: 187, boardTitle: '턱걸이 어꺠 뚜둑 소리', nickname: '마라닭가슴살', boardUploadDate: '2024-10-11 17:15', boardViewCount: 826 },
    { boardNumber: 187, boardTitle: '턱걸이 어꺠 뚜둑 소리', nickname: '마라닭가슴살', boardUploadDate: '2024-10-11 17:15', boardViewCount: 826 },
    { boardNumber: 187, boardTitle: '턱걸이 어꺠 뚜둑 소리', nickname: '마라닭가슴살', boardUploadDate: '2024-10-11 17:15', boardViewCount: 826 },
    { boardNumber: 187, boardTitle: '턱걸이 어꺠 뚜둑 소리', nickname: '마라닭가슴살', boardUploadDate: '2024-10-11 17:15', boardViewCount: 826 },
    { boardNumber: 187, boardTitle: '턱걸이 어꺠 뚜둑 소리', nickname: '마라닭가슴살', boardUploadDate: '2024-10-11 17:15', boardViewCount: 826 },
    { boardNumber: 187, boardTitle: '턱걸이 어꺠 뚜둑 소리', nickname: '마라닭가슴살', boardUploadDate: '2024-10-11 17:15', boardViewCount: 826 },
];

interface TableRowProps {
    board: Board;
}

function TableRow({ board }: TableRowProps) {

    return (
        <div className='tr'>
            <div className='td-number'>{board.boardNumber}</div>
            <div className='td-title'>{board.boardTitle}</div>
            <div className='td-author'>{board.nickname}</div>
            <div className='td-date'>{board.boardUploadDate}</div>
            <div className='td-views'>{board.boardViewCount}</div>
        </div>
    )
}

function CommunityBoard() {
    return (
        <div id='community-board'>
            <div className='board-head'>
                <h2>커뮤니티 게시판</h2>
                <button className='view-more'>
                    더보기
                    <span className="arrow">▶</span>
                </button>
            </div>
            <div className='table'>
                <div className='th'>
                    <div className='td-number'>번호</div>
                    <div className='td-title'>제목</div>
                    <div className='td-author'>작성자</div>
                    <div className='td-date'>작성 날짜</div>
                    <div className='td-views'>조회수</div>
                </div>
                {posts.map((board, index) => <TableRow key={index} board={board} />)}
            </div>
        </div>
    );
}

export default CommunityBoard;