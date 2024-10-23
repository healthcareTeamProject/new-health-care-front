import React, { useState } from 'react';

const Search: React.FC = () => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        console.log('Search query:', query);
    };

    return (
        <section className="search">
            <input 
                type= "text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="검색어를 입력하세요"
            />
            <button onClick={handleSearch}>검색</button>
        </section>
    );
}

export default Search;