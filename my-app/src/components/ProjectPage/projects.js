import React, {useRef} from 'react';
import Select from 'react-select'
import './temp.css';
import { Form, Checkbox, Button, TextArea } from 'semantic-ui-react';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import axios from "axios";
import JoditEditor from "jodit-react";
import dateFormat from 'dateformat';
import Datetime from 'react-datetime';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom';
import Popup from 'reactjs-popup';
import AddProject from './addProject'
const Project = () => {
    
    const [projects, setProjects] = React.useState([]);
    
    async function fetchProjectList() {
        axios
            .get('http://localhost:3000/keepTrack/project/', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                setProjects(response.data)
            })
            .catch((error) => console.log(error));
    }

    React.useEffect(()=>{
        fetchProjectList();
    }, []);

    const handleDeleteEvent = (id) => {
        console.log(id)
        // axios
        //     .delete("http://localhost:3000/keepTrack/project/"+id +"/", {
        //         headers: { "Content-Type": "multipart/form-data", "X-CSRFToken":Cookies.get('keepTrack_csrftoken') },
        //         params: {withCredentials : true}
        //     })
        //     .then((response)=>{
        //         console.log(response);
        //     })
        //     .catch((err) => {
        //         console.log("hemlo")
        //         console.log(err);
        //     });
    }
    return(
 
        <div>
                <div className="projectBox">
                    {projects.map(function(project, index){
                        return(
                            <div key={project.id}>
                                {project.id},
                                {project.project_name}
                                <Button onClick={handleDeleteEvent(project.id)}>Delete</Button>
                            </div>
                            
                        )
                    })}
                    <Button>Click me</Button>
                </div>
                <AddProject/>
            </div>
    );
    
}

export default Project;