import React from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import { Redirect, NavLink } from 'react-router-dom';
import { useHistory } from "react-router-dom";

function Logout(){
    let history = useHistory();

    async function fetchLogout() {
        await axios
            .get('http://localhost:3000/keepTrack/user/logout', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                history.push("/");
            })
            .catch((error) => console.log(error));
    }

    React.useEffect(()=>{
        fetchLogout();
    }, []);

    return(
        <div className='container'>
                <div className='image-container'>
                    Logging out....
                </div>
                
            </div>
    );
}
export default Logout;