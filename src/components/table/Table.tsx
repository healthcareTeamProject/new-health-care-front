import React from 'react';

interface TableRow {
    id: number;
    title: string;
    author: string;
    date: string;
    views: number;
}

const tableData: TableRow[] = [
    { id: 187, title: '턱걸이 어깨 뚜둑 소리', author: '마라탕가슴살', date: '2024-10-11 17:15', views: 826},
];

const Table: React.FC = () => {
    return (
        <section className="table-section">
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성 날짜</th>
                        <th>조회수</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row) => (
                        <tr key={row.id}>
                            <td>{row.id}</td>
                            <td>{row.title}</td>
                            <td>{row.author}</td>
                            <td>{row.date}</td>
                            <td>{row.views}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default Table;