import React, {useRef} from 'react';
import Select from 'react-select'
import './temp.css';
import { Form, Checkbox, Button, TextArea } from 'semantic-ui-react';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import axios from "axios";
import JoditEditor from "jodit-react";
import dateFormat from 'dateformat';
import Datetime from 'react-datetime';
import Cookies, { set } from 'js-cookie';
import { Redirect } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { MultiSelect } from "react-multi-select-component";

const EditProject = ({projectId}) => {
    console.log({projectId})
    const [activeProj, setActiveProj] = React.useState()
    const [projectInfo, setProjectInfo] = React.useState("");
    
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
    // const editor = useRef(null)
    // const config = {
	// 	readonly: false // all options from https://xdsoft.net/jodit/doc/
	// }

    // const handleInfoChange = (e) => {
    //     const {name,value} = e.target;
    //     setProjectInfo((prevValue)=>({
    //         ...prevValue,
    //         [name]:value,
    //     }));
    // };

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
        const {value} = e.target;
        setStart_date(value);
    }
    const handleDDateChange = (event, data) => setDue_date(data.value);

    var handleMembersChange = (e) => {
        setMembers_p(Array.isArray(e)?e.map(x => x.key):["n"]);
    }

    const handleProjAdminsChange = (e) => {
        setProject_admins(Array.isArray(e)?e.map(x => x.key):["n"]);
    }
    
    async function fetchUserList() {
        axios
            .get('http://localhost:3000/keepTrack/user/', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                setUsers(response.data)
            })
            
            .catch((error) => console.log(error));
    }
     
    async function fetchProjectDetails() {
        axios
            .get('http://localhost:3000/keepTrack/project/'+projectId+'/', {headers:{ "X-CSRFToken":Cookies.get('keepTrack_csrftoken')}})
            .then((response) => {
                console.log(response)
                setActiveProj(response.data)
                console.log(activeProj)
                
            })
            
            .catch((error) => console.log(error));
    }

    async function setDetails(){
        setProjectInfo(activeProj.project_name);
        setStart_date(activeProj.start_date);
        setDue_date(activeProj.due_date);
        setWiki(activeProj.wiki);
        setis_completed(activeProj.is_completed);
        setMembers_p(activeProj.members_p);
        setProject_admins(activeProj.project_admins)
    }
    
    React.useEffect(()=>{
        fetchUserList();
        fetchProjectDetails();
        setDetails();
    }, []);

    const members = users.map((user)=>({
        key : user.id,
        value : user.id,
        label : user.username,
        text : user.username
    }))

    const handleFormSubmit = () => {
        const data = new FormData();
        data.append("project_name", projectInfo);
        data.append("start_date", "2021-09-04T10:18:00Z");
        data.append("due_date","2021-09-04T10:18:00Z");
        data.append("wiki",wiki);
        data.append("is_completed",is_completed);
        data.append("members_p",members_p);
        data.append("project_admins",project_admins);

        axios
            .put("http://localhost:3000/keepTrack/project/",data, {
                headers: { "Content-Type": "multipart/form-data", "X-CSRFToken":Cookies.get('keepTrack_csrftoken') },
                params: {withCredentials : true}
            })
            .then((response)=>{
                console.log(response);
            })
            .catch((err) => {
                console.log("hemlo")
                console.log(err);
                
            });
    }

    return(
        <div>
        <Popup
            trigger={<button className="button"> Edit </button>}
            modal
            className="temp"
            nested
        >
            {close => (
            <div className="temp"> 
                <button onClick={close}>
                &times;
                </button>
               
                <Form >
                    <Form.Input 
                        placeholder='Project Name' 
                        width={16}
                        name='project_name'
                        value={projectInfo}
                        onChange= {newInfo => setProjectInfo(newInfo)} />

                    <Form.Group widths='equal'>

                        {/* <DateTimeInput 
                        placeholder='Start Date'
                        name='start_date'
                        width={8}
                        value={start_date}
                        onChange={handleSDateChange} /> */}
                        
                        <Datetime
                        placeholder='Start Date'
                        name='start_date'
                        value = {start_date}
                        width={8}
                        timeFormat = {true}
                        onChange={handleSDateChange}
                        />

                        <DateTimeInput 
                        placeholder='Due/End Date'
                        name='due_date'
                        width={8}
                        value={due_date}
                        onChange={handleDDateChange} />

                    </Form.Group>

                    <TextArea 
                    placeholder='Wiki' 
                    style={{ minHeight: 100 }}
                    onChange= {newWiki => setWiki(newWiki)}
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
                    
                    {/* <Select
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
                    ></Select> */}
                    <MultiSelect
                        options={members}
                        value={members_p}
                        onChange={setMembers_p}
                        labelledBy="Select"
                    />
                    <br></br>
                    <Button 
                        type='button'
                        onClick={() => {
                        console.log('modal closed ');
                        handleFormSubmit()
                        close();
                        }}>Add Project</Button>
                </Form>
            </div>
            )}
        </Popup>
        </div>
    );
    
}

export default EditProject;