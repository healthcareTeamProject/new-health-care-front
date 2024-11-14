import react from 'react';
import { useSignInCustomerStroe } from 'src/stores';
import './style.css';
import { useParams } from 'react-router';

export default function BoardUpdate() {

    // state: 로그인 유저 상태 //
    const { signInCustomer } = useSignInCustomerStroe();

    // state: 게시글 번호 상태 //
    const { boardNumber } = useParams();

    
}