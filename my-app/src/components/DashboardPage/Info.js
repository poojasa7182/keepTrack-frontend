import React from 'react';
import { Button } from 'semantic-ui-react'

class Info extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            user : {}
          }
        this.fetchTasks = this.fetchTasks.bind(this)
    }

    componentWillMount(){
        this.fetchTasks()
    }
    
    fetchTasks(){
        console.log('Fetching...')
    
        fetch("http://127.0.0.1:8000/keepTrack/user/info/")
        .then(response => response.json())
        .then(data => 
            this.setState({
                user :data
            })
        )
    }
    render(){
        var user = this.state.user
        return(
            <div>
                <div className="projectBox">
                    {user.id}
                    <Button>Click me</Button>
                </div>
            </div>
        )
    }
}


export default Info;

