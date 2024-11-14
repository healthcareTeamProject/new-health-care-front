import { ChangeEvent, useEffect, useState, MouseEvent } from 'react';
import './style.css';
import { useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useSignInCustomerStroe } from 'src/stores';
import { ACCESS_TOKEN, BOARD_LIST_ABSOLUTE_PATH, BOARD_LIST_PATH, BOARD_UPDATE_ABSOLUTE_PATH } from 'src/constant';
import { deleteBoardRequest, deleteCommentRequest, getBoardRequest, getCommentListRequest, patchCommentRequest, postCommentsRequest } from 'src/apis';
import { ResponseDto } from 'src/apis/dto/response';
import { Board, Comment } from 'src/types';
import { GetBoardResponseDto } from 'src/apis/dto/response/board';
import { GetCustomerResponseDto } from 'src/apis/dto/response/customer';
import { usePagination } from 'src/hooks';
import { PatchCommentRequestDto, PostCommentRequestDto } from 'src/apis/dto/request/board';
import GetCommentResponseDto from 'src/apis/dto/response/board/get-comment.response.dto';
import { getCombinedNodeFlags } from 'typescript';
import GetCommentListResponseDto from 'src/apis/dto/response/board/get-comment-list.response.dto';

// interface: 댓글 등록 컴포넌트 Properties //
interface PostCommentProps {
    unShow: () => void;
    getCommentList: () => void;
}

// component: 댓글 등록 컴포넌트 //
function CommentBox({ unShow, getCommentList }: PostCommentProps) {

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // useParams로부터 boardNumber를 받아옵니다.
    const { boardNumber } = useParams<{ boardNumber: string }>();

    // boardNumber를 숫자로 변환하고 사용
    const boardId = boardNumber ? parseInt(boardNumber, 10) : null;

    // state: 댓글 인풋 상태 //
    const [userId, setUserId] = useState<string>('');
    const [commentContents, setCommentContents] = useState<string>('');
    const [commentLikeCount, setCommentLikeCount] = useState<number>(0);
    const [commentDate, setCommentDate] = useState<string>('');


    // function: post comments response 처리 함수 //
    const postCommentResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '댓글을 작성해주세요' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';    
        if (!isSuccessed) {
            alert(message);
            return;
        }

        getCommentList();
        unShow();
    };

    // event handler: 댓글 내용 변경 이벤트 처리 함수 //
    const onContentsChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setCommentContents(value);
    };

    // event handler: 등록 버튼 클릭 이벤트 처리 함수 //
    const onPostButtonClickHandler = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        if (!commentContents) {
            alert('댓글을 입력해주세요.');
            return;
        }
        const requestBody: PostCommentRequestDto = {
            userId,
            commentContents,
            commentLikeCount,
            commentDate
            
        };

        if(!boardNumber) return;

        postCommentsRequest(requestBody, boardNumber, accessToken).then(postCommentResponse);
    }

    // render: 댓글 등록 컴포넌트 렌더링 //
    return (
        <div className='commentInputBox'>
            <div className='commentContent'>댓글내용</div>
            <div className='commentInput'></div>
            <div className='button primary' onClick={onPostButtonClickHandler}>댓글등록</div>
        </div>
        
    )
}

// interface: 댓글 수정 컴포넌트 Properties //
interface PatchBoxProps {
    commentNumber: number;
    unShow: () => void;
    getCommentList: () => void;
}

// component: 댓글 수정 컴포넌트 //
function PatchBox({ commentNumber, unShow, getCommentList }: PatchBoxProps) {

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // useParams로부터 boardNumber를 받아옵니다.
    const { boardNumber } = useParams<{ boardNumber: string }>();

    // boardNumber를 숫자로 변환하고 사용
    const boardId = boardNumber ? parseInt(boardNumber, 10) : null;

    console.log('boardNumber:', boardNumber); // '1' (문자열)
    console.log('boardId:', boardId); // 1 (숫자)

    // state: 댓글 정보 상태 //
    const [userId, setUserId] = useState<string>('');
    const [commentContents, setCommentContents] = useState<string>('');
    const [commentLikeCount, setCommentLikeCount] = useState<number>(0);
    const [commentDate, setCommentDate] = useState<string>('');

    // function: get comment response 처리 함수 //
    const getCommentResponse = (responseBody: GetCommentResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '잘못된 접근입니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NT' ? '존재하지 않는 댓글입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { userId, commentContents, commentLikeCount, commentDate } = responseBody as GetCommentResponseDto;
        setUserId(userId);
        setCommentContents(commentContents);
        setCommentLikeCount((commentLikeCount));
        setCommentDate(commentDate);
    };

    // function: patch comment response 처리 함수 //
    const patchCommentResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '댓글을 입력해주세요.' :
                    responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                        responseBody.code === 'NT' ? '존재하지 않는 댓글입니다.' :
                            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        getCommentList();
    };

    // event handler: 댓글 내용 변경 이벤트 처리 함수 //
    const onContentsChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setCommentContents(value);
    }

    // event handler: 수정 버튼 클릭 이벤트 처리 함수 //
    const onUpdateButtonClickHandler = () => {
        if (!commentContents) {
            alert('댓글을 입력해주세요.');
            return;
        }

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        const requestBody: PatchCommentRequestDto = {
            userId,
            commentContents,
            commentLikeCount,
            commentDate
        };

        if(!boardNumber) return;

        patchCommentRequest(requestBody, commentNumber, boardNumber, accessToken).then(patchCommentResponse);
    }
}

// component: 카테고리 네비게이션 // 
function CategoryNavigation() {

    const [hashTags, setHashTags] = useState<string[]>([]);
    const [category, setCategory] = useState<string | null>(null);
    const [searchParams] = useSearchParams();

    const navigator = useNavigate();

    const onItemClickHandler = (hashTag: string) => {
        const newHashTags = [...hashTags, hashTag];
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (newHashTags.length) newHashTags.forEach(hashTag => params.append('category', hashTag));

        navigator(`/board?${params.toString()}`);
    };

    useEffect(() => {
        const hashTags: string[] = searchParams.getAll('hashTag');
        const category = searchParams.get('category');
        setHashTags(hashTags);
        setCategory(category);
    }, []);

    return (
        <div className='categories'>
            <div className={`category-navigation-item`}>
                <div className='category-item-text' onClick={() => onItemClickHandler('식단')}>식단</div>
            </div>
            <div className={`category-navigation-item`}>
                <div className='category-item-text' onClick={() => onItemClickHandler('홈 트레이닝')}>홈 트레이닝</div>
            </div>
            <div className={`category-navigation-item`}>
                <div className='category-item-text' onClick={() => onItemClickHandler('운동기구')}>운동기구</div>
            </div>
            <div className={`category-navigation-item`}>
                <div className='category-item-text' onClick={() => onItemClickHandler('헬스장')}>헬스장</div>
            </div>
        </div>
    )

};

// interface: 댓글 리스트 아이템 컴포넌트 Properties //
interface TableRowProps {
    comment: Comment;
    getCommentList: () => void;
    onUpdateButtonClickHandler: (commentNumber: number) => void;
}

// component: 댓글 리스트 아이템 컴포넌트 //
function TableRow({ comment, getCommentList, onUpdateButtonClickHandler}: TableRowProps) {

    // state: cookie 상태 //
    const [cookies] = useCookies();

    const {boardNumber} = useParams();

    console.log(boardNumber)

    // function: delete comment response 처리 함수 //
    const deleteCommentResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '잘못된 접근입니다.' :
                    responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                        responseBody.code === 'NT' ? '존재하지 않는 용품입니다.' :
                            responseBody.code === 'DBE' ? '서버에 문제가 있습니다' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        getCommentList();
    };

    // event handler: 삭제 버튼 클릭 이벤트 처리 함수 //
    const onDeleteButtonClickHandler = () => {
        const isConfirm = window.confirm('정말로 삭제하시겠습니까?');
        if (!isConfirm) return;

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        if(!boardNumber) return;

        deleteCommentRequest(boardNumber, comment.commentsNumber, accessToken).then(deleteCommentResponse);
    };

    // render: 댓글 리스트 아이템 컴포넌트 렌더링 //
    return (
        <div className='comments'>
                    <div className='comments-view'>
                        <div className='author-contents'>
                            <div className='author'>{comment.userId}</div>
                            <div className='uploaded-comments-contents'>{comment.commentContents}</div>
                        </div>
                        <div className='tunbs-up-recommend'>
                            <div className='comments-tumbs-up'></div>
                            <div className='comments-recommend'>추천{comment.commentLikeCount}</div>
                            <div className='comments-edit' onClick={() => onUpdateButtonClickHandler(comment.commentsNumber)}>수정</div>
                            <div className='comments-delete' onClick={onDeleteButtonClickHandler}>삭제</div>
                        </div>
                    </div>
                    <div className='comments-uploaded-date'>{comment.commentDate}</div>
                </div>
    )
}

export default function BoardDetail() {

    // state: cookie 상태 //
    const [cookies] = useCookies();

    const [showCommentBox, setShowCommentBox] = useState<boolean>(false);

    // state: 로그인 사용자 상태 //
    const { signInCustomer } = useSignInCustomerStroe();

    // state: 원본 리스트 상태 //
    const [originalList, setOriginalList] = useState<Comment[]>([]);

    // 
    const { boardNumber } = useParams();

    

    // const {
    //     currentPage, totalPage, totalCount, viewList, pageList,
    //     setTotalList, initViewList,
    //     onPageClickHandler, onPreSectionClickHandler, onNextSectionClickHandler
    // } = usePagination<Comment>();

    // state: 게시글 정보 상태 //
    const [customer, setCustomer] = useState<string>('');
    const [boardTitle, setBoardTitle] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [boardUploadDate, setBoardUploadDate] = useState<string>('');
    const [boardContents, setBoardContents] = useState<string>('');
    const [youtubeVideoLink, setYoutubeVideoLink] = useState<string>('');
    const [boardFileContents, setBoardFileContents] = useState<string>('');
    const [boardLikeCount, setBoardLikeCount] = useState<number>(0);
    const [comments, setComments] = useState<string>('');
    const [commentList, setCommentList] = useState<Comment[]>([]);


    // variable: 본인 여부 //
    const isCustomer = customer === signInCustomer?.userId;

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: 등록 박스 뷰 상태 변경 함수 //
    const unShowCommentBox = () => setShowCommentBox(false);

    // event handler: 등록 버튼 클릭 이벤트 처리 함수 //
    const onPostButtonClickHandler = () => {
        setShowCommentBox(true);
    }

    // function: comment list 불러오기 함수 //
    const getCommentList = () => {
        if (!boardNumber) return;
        getCommentListRequest(boardNumber).then(getCommentListResponse);
    }

    // function: get comment list response 처리 함수 //
    const getCommentListResponse = (responseBody: GetCommentListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                    responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { commentList } = responseBody as GetCommentListResponseDto;
        setCommentList(commentList);
        setOriginalList(commentList);
    }

    // function: get board response 처리 함수 //
    const getBoardResponse = (responseBody: GetBoardResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '잘못된 접근입니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NC' ? '존재하지 않는 고객입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            navigator(BOARD_LIST_ABSOLUTE_PATH);
            return;
        }

        const { boardTitle, userId, boardUploadDate, boardContents, youtubeVideoLink, boardFileContents, boardLikeCount, comments } = responseBody as GetBoardResponseDto;
        setBoardTitle(boardTitle);
        setUserId(userId);
        setBoardUploadDate(boardUploadDate);
        setBoardContents(boardContents);
        setYoutubeVideoLink(youtubeVideoLink);
        setBoardFileContents(boardFileContents);
        setBoardLikeCount(boardLikeCount);
        setComments(comments);
    };

    // state: 검색어 상태 //
    const [searchWord, setSearchWord] = useState<string>('');

    // function: delete customer response 처리 함수 //
    const deleteBoardResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '잘못된 접근입니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NC' ? '존재하지 않는 고객입니다.' :
            responseBody.code === 'NP' ? '권한이 없습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        navigator(BOARD_LIST_ABSOLUTE_PATH);
    };

    // event handler: 검색어 변경 이벤트 처리 함수 //
    // const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    //     const { value } = event.target;
    //     setSearchWord(value);
    // };

    // const onSearchButtonClickHandler = () => {
    //     const searchedBoardList = originalList.filter(board => board.boardTitle.includes(searchWord));
    //     setTotalList(searchedBoardList);
    //     initViewList(searchedBoardList);
    // }

    // event handler: 목록 버튼 클릭 이벤트 처리 //
    const onListButtonClickHandler = () => {
        navigator(BOARD_LIST_PATH);
    };

    // event handler: 수정 버튼 클릭 이벤트 처리 //
    const onUpdateButtonClickHandler = () => {
        if (!isCustomer) return;
        if (!boardNumber) return;
        navigator(BOARD_UPDATE_ABSOLUTE_PATH(boardNumber));
    };

    // event handler: 삭제 버튼 클릭 이벤트 처리 //
    const onDeleteButtonClickHandler = (event: MouseEvent<HTMLDivElement>) => {
        if (!isCustomer) return;

        const isConfirm = window.confirm('정말로 삭제하시겠습니까?');
        if (!isConfirm) return;

        if (!boardNumber) return;

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        deleteBoardRequest(boardNumber, accessToken).then(deleteBoardResponse);
    };

    // effect: 고객 번호 변경시 고객 정보 요청 함수 //
    useEffect(() => {
        if (!boardNumber) return;
        
        getBoardRequest(boardNumber).then(getBoardResponse);

    }, [boardNumber]);

    // effect: 컴포넌트 로드시 댓글 리스트 불러오기 함수 //
    useEffect(getCommentList, []);

    return (
        <div id='dt'>
            <div>
                <div className='topbox'>
                    <label className='category'>카테고리</label>
                    <div className='category-search'>
                        <CategoryNavigation />
                        <div className="search">
                            <input type="text" placeholder="검색어 입력" />
                            <div className='searchbutton'></div>
                        </div>
                    </div>
                </div>
                <div className='title'>{boardTitle}</div>
                <div className='postcontents'>
                    <div className='top-text'>
                        <div className='nickname'>{userId}</div>
                        <div className='uploadeddate'>{boardUploadDate}</div>
                    </div>
                    <div className='contents'>{boardContents}</div>
                    <div className='uploadedfile' style={{ backgroundImage: `url(${boardFileContents})`}}></div>
                    <div className='recommend-bar'>
                        <div className='tumbs-up'></div>
                        <div className='recommend'>추천(1)</div>
                    </div>
                </div>
                <div className='catalog'>
                    <div className='comments-count'>댓글 1</div>
                    {isCustomer &&
                    <div>
                        <div className='edit-button' onClick={onUpdateButtonClickHandler}>수정</div>
                        <div className='delete-button' onClick={onDeleteButtonClickHandler}>삭제</div>
                    </div>
                    }
                    <div className='catalog-button' onClick={onListButtonClickHandler}>목록</div>
                </div>
                {commentList.map((comment, index) => <TableRow key={index} comment={comment} getCommentList={getCommentList} onUpdateButtonClickHandler={onUpdateButtonClickHandler}/>)}
                {showCommentBox && <CommentBox unShow={unShowCommentBox} getCommentList={getCommentList} /> }
                <div className='comments-upload'>
                    {!showCommentBox && <div className='comments-upload-button' onClick={onPostButtonClickHandler}>댓글 등록</div> }
                </div>
            </div>
        </div>
    )
}