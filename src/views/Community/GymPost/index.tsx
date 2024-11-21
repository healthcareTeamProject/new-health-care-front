
import React, { ChangeEvent, useRef, useState } from 'react';
import './style.css';
import Category from 'src/types/category.interface';
import { ACCESS_TOKEN, BOARD_LIST_PATH } from 'src/constant';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router';
import { ResponseDto } from 'src/apis/dto/response';
import { useSignInCustomerStroe } from 'src/stores';
import { PostBoardRequestDto } from 'src/apis/dto/request/board';
import { fileUploadRequest, postBoardRequest, postHealthBoardRequest,  } from 'src/apis';
import { Map } from "react-kakao-maps-sdk";
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import { PostHealthBoardRequestDto } from 'src/apis/dto/request/healthboard';



const categoryList: string[] = ['식단', '홈 트레이닝', '운동기구', '헬스장'];

const popularTagsList: string[] = ['운동일지', '영양식단', '상체', '어깨', '하체', '등',
    '허리', '가슴', '체중감량', '보충제', '대회식단', '일반식단', '단백질',
    '부상/재활', '유산소', '맨몸운동', '전신운동', '다이어트 식단', '영양제', '바디프로필'];

interface PostBoardProps {
    getBoardList: () => void;
}

// component: 게시글 작성 화면 컴포넌트 //
export default function Post() {

    // state: 로그인 유저 상태 //
    const { signInCustomer } = useSignInCustomerStroe();

    // state: 이미지 입력 참조 //
    const imageInputRef = useRef<HTMLInputElement|null>(null);

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: 모달 팝업 상태 //
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    // state: 게시글 상태 //
    const [boardTitle, setBoardTitle] = useState<string>('');
    const [boardCategory, setBoardCategory] = useState<string>('');
    const [ImageFile, setImageFile] = useState<File | null>(null);
    const [boardTag, setBoardTag] = useState<string>('');
    const [boardContents, setBoardContents] = useState<string>('');
    const [youtubeVideoLink, setYoutubeVideoLink] = useState<string>('');
    const [boardFileContents, setBoardFileContents] = useState<string>('');
    const [mapLat, setMapLat] = useState<number>(0);
    const [mapLng, setMapLng] = useState<number>(0);
    const [address, setAddress] = useState<string>('');
    const [location, setLocation] = useState<string>('');

    const { userId } = useParams();
    

    // state: 카테고리 셀렉터 오픈 여부 상태 //
    const [showCategorySelector, setShowCategorySelector] = useState<boolean>(false);

    // state: 태그 셀렉터 오픈 여부 상태 //

    const [showPopularTagSelector, setShowPopularTagSelector] = useState<boolean>(false);

    // state: 선택한 카테고리 상태 //
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    // state: 선택한 태그 상태 //
    const [selectedPopularTag, setSelectedPopularTag] = useState<string>('');

    // event handler: 셀렉터 오픈 이벤트 처리 //
    const onCategorySelectorClickHandler = () => {
        setShowCategorySelector(!showCategorySelector);
    };

    // event handler: 셀렉터 오픈 이벤트 처리 //
    const onPopularTagSelectorClickHandler = () => {
        setShowPopularTagSelector(!showPopularTagSelector);
    };

    // event handler: 카테고리 선택 이벤트 처리 //
    const onCategorySelectHandler = (category: string) => {
        setSelectedCategory(category);
        setShowCategorySelector(false);
    };

    // event handler: 태그 선택 이벤트 처리 //
    const onPopularTagSelectHandler = (popularTag: string) => {
        setSelectedPopularTag(popularTag);
        setShowPopularTagSelector(false);
    }

    // function: post healthboard response 처리 함수 //
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
    };

    // function: 다음 주소 검색 팝업 함수 //
    const daumPostcodePopup = useDaumPostcodePopup();

    // function: 다음 주소 검색 완료 처리 함수 //
    const daumPostcodeComplete = (result: Address) => {
        const { address, sigungu } = result;
        setAddress(address);
        setLocation(sigungu);
    }
    
    // event handler: 파일 선택 클릭 이벤트 처리 //
    const onFileSelectClickHandler = () => {
        const { current } = imageInputRef;
        if (!current) return;
        current.click();
    };

    // event handler: 이미지 변경 이벤트 처리 함수 //
    const onImageInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (!files || !files.length) return;

        const file = files[0];
        setImageFile(file);

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        
        }
    

    // event handler: 글쓰기 버튼 클릭 이벤트 처리
    const onPostClickHandler = async () => {
        if (!boardTitle || !boardContents) return;

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        let url: string | null = null;
        if (ImageFile) {
            const formData = new FormData();
            formData.append('file', ImageFile);
            url = await fileUploadRequest(formData);
        }
        

            const postHealthBoardRequestBody: PostHealthBoardRequestDto = {
                boardTitle,
                userId,
                boardCategory,
                boardTag,
                boardContents,
                youtubeVideoLink,
                boardFileContents: [],
                mapLat,
                mapLng
            };
            postHealthBoardRequest(postHealthBoardRequestBody, accessToken).then(postHealthBoardResponse);
    };

    // event handler: 주소 검색 버튼 클릭 이벤트 처리 //
    const onAddressButtonClickHandler = () => {
        daumPostcodePopup({ onComplete: daumPostcodeComplete })
    }


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
    
    // event handler: 모달 오픈 이벤트 처리 //
    const onModelOpenHandler = () => {
        setModalOpen(!modalOpen);
    };

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    
    
    return (
        <div id='post'>
            <div className='Top'>
                <div className='category-tag'>
                    <div className='categoryTitle'>카테고리 *</div>
                    {showCategorySelector ?
                        <div className='selector open'>
                            <div className='selected-item' >{selectedCategory ? selectedCategory : '카테고리'}</div>
                            <div className='arrow-up-button' onClick={onCategorySelectorClickHandler}></div>
                            <div className='selector-box'>
                                <div className='selcetor-option' onClick={() => onCategorySelectHandler('')}></div>
                                {categoryList.map((category) =>
                                    <div key={category} className='selector-option' onClick={() => onCategorySelectHandler(category)}>{category}</div>
                                )}
                            </div>
                        </div> :
                        <div className='selector close'>
                            <div className='selected-item'>{selectedCategory ? selectedCategory : '카테고리'}</div>
                            <div className='arrow-down-button' onClick={onCategorySelectorClickHandler}></div>
                        </div>
                    }
                    {showPopularTagSelector ?
                        <div className='selector open'>
                            <div className='selected-item' >{selectedPopularTag ? selectedPopularTag : '태그'}</div>
                            <div className='arrow-up-button' onClick={onPopularTagSelectorClickHandler}></div>
                            <div className='selector-box'>
                                <div className='selcetor-option' onClick={() => onPopularTagSelectHandler('')}></div>
                                {popularTagsList.map((popularTag) =>
                                    <div key={popularTag} className='selector-option' onClick={() => onPopularTagSelectHandler(popularTag)}>{popularTag}</div>
                                )}
                            </div>
                        </div> :
                        <div className='selector close'>
                            <div className='selected-item'>{selectedPopularTag ? selectedPopularTag : '태그'}</div>
                            <div className='arrow-down-button' onClick={onPopularTagSelectorClickHandler}></div>
                        </div>
                    }
                </div>
                <div className='titleHead'>
                    <div className='postTitle'>제목 *</div>
                    <input className='titleInput' placeholder='숫자, 글자, 특수문자를 포함한 한글 30자 영문 90자 이내 제목 입력' onChange={onTitleChangeHandler} />
                </div>
                <div className='youtube'>
                    <div className='youtubeLink'>유튜브 링크</div>
                    <input className='youtubeInput' placeholder='d' onChange={onYoutubeLinkChangeHandler} />
                </div>
                <div className='postcontent'>
                    <div className='contentTitle'>내용 *</div>
                    <input className='contentInput' placeholder='숫자, 글자, 특수문자를 포함한 1000자 이내 내용 입력' onChange={onContentsChangeHandler} />
                </div>
                <div className='attachment'>
                    <div className='attachmentTitle'>첨부파일</div>
                    <div className='attachmentBottom'>
                        <div className='fileSelectBox1'>
                            <div className='fileSelectButton1' onClick={onFileSelectClickHandler}>파일선택</div>
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
                    <div>
                        <div>
                            <div></div>
                            <div></div>
                            <div className='address-search-button' onClick={onAddressButtonClickHandler}>검색</div>
                        </div>
                        <div></div>
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



