import React from 'react';
import randomstring from 'randomstring'
import { Button } from 'semantic-ui-react'
import imgLoad from './route.png'
import './temp2.css';
import axios from "axios";

function Home2(){
    // var str = randomstring.generate()
    // let auth_params={
    //     "CLIENT_ID":"89PqwZn7DY9PlIUdhA7tY51A0osTECkDMcYQ8ys5",
    //     //"REDIRECT_URI":"http://localhost:3000/login",
    //     "REDIRECT_URI":"http://localhost:8000/keepTrack/betw",
    //     "STATE_STRING":str
    // }
    const handleButtonClick = (e) => {
        e.preventDefault();
        axios
            .get("http://127.0.0.1:8000/keepTrack/login2/login2", {
                 withCredentials : true
            })
            .then((response)=>{
                console.log(response);
                console.log('hi')
            })
            .catch((err) => {
                console.log(err);
            });
    }
    
    return(
        <div className='container'>
            <div className='left-side'>
                <img src={imgLoad}/>
            </div>
            <div className='right-side'>
                <div>
                    Keep track
                </div>
                <div>
                    <Button size='massive' color='teal' onClick={handleButtonClick}>Login2</Button>
                </div>
            </div>
        </div>
    );
}
export default Home2;