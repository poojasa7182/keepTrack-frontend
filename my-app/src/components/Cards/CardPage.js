import React from 'react'
import ListCard from './cards'
import SidebarMenu from '../SideBar/menu'
import './temp3.css';
import { useHistory } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

const CardPage = () => {
    let history = useHistory();

    async function fetchUserDetails(){
        axios
            .get('http://localhost:3000/keepTrack/user/info', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                if(response.data.banned){
                    history.push("/");
                }
            })
            .catch((error) => {
                history.push("/");
                console.log(error)
            });
    }

    React.useEffect(()=>{
        fetchUserDetails();
    }, []);

    return(
    <div>
        <div className='container-c'>
            <div className='sidebar'>
                <SidebarMenu />
            </div>
            <div className='cardsContainer'>
                <ListCard />
            </div>
        </div>
        <div className='footer'>
            Footer
        </div>
    </div>
)}

export default CardPage