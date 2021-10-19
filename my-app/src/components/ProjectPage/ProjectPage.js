import React from 'react'
import Project from './projects'
import SidebarMenu from '../SideBar/menu'
import './temp.css';
import { useHistory } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

const ProjectPage = () => {
    let history = useHistory();
    var user ;
    async function fetchUserDetails(){
        axios
            .get('http://localhost:3000/keepTrack/user/info', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                if(response.data.banned){
                    history.push("/");
                }
                user = response.data
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
                    <Project curUser={user} />
                </div>
            </div>
            <div className='footer'>
                Footer
            </div>
        </div>
    )}

export default ProjectPage