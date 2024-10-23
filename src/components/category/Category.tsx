import React, { useState } from 'react';
import './Category.css';

const categories = ['식단', '홈 트레이닝', '운동기구', '헬스장'];

const CategorySearch: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('검색어:', searchTerm);
    };

    return (
        <div>
            <label className="category">카테고리</label>
            <div className="category-search">
                <div className="categories">
                    {categories.map((category, index) => (
                        <button key={index} className="category-button">
                            {category}
                        </button>
                    ))}
                </div>
                <form className="search-bar" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button type="submit">
                        <img src="/path/to/search-icon.png" alt="search" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CategorySearch;
