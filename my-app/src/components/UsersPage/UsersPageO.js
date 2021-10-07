import React from 'react'
import SidebarMenu from '../SideBar/menu'
import './temp5.css';
import UserInfoO from './info-user';
import { useHistory } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

const UsersPageO = () => {
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
            <div className='container'>
                <div className='sidebar'>
                    <SidebarMenu />
                </div>
                <div className='projectsContainer'>
                    <UserInfoO />
                </div>
            </div>
            <div className='footer'>
                Footer
            </div>
        </div>
)}

export default UsersPageO