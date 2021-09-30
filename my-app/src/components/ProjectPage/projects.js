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
import EditProject from './editProject'

const Project = () => {
    
    const [projects, setProjects] = React.useState([]);
    const [editList, setEditList] = React.useState();

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

    function handleDeleteEvent(id) {
        axios
            .delete("http://localhost:3000/keepTrack/project/"+ id +"/", {
                headers: {"X-CSRFToken":Cookies.get('keepTrack_csrftoken') },
                params: {withCredentials : true}
            })
            .then((response)=>{
                console.log(response);
                fetchProjectList();
            })
            .catch((err) => {
                console.log("hemlo")
                console.log(err);
            });
    };

    function handleEditEvent(id) {
        console.log(id)
        setEditList(<EditProject projectId = {id} />);
    };

    return(
 
        <div>
            <div className="projectBox">
                {projects.map(function(project, index){
                    return(
                        <div key={project.id}>
                            {project.id},
                            {project.project_name}
                            &nbsp;&nbsp;
                            <button type="button" onClick={() => handleDeleteEvent(project.id)}>Delete</button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button type="button" onClick={() => handleEditEvent(project.id)}>Edit</button>
                        </div>
                        
                    )
                })}
                <Button>Click me</Button>
            </div>
            <AddProject onChange={fetchProjectList()}/>
            {editList}
        </div>
    );
    
}

export default Project;