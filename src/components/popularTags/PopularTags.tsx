import React from 'react';

const popularTags = ['#운동일지', '#영양식단', '#상체', '#어깨', '#하체', '#등',
    '#허리', '#가슴', '#체중감량', '#보충제', '#대회식단', '#일반식단', '#단백질',
    '#부상/재활', '#유산소', '#맨몸운동', '#전신운동', '#다이어트 식단', '#영양제', '#바디프로필'
];

const PopularTags: React.FC = () => {
    return (
        <section className="popular-tags">
            {popularTags.map((tag, index) => (
                <button key={index}>{tag}</button>
            ))}
        </section>
    );
}

export default PopularTags;

