import React from 'react';
import randomstring from 'randomstring'

function Home(){
    var str = randomstring.generate()
    let auth_params={
        "CLIENT_ID":"89PqwZn7DY9PlIUdhA7tY51A0osTECkDMcYQ8ys5",
        "REDIRECT_URI":"http://localhost:3000/login",
        "STATE_STRING":str
    }
    const handleButtonClick = (e) => {
        e.preventDefault();
        window.location.href = "https://channeli.in/oauth/authorise/?client_id="+auth_params.CLIENT_ID+"&redirect_uri="+auth_params.REDIRECT_URI+"&state="+auth_params.STATE_STRING;
    }
    
    return(
        <div>

            <button onClick={handleButtonClick}>Login</button>
        </div>
    );
}
export default Home;