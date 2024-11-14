import React, { ChangeEvent, useState } from 'react';
import './style.css';
import Category from 'src/types/category.interface';
import { ACCESS_TOKEN, BOARD_LIST_PATH } from 'src/constant';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import { postBoardRequest } from 'src/apis';
import { ResponseDto } from 'src/apis/dto/response';
import { useSignInCustomerStroe } from 'src/stores';
import { PostHealthBoardRequestDto } from 'src/apis/dto/request/healthboard';

const categories = ['식단', '홈 트레이닝', '운동기구', '헬스장'];

const popularTags = ['#운동일지', '#영양식단', '#상체', '#어깨', '#하체', '#등',
    '#허리', '#가슴', '#체중감량', '#보충제', '#대회식단', '#일반식단', '#단백질',
    '#부상/재활', '#유산소', '#맨몸운동', '#전신운동', '#다이어트 식단', '#영양제', '#바디프로필'];

interface PostBoardProps {
    getBoardList: () => void;
}

export default function Post() {
// component: 게시글 작성 화면 컴포넌트 //

    // state: 로그인 유저 상태 //
    const { signInCustomer } = useSignInCustomerStroe();

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: 게시글 상태 //
    const [boardTitle, setBoardTitle] = useState<string>('');
    const [boardCategory, setBoardCategory] = useState<string>('');
    const [boardTag, setBoardTag] = useState<string>('');
    const [boardContents, setBoardContents] = useState<string>('');
    const [youtubeVideoLink, setYoutubeVideoLink] = useState<string>('');
    const [boardFileContents, setBoardFileContents] = useState<[]>([]);
    const [mapLat, setMapLat] = useState<string>('');
    const [mapLng, setMapLng] = useState<string>('');
    

    // function: post board response 처리 함수 //
    const postHealthBoardResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '필수 항목을 입력해주세요.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NI' ? '존재하지 않는 요양사입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        navigator(BOARD_LIST_PATH);
    }   

    // event handler: 글쓰기 버튼 클릭 이벤트 처리
    const onPostClickHandler = async () => {
        if (!boardTitle || !boardContents) return;

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

            const postHealthBoardRequestBody: PostHealthBoardRequestDto = {
                boardTitle,
                boardCategory,
                boardTag,
                boardContents,
                youtubeVideoLink,
                boardFileContents,
                mapLat,
                mapLng
            };
            postBoardRequest(postHealthBoardRequestBody, accessToken).then(postHealthBoardResponse);
    };


    // event handler: 제목 변경 이벤트 처리 함수 //
    const onTitleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setBoardTitle(value);
    };

    const onYoutubeLinkChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setYoutubeVideoLink(value);
    }

    const onContentsChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setBoardContents(value);
    }

    // function: 네비게이터 함수 //
    const navigator = useNavigate();
    
        return (
            <div id='post'>
                <div className='Top'>
                    <div className='category-tag'>
                        <div className='categoryTitle'>카테고리 *</div>
                        
                            <div className='selector open'>
                                <div className='seleceted-item'></div>
                                <div className='arrow-up-button'></div>
                                <div className='selector-box'>
                                    <div className='selcetor-option'>카테고리</div>
                                    
                                </div>
                            </div> :
                            <div className='selector close'>
                                <div className='selected-item'></div>
                                <div className='arrow-down-button'></div>
                            </div>
                        
                        <div className='categorySelectBar'>카테고리</div>
                        <div className='tagSelectBar'>태그</div>
                    </div>
                    <div className='titleHead'>
                        <div className='postTitle'>제목 *</div>
                        <input className='titleInput' placeholder='숫자, 글자, 특수문자를 포함한 한글 30자 영문 90자 이내 제목 입력' onChange={onTitleChangeHandler}/>
                    </div>
                    <div className='youtube'>
                        <div className='youtubeLink'>유튜브 링크</div>
                        <input className='youtubeInput' placeholder='d' onChange={onYoutubeLinkChangeHandler}/>
                    </div>
                    <div className='postcontent'>
                        <div className='contentTitle'>내용 *</div>
                        <input className='contentInput' placeholder='숫자, 글자, 특수문자를 포함한 1000자 이내 내용 입력' onChange={onContentsChangeHandler}/>
                    </div>
                    <div className='attachment'>
                        <div className='attachmentTitle'>첨부파일</div>
                        <div className='attachmentBottom'>
                            <div className='fileSelectBox1'>
                                <div className='fileSelectButton1'>파일선택</div>
                                <div className='fileSelectInput1'></div>
                                <div className='cancel1'>취소</div>
                            </div>
                            <div className='fileSelectBox2'>
                                <div className='fileSelectButton2'>파일선택</div>
                                <div className='fileSelectInput2'></div>
                                <div className='cancel2'>취소</div>
                            </div>
                            <div className='fileSelectBox3'>
                                <div className='fileSelectButton3'>파일선택</div>
                                <div className='fileSelectInput3'></div>
                                <div className='cancel3'>취소</div>
                            </div>
                        </div>
                        <div className='attachmentText'>'png', 'gif', 'jpg', 'jpeg', 'mp4', 'mkv', 'avi'파일만 등록 가능합니다.</div>
                        <div className='gymLocation'>
                            <div className='gymLocationBox'>
                                <div className='location'>위치</div>
                                <div className='gymLocationInput'></div>
                                <div className='location-search'>검색</div>
                            </div>
                            <div className='location-image' style={{ backgroundImage: `url(${'public/images/healthLocation'})`}}></div>
                        </div>
                    </div>
                </div>
                <div className='Bottom'>
                    <div className='bottomButton'>
                        <div className='uploadButton' onClick={onPostClickHandler}>업로드</div>
                        <div className='cancelButton'>취소</div>
                    </div>
                </div>
            </div>
        )
    }


