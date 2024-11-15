import React, { useEffect, useState } from 'react';
import { Board } from 'src/types';
import './style.css'
import { useNavigate } from 'react-router';
import { BOARD_DETAIL_ABSOLUTE_PATH, BOARD_LIST_ABSOLUTE_PATH } from 'src/constant';
import { useCookies } from 'react-cookie';
import { usePagination } from 'src/hooks';
import { GetBoardListResponseDto } from 'src/apis/dto/response/board';
import { getBoardListRequest } from 'src/apis';
import { ResponseDto } from 'src/apis/dto/response';

interface TableRowProps {
    board: Board;
    getBoardList: () => void;
}

function TableRow({ board, getBoardList }: TableRowProps) {

    
    // state: cookies 상태 //
    const [cookies] = useCookies();

    const navigator = useNavigate();

    const onDetailButtonClickHandler = () => {
        navigator(BOARD_DETAIL_ABSOLUTE_PATH(board.boardNumber));
    }

    return (
        <div className='tr' onClick={onDetailButtonClickHandler}>
            <div className='td-number'>{board.boardNumber}</div>
            <div className='td-title'>{board.boardTitle}</div>
            <div className='td-author'>{board.userId}</div>
            <div className='td-date'>{board.boardUploadDate}</div>
            <div className='td-views'>{board.boardViewCount}</div>
        </div>
    )
}

export default function CommunityBoard() {

    // state: 페이징 관련 상태 
    const {
        currentPage, totalPage, totalCount, viewList,
        setTotalList, initViewList, ...paginationProps
    } = usePagination<Board>();

    const navigator = useNavigate();

    const [originalList, setOriginalList] = useState<Board[]>([]);

    const onViewMoreButtonClickHandler = () => {
        navigator(BOARD_LIST_ABSOLUTE_PATH);
    }

    // function: board list 불러오기 함수 //
    const getBoardList = () => {
        
        getBoardListRequest().then(getBoardListResponse);
    };

    // function: get board list response 처리 함수 //
    const getBoardListResponse = (responseBody: GetBoardListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { boardList } = responseBody as GetBoardListResponseDto;
        setTotalList(boardList);
        setOriginalList(boardList);
    };

    useEffect(getBoardList, []);

    return (
        <div id='community-board'>
            <div className='board-head'>
                <h2>커뮤니티 게시판</h2>
                <button className='view-more' onClick={onViewMoreButtonClickHandler}>
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
                {viewList.map((board, index) => <TableRow key={index} board={board} getBoardList={getBoardList} />)}
            </div>
        </div>
    );
}