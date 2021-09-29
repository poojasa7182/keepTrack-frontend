import React from 'react';
import './temp.css'
import { Button } from 'semantic-ui-react'
import AddProject from './addProject'
import Cookies from 'js-cookie';

class Project extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            projectList:[],
          }
        this.fetchTasks = this.fetchTasks.bind(this)
    }

    componentWillMount(){
        this.fetchTasks()
    }
    
    fetchTasks(){
        console.log('Fetching...')
    
        fetch('http://127.0.0.1:3000/keepTrack/project/',{headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
        .then(response => response.json())
        .then(data => 
            this.setState({
                projectList:data
            })
        )
    }
    render(){
        var projects = this.state.projectList
        return(
            <div>
                <div className="projectBox">
                    {projects.map(function(project, index){
                        return(
                            <div key={project.id}>
                                {project.id},
                                {project.project_name}
                            </div>
                            
                        )
                    })}
                    <Button>Click me</Button>
                </div>
                <AddProject/>
            </div>
            
        )
    }
}

export default Project;

