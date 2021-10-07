import React, {useRef} from 'react';
import Select from 'react-select'
import './temp.css';
import { Form, Checkbox, Button, TextArea, Menu, Icon } from 'semantic-ui-react';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import axios from "axios";
import JoditEditor from "jodit-react";
import dateFormat from 'dateformat';
import Datetime from 'react-datetime';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom';
import Popup from 'reactjs-popup';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

const AddProject = (props) => {
    const [projectInfo, setProjectInfo] = React.useState({
        project_name: "",
    });
    var today = new Date(),
    
    date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()+ ' ' + today.getHours() + ':' + today.getMinutes();
    //datea = date.toISOString();
    const [is_completed, setis_completed] = React.useState(false);
    const [start_date, setStart_date] = React.useState(today);
    const [due_date, setDue_date] = React.useState(date);
    const [members_p, setMembers_p] = React.useState([]);
    const [project_admins, setProject_admins] = React.useState([]);
    const [wiki, setWiki] = React.useState("");
    const [users, setUsers] = React.useState([]);
    var done = false;
    // const editor = useRef(null)
    // const config = {
	// 	readonly: false // all options from https://xdsoft.net/jodit/doc/
	// }

    const handleInfoChange = (e) => {
        const {name,value} = e.target;
        setProjectInfo((prevValue)=>({
            ...prevValue,
            [name]:value,
        }));
    };

    const handleStatusChange = (event, data) => {
        // console.log(is_completed)
        console.log(start_date)
        setis_completed(!is_completed);
        
    }
    
    const handleSDateChange = (event, data) =>{ 
        var temp = data.value.toISOString()
        console.log(data.value)
        var isoDateTime = new Date(temp)
        var localDateTime = isoDateTime.toLocaleDateString() + " " + isoDateTime.toLocaleTimeString();
        var toSet = localDateTime.slice(6,10) + '-' + localDateTime.slice(3,5)+ '-' + localDateTime.slice(0,2);
        setStart_date(toSet);
    }
    const handleDDateChange = (event, data) =>{ 
        var temp = data.value.toISOString()
        var isoDateTime = new Date(temp)
        var localDateTime = isoDateTime.toLocaleDateString() + " " + isoDateTime.toLocaleTimeString();
        var toSet = localDateTime.slice(6,10) + '-' + localDateTime.slice(3,5)+ '-' + localDateTime.slice(0,2);
        setDue_date(toSet);
    }
    

    var handleMembersChange = (e) => {
        var temp = [];
        for(var i = 0 ; i < e.length ; i++) temp.push(e[i].key)
        setMembers_p(temp)
    }

    const handleProjAdminsChange = (e) => {
        var temp = [];
        for(var i = 0 ; i < e.length ; i++) temp.push(e[i].key)
        setProject_admins(temp)
    }
    
    async function fetchUserList() {
        axios
            .get('http://localhost:3000/keepTrack/user/', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                setUsers(response.data)
            })
            .catch((error) => console.log(error));
    }

    React.useEffect(()=>{
        fetchUserList();
    }, []);

    const members = users.map((user)=>({
        key : user.id,
        value : user.id,
        label : user.name,
        text : user.name,
    }))

    const handleFormSubmit = () => {
        done = true
        const data = {
            project_name : projectInfo.project_name,
            start_date : "2021-09-04T10:18:00Z",
            due_date : "2021-09-04T10:18:00Z",
            wiki : wiki,
            is_completed : is_completed,
            members_p : members_p,
            project_admins : project_admins
        };
        setProjectInfo((prevValue)=>({
            ...prevValue,
            project_name:'',
        }));
        setStart_date(today)
        setDue_date(today)
        setWiki('')
        setis_completed(false)
        setMembers_p([])
        setProject_admins([])
        axios
            .post("http://localhost:3000/keepTrack/project/",data, {
                headers: { 'Content-Type': 'application/json', "X-CSRFToken":Cookies.get('keepTrack_csrftoken') },
                params: {withCredentials : true}
            })
            .then((response)=>{
                console.log(response);
                props.refreshProjectList(true);
            })
            .catch((err) => {
                console.log("hemlo")
                console.log(err);
                
            });
    }

    return(
        <div>
        <Popup
            trigger={<button className="addproj"> 
            <Icon name='add square' size='big'/><br></br>Add Project
            </button>}
            modal
            className="temp"
            nested
            closeOnDocumentClick
            // onClose = {props.refreshProjectList(true)}
        >
            {close => (
            <div className="addProjPopUp"> 
                <Form className='form-popup'>
                    <Form.Input 
                        placeholder='Project Name' 
                        width={16}
                        name='project_name'
                        value={projectInfo.project_name}
                        onChange={handleInfoChange} />

                    <Form.Group widths='equal'>
                        <SemanticDatepicker label='Start-date' onChange={handleSDateChange} />
                        <SemanticDatepicker label='Due-date' onChange={handleDDateChange} />
                    </Form.Group>

                    <TextArea 
                    placeholder='Wiki' 
                    style={{ minHeight: 100 }}
                    value = {wiki}
                    onChange= {newWiki => setWiki(newWiki.target.value)}
                    />
                    {/* <JoditEditor
                        ref={editor}
                        value={wiki}
                        config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={newWiki => setWiki(newWiki)} // preferred to use only this option to update the content for performance reasons
                        onChange={newWiki => {}}
                    /> */}

                    <br></br>
                    <br></br>
                    <Form.Field
                    control={Checkbox}
                    width={1}
                    label='Complete?'
                    onChange={handleStatusChange}
                    />
                    <Select
                        placeholder='Members'
                        isMulti
                        isSearchable
                        options={members}
                        onChange={handleMembersChange}
                    ></Select>
                    <br></br>
                    <Select
                        placeholder='Project Admins'
                        isMulti
                        isSearchable
                        options={members}
                        onChange={handleProjAdminsChange}
                    ></Select>
                    <br></br>
                    <div className='flex-div'>
                    <Button 
                        color='teal'
                        type='button'
                        onClick={() => {
                        handleFormSubmit()
                        close();
                        }}>Add Project</Button>
                    </div>
                </Form>
                <button onClick={close} className="button-close">
                <Icon name='close' color='red' size='big'/>
                </button>
            </div>
            )}
        </Popup>
        </div>
    );
    
}

export default AddProject;