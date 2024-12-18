import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import Category from 'src/types/category.interface';
import { ACCESS_TOKEN, BOARD_LIST_PATH } from 'src/constant';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router';
import { ResponseDto } from 'src/apis/dto/response';
import { useSignInCustomerStroe } from 'src/stores';
import { PostBoardRequestDto } from 'src/apis/dto/request/board';
import { fileUploadRequest, postBoardRequest } from 'src/apis';
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import { useKakaoLoader } from 'src/hooks';
import { NONAME } from 'dns';

const categoryList: string[] = ['식단', '홈 트레이닝', '운동기구', '헬스장'];

const popularTagsList: string[] = ['운동일지', '영양식단', '상체', '어깨', '하체', '등',
    '허리', '가슴', '체중감량', '보충제', '대회식단', '일반식단', '단백질',
    '부상/재활', '유산소', '맨몸운동', '전신운동', '다이어트 식단', '영양제', '바디프로필'];

interface PostBoardProps {
    getBoardList: () => void;
}

const defaultImageUrl = '';

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
    const [address, setAddress] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [lat, setLat] = useState<number>(0);
    const [lng, setLng] = useState<number>(0);
    const [changeProfileImage, setChangeProfileImage] = useState<File|null>(null);

    const [profileImage, setProfileImage] = useState<string>('');
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const { userId } = useParams();


    // state: 카테고리 셀렉터 오픈 여부 상태 //
    const [showCategorySelector, setShowCategorySelector] = useState<boolean>(false);

    // state: 태그 셀렉터 오픈 여부 상태 //

    const [showPopularTagSelector, setShowPopularTagSelector] = useState<boolean>(false);

    // state: 선택한 카테고리 상태 //
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    // state: 선택한 태그 상태 //
    const [selectedPopularTag, setSelectedPopularTag] = useState<string>('');


    useKakaoLoader();

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
        setBoardCategory(category);
        setShowCategorySelector(false);
    };

    // event handler: 태그 선택 이벤트 처리 //
    const onPopularTagSelectHandler = (popularTag: string) => {
        setSelectedPopularTag(popularTag);
        setBoardTag(popularTag);
        setShowPopularTagSelector(false);
    }

    // function: post board response 처리 함수 //
    const postBoardResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '필수 항목을 입력해주세요.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
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
        fileReader.onloadend = () => {
            setPreviewUrl(fileReader.result as string);
        };
    };
    

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
        url = url ? url : defaultImageUrl;

            const postBoardRequestBody: PostBoardRequestDto = {
                boardTitle,
                userId,
                boardCategory,
                boardTag,
                boardContents,
                youtubeVideoLink,
                boardFileContents:[],
                lat,
                lng
            };
            postBoardRequest(postBoardRequestBody, accessToken).then(postBoardResponse);
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

    useEffect(() => {
        if (!address) return;
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const {x:lng, y:lat} = result[0];
                setLat(+lat);
                setLng(+lng);
            } else {
                setLat(0);
                setLng(0);
            }
        })
    }, [address]);

    const [imageFiles, setImageFiles] = useState<string[]>([]);

const addImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    let tmp = e.target.files;
    if (tmp) {
        const reader = new FileReader();
        reader.readAsDataURL(tmp[0]);
        reader.onloadend = () => {
            if (reader.result) {
                setImageFiles(prev => [...prev, reader.result as string]);
            }
        };
    }
};

    
    
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
                            <div className='profile-image' style={{ backgroundImage: previewUrl ? `url(${previewUrl})` : `url(${profileImage})` }} onClick={onFileSelectClickHandler}>
                                <input ref={imageInputRef} style={{ display: 'none' }} type='file' accept='image/*' onChange={onImageInputChangeHandler} />
                            </div>
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
                        <div className='gym-location-box'>
                            <div className='location'>위치</div>
                            <input className='address-search-input' value={address} readOnly placeholder='주소를 선택하세요.' />
                            <div className='address-search-button' onClick={onAddressButtonClickHandler}>검색</div>
                        </div>
                        <div className='gym-location'>
                            {lat !== 0 && lng !== 0 &&
                                <Map // 지도를 표시할 Container
                                    center={{
                                        // 지도의 중심좌표
                                        lat,
                                        lng,
                                    }}
                                    style={{
                                        // 지도의 크기
                                        width: "100%",
                                        height: "450px",
                                    }}
                                    draggable={false}
                                    zoomable={false}
                                    level={3} // 지도의 확대 레벨
                                >
                                    <MapMarker // 마커를 생성합니다
                                        position={{
                                            // 마커가 표시될 위치입니다
                                            lat,
                                            lng,
                                        }}
                                    />
                                </Map>
                            }
                        </div>
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

