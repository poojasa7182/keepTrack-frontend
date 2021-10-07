import React from 'react';
import {render} from '@testing-library/react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './temp2.css';

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state={
            loggedIn : false
        }
    }

    renderRedirect = () => {
        if(this.state.loggedIn===true){
            return <Redirect to={{pathname:'../project'}}/>
        }
    }

    async componentDidMount(){
        // eslint-disable-next-line no-restricted-globals
        const params= new URLSearchParams(location.search);
        const auth= params.get("code");

        // await axios({url:"http://127.0.0.1:8000/keepTrack/betw",method:'GET', params: {code:auth} , withCredentials:true})
        //             .then(
        //                 console.log("done")
        //             )
        //             .catch((err) => {
        //                 console.log(err);
        //             });
        // const user1= await axios({url:'http://127.0.0.1:8000/keepTrack/betw' ,method:'GET', params: {code:auth, withCredentials:true}  } ).then(console.log("done"))
        //             .catch((err) => {console.log(err);});
                        
        // console.log(user1)
        //var csrftoken = getCookie('csrftoken');
        axios
            .get("http://127.0.0.1:3000/keepTrack/betw", {
                params: {code:auth, withCredentials : true}
            })
            .then((response)=>{
                console.log(response);
            })
            .catch((err) => {
                console.log(err);
            });
        // const user1= await axios({url:'http://127.0.0.1:8000/keepTrack/betw' ,method:'GET', params: {code:auth} , withCredentials:true} ).then(console.log("done"));
        // console.log(user1)
        await this.setState({loggedIn:true});
    }

    render(){
        return(
            <div className='container'>
                {this.renderRedirect()}
                <div className='image-container'>
                    Logging in....
                </div>
                
            </div>
        )
    }
}
 export default Login;