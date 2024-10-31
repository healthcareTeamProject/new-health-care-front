import React from 'react';
import Topbar from 'src/layouts/Topbar';
import './style.css';
import Pagination from 'src/components/Pagination';
import { usePagination } from 'src/hooks';
import { useLocation, useNavigate } from 'react-router';
import { Board } from 'src/types';
import { ACCESS_TOKEN, BC_ABSOLUTE_PATH, BC_PATH, BE_ABSOLUTE_PATH, BE_PATH, BP_ABSOLUTE_PATH, BP_PATH, CH_ABSOLUTE_PATH, CH_PATH, CM_ABSOLUTE_PATH, CM_PATH, CO_ABSOLUTE_PATH, CO_PATH, DM_ABSOLUTE_PATH, DM_PATH, ED_ABSOLUTE_PATH, ED_PATH, FE_ABSOLUTE_PATH, FE_PATH, GE_ABSOLUTE_PATH, GE_PATH, GM_ABSOLUTE_PATH, GM_PATH, HT_ABSOLUTE_PATH, HT_PATH, IR_ABSOLUTE_PATH, IR_PATH, LB_ABSOLUTE_PATH, LB_PATH, MA_ABSOLUTE_PATH, MA_PATH, NM_ABSOLUTE_PATH, NM_PATH, NS_ABSOLUTE_PATH, NS_PATH, POST_ABSOLUTE_PATH, PT_ABSOLUTE_PATH, PT_PATH, RM_ABSOLUTE_PATH, RM_PATH, SD_ABSOLUTE_PATH, SD_PATH, SM_ABSOLUTE_PATH, SM_PATH, UB_ABSOLUTE_PATH, UB_PATH, WI_ABSOLUTE_PATH, WI_PATH, WL_ABSOLUTE_PATH, WL_PATH } from 'src/constant';


// 카테고리 컴포넌트

const categories = ['식단', '홈 트레이닝', '운동기구', '헬스장'];

// 인기태그 컴포넌트

const popularTags1 = ['#운동일지', '#영양식단', '#상체', '#어깨', '#하체', '#등',
    '#허리', '#가슴', '#체중감량', '#보충제'
];

const popularTags2 = ['#대회식단', '#일반식단', '#단백질',
    '#부상/재활', '#유산소', '#맨몸운동', '#전신운동', '#다이어트 식단', '#영양제', '#바디프로필'
];

const posts: Board[] = [
    { boardNumber: 187, boardTitle: '턱걸이 어꺠 뚜둑 소리', nickname: '마라탕가슴살', boardUploadDate: '2024-10-11 17:15', boardViewCount: 826 },
    { boardNumber: 187, boardTitle: '턱걸이 어꺠 뚜둑 소리', nickname: '마라탕가슴살', boardUploadDate: '2024-10-11 17:15', boardViewCount: 826 },
    { boardNumber: 187, boardTitle: '턱걸이 어꺠 뚜둑 소리', nickname: '마라탕가슴살', boardUploadDate: '2024-10-11 17:15', boardViewCount: 826 },
    { boardNumber: 187, boardTitle: '턱걸이 어꺠 뚜둑 소리', nickname: '마라탕가슴살', boardUploadDate: '2024-10-11 17:15', boardViewCount: 826 },
    { boardNumber: 187, boardTitle: '턱걸이 어꺠 뚜둑 소리', nickname: '마라탕가슴살', boardUploadDate: '2024-10-11 17:15', boardViewCount: 826 },
    { boardNumber: 187, boardTitle: '턱걸이 어꺠 뚜둑 소리', nickname: '마라탕가슴살', boardUploadDate: '2024-10-11 17:15', boardViewCount: 826 },
    { boardNumber: 187, boardTitle: '턱걸이 어꺠 뚜둑 소리', nickname: '마라탕가슴살', boardUploadDate: '2024-10-11 17:15', boardViewCount: 826 },
    { boardNumber: 187, boardTitle: '턱걸이 어꺠 뚜둑 소리', nickname: '마라탕가슴살', boardUploadDate: '2024-10-11 17:15', boardViewCount: 826 },
    { boardNumber: 187, boardTitle: '턱걸이 어꺠 뚜둑 소리', nickname: '마라탕가슴살', boardUploadDate: '2024-10-11 17:15', boardViewCount: 826 },
    { boardNumber: 187, boardTitle: '턱걸이 어꺠 뚜둑 소리', nickname: '마라탕가슴살', boardUploadDate: '2024-10-11 17:15', boardViewCount: 826 }
];

interface TableRowProps {
    board: Board;
    getBoardList: () => void;
}

function TableRow({ board, getBoardList }: TableRowProps) {

    


    return (
        <div className='content'>
            <div className='number'>{board.boardNumber}</div>
            <div className='title'>{board.boardTitle}</div>
            <div className='author'>{board.nickname}</div>
            <div className='date'>{board.boardUploadDate}</div>
            <div className='views'>{board.boardViewCount}</div>
        </div>
    )
}

// component: 카테고리 네비게이션
function CategoryNavigation() {

    const { pathname } = useLocation();

    const isMa = pathname.startsWith(MA_PATH);
    const isHt = pathname.startsWith(HT_PATH);
    const isGe = pathname.startsWith(GE_PATH);
    const isGm = pathname.startsWith(GM_PATH);

    const navigator = useNavigate();

    const onItemClickHandler = (path: string) => {
        navigator(path);
    };

    return (
        <div className='categories'>
            <div className={`navigation-item ${isMa ? 'active' : ''}`} onClick={() => onItemClickHandler(MA_ABSOLUTE_PATH)}>
                <div className='item-text'>식단</div>
            </div>
            <div className={`navigation-item ${isHt ? 'active' : ''}`} onClick={() => onItemClickHandler(HT_ABSOLUTE_PATH)}>
                <div className='item-text'>홈 트레이닝</div>
            </div>
            <div className={`navigation-item ${isGe ? 'active' : ''}`} onClick={() => onItemClickHandler(GE_ABSOLUTE_PATH)}>
                <div className='item-text'>운동기구</div>
            </div>
            <div className={`navigation-item ${isGm ? 'active' : ''}`} onClick={() => onItemClickHandler(GM_ABSOLUTE_PATH)}>
                <div className='item-text'>헬스장</div>
            </div>
        </div>
    )

};

// component: 인기태그 네비게이션
function PopularTagNavigation() {

    const { pathname } = useLocation();

    const isEd = pathname.startsWith(ED_PATH);
    const isNm = pathname.startsWith(NM_PATH);
    const isUb = pathname.startsWith(UB_PATH);
    const isSd = pathname.startsWith(SD_PATH);
    const isLb = pathname.startsWith(LB_PATH);
    const isBc = pathname.startsWith(BC_PATH);
    const isWi = pathname.startsWith(WI_PATH);
    const isCh = pathname.startsWith(CH_PATH);
    const isWl = pathname.startsWith(WL_PATH);
    const isSm = pathname.startsWith(SM_PATH);
    const isCm = pathname.startsWith(CM_PATH);
    const isRm = pathname.startsWith(RM_PATH);
    const isPt = pathname.startsWith(PT_PATH);
    const isIr = pathname.startsWith(IR_PATH);
    const isCo = pathname.startsWith(CO_PATH);
    const isBe = pathname.startsWith(BE_PATH);
    const isFe = pathname.startsWith(FE_PATH);
    const isDm = pathname.startsWith(DM_PATH);
    const isNs = pathname.startsWith(NS_PATH);
    const isBp = pathname.startsWith(BP_PATH);

    const navigator = useNavigate();

    const onItemClickHandler = (path: string) => {
        navigator(path);
    };

    return (
        <div className='categories'>
            <div className={`navigation-item ${isEd ? 'active' : ''}`} onClick={() => onItemClickHandler(ED_ABSOLUTE_PATH)}>
                <div className='item-text'>#운동일지</div>
            </div>
            <div className={`navigation-item ${isNm ? 'active' : ''}`} onClick={() => onItemClickHandler(NM_ABSOLUTE_PATH)}>
                <div className='item-text'>#영양식단</div>
            </div>
            <div className={`navigation-item ${isUb ? 'active' : ''}`} onClick={() => onItemClickHandler(UB_ABSOLUTE_PATH)}>
                <div className='item-text'>#상체</div>
            </div>
            <div className={`navigation-item ${isSd ? 'active' : ''}`} onClick={() => onItemClickHandler(SD_ABSOLUTE_PATH)}>
                <div className='item-text'>#어꺠</div>
            </div>
            <div className={`navigation-item ${isLb ? 'active' : ''}`} onClick={() => onItemClickHandler(LB_ABSOLUTE_PATH)}>
                <div className='item-text'>#하체</div>
            </div>
            <div className={`navigation-item ${isBc ? 'active' : ''}`} onClick={() => onItemClickHandler(BC_ABSOLUTE_PATH)}>
                <div className='item-text'>#등</div>
            </div>
            <div className={`navigation-item ${isWi ? 'active' : ''}`} onClick={() => onItemClickHandler(WI_ABSOLUTE_PATH)}>
                <div className='item-text'>#허리</div>
            </div>
            <div className={`navigation-item ${isCh ? 'active' : ''}`} onClick={() => onItemClickHandler(CH_ABSOLUTE_PATH)}>
                <div className='item-text'>#가슴</div>
            </div>
            <div className={`navigation-item ${isWl ? 'active' : ''}`} onClick={() => onItemClickHandler(WL_ABSOLUTE_PATH)}>
                <div className='item-text'>#체중감량</div>
            </div>
            <div className={`navigation-item ${isSm ? 'active' : ''}`} onClick={() => onItemClickHandler(SM_ABSOLUTE_PATH)}>
                <div className='item-text'>#보충제</div>
            </div>
            <div className={`navigation-item ${isCm ? 'active' : ''}`} onClick={() => onItemClickHandler(CM_ABSOLUTE_PATH)}>
                <div className='item-text'>#대회식단</div>
            </div>
            <div className={`navigation-item ${isRm ? 'active' : ''}`} onClick={() => onItemClickHandler(RM_ABSOLUTE_PATH)}>
                <div className='item-text'>#일반식단</div>
            </div>
            <div className={`navigation-item ${isPt ? 'active' : ''}`} onClick={() => onItemClickHandler(PT_ABSOLUTE_PATH)}>
                <div className='item-text'>#단백질</div>
            </div>
            <div className={`navigation-item ${isIr ? 'active' : ''}`} onClick={() => onItemClickHandler(IR_ABSOLUTE_PATH)}>
                <div className='item-text'>#부상/재활</div>
            </div>
            <div className={`navigation-item ${isCo ? 'active' : ''}`} onClick={() => onItemClickHandler(CO_ABSOLUTE_PATH)}>
                <div className='item-text'>#유산소</div>
            </div>
            <div className={`navigation-item ${isBe ? 'active' : ''}`} onClick={() => onItemClickHandler(BE_ABSOLUTE_PATH)}>
                <div className='item-text'>#맨몸운동</div>
            </div>
            <div className={`navigation-item ${isFe ? 'active' : ''}`} onClick={() => onItemClickHandler(FE_ABSOLUTE_PATH)}>
                <div className='item-text'>#전신운동</div>
            </div>
            <div className={`navigation-item ${isDm ? 'active' : ''}`} onClick={() => onItemClickHandler(DM_ABSOLUTE_PATH)}>
                <div className='item-text'>#다이어트 식단</div>
            </div>
            <div className={`navigation-item ${isNs ? 'active' : ''}`} onClick={() => onItemClickHandler(NS_ABSOLUTE_PATH)}>
                <div className='item-text'>#영양제</div>
            </div>
            <div className={`navigation-item ${isBp ? 'active' : ''}`} onClick={() => onItemClickHandler(BP_ABSOLUTE_PATH)}>
                <div className='item-text'>#바디프로필</div>
            </div>
        </div>
    )

};

// component: 카테고리-인기태그 컴포넌트 

function CategoryPopularTag() {

    const { pathname } = useLocation();


    function getBoardList(): void {
        throw new Error('Function not implemented.');
    }

    // component: 카테고리-인기태그 컴포넌트 
    return (
        <div className="categoryHead">
            <label className='category'>카테고리</label>
            <div className='category-search'>
                <CategoryNavigation />
                <div id="search">
                    <input type="text" placeholder="검색어 입력" />
                    <button className='searchButton'>
                        
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
                    <div className='tablehead'>
                        <div className='number'>번호</div>
                        <div className='title'>제목</div>
                        <div className='author'>작성자</div>
                        <div className='date'>날짜</div>
                        <div className='views'>조회수</div>
                    </div>
                    {posts.map((board, index) => <TableRow key={index} board={board} getBoardList={getBoardList}/>)}
                </div>
            </div>
        </div>
    )
}


export default function Community() {

    

    // state: 페이징 관련 상태 
    const {
        currentPage, totalPage, totalCount, viewList,
        setTotalList, initViewList, ...paginationProps
    } = usePagination<Board>();

    // function: 네비게이터 함수
    const navigator = useNavigate();

    // event handler: 글쓰기 버튼 클릭 이벤트 처리 함수
    const onPostButtonClickHandler = () => {
        navigator(POST_ABSOLUTE_PATH);
    };


    return (
        <div id='cm-wrapper'>
            <div className='top'>
                <CategoryPopularTag />
            </div>
            <div className='bottom'>
                <Pagination currentPage={currentPage} {...paginationProps} />
                <button className="post-on" onClick={onPostButtonClickHandler}>글쓰기</button>
            </div>
        </div>
    );
}
