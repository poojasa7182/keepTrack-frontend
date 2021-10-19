import React from 'react';
import randomstring from 'randomstring'
import { Button } from 'semantic-ui-react'
import imgLoad from './route.png'
import './temp2.css';

function Home(){
    var str = randomstring.generate()
    let auth_params={
        "CLIENT_ID":"89PqwZn7DY9PlIUdhA7tY51A0osTECkDMcYQ8ys5",
        //"REDIRECT_URI":"http://localhost:3000/login",
        "REDIRECT_URI":"http://localhost:8000/keepTrack/betw",
        "STATE_STRING":str
    }
    const handleButtonClick = (e) => {
        e.preventDefault();
        window.location.href = "https://channeli.in/oauth/authorise/?client_id="+auth_params.CLIENT_ID+"&redirect_uri="+auth_params.REDIRECT_URI+"&state="+auth_params.STATE_STRING;
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
                    <Button size='massive' color='teal' onClick={handleButtonClick}>Login</Button>
                </div>
            </div>
        </div>
    );
}
export default Home;