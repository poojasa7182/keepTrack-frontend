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
    // const handleSDateChange = (event, data) => {
    //     setStart_date(data.value);
    //     var newdaa = new Date();
    //     newdaa = start_date;
    // }
    const handleSDateChange = (e) => {
        console.log(e)
        // const {value} = e.target;
        // setStart_date(value);
    }
    const handleDDateChange = (event, data) => setDue_date(data.value);

    var handleMembersChange = (e) => {
        var temp = [];
        for(var i = 0 ; i < e.length ; i++) temp.push(e[i].key)
        setMembers_p(temp)
        // console.log(members_p.type)
        // console.log(members_p)
    }

    const handleProjAdminsChange = (e) => {
        var temp = [];
        for(var i = 0 ; i < e.length ; i++) temp.push(e[i].key)
        setProject_admins(temp)
        //setProject_admins(e.key)
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

                        {/* <DateTimeInput 
                        placeholder='Start Date'
                        name='start_date'
                        width={8}
                        value={start_date}
                        onChange={handleSDateChange} /> */}
                        
                        <DateTimeInput 
                        placeholder='Start Date'
                        name='start_date'
                        value = {start_date}
                        onChange={handleSDateChange}/>
                        <DateTimeInput 
                        placeholder='Due/End Date'
                        name='due_date'
                        value={due_date}
                        onChange={handleDDateChange} />

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