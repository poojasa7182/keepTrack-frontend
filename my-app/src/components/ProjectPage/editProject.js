import React, {useRef} from 'react';
import Select from 'react-select'
import './temp.css';
import { Form, Checkbox, Button, TextArea, Icon } from 'semantic-ui-react';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import axios from "axios";
import JoditEditor from "jodit-react";
import dateFormat from 'dateformat';
import Datetime from 'react-datetime';
import Cookies, { set } from 'js-cookie';
import { Redirect } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { MultiSelect } from "react-multi-select-component";
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

const EditProject = (props) => {
    var allUsers = props.usersAll
    var activeProj = props.Proj
    var projectId = props.projectId
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
    var start_date1 = new Date(start_date)
    var due_date1 = new Date(due_date)

    const handleStatusChange = (event, data) => {
        console.log(start_date)
        setis_completed(!is_completed);
    }
    
    const handleSDateChange = (event, data) =>{ 
        var temp = data.value.toISOString()
        var isoDateTime = new Date(temp)
        var localDateTime = isoDateTime.toLocaleDateString() + " " + isoDateTime.toLocaleTimeString();
        var toSet = localDateTime.slice(6,10) + '-' + localDateTime.slice(3,5)+ '-' + localDateTime.slice(0,2);
        setStart_date(toSet);
        start_date1 = new Date(start_date)
    }
    const handleDDateChange = (event, data) =>{ 
        var temp = data.value.toISOString()
        var isoDateTime = new Date(temp)
        var localDateTime = isoDateTime.toLocaleDateString() + " " + isoDateTime.toLocaleTimeString();
        var toSet = localDateTime.slice(6,10) + '-' + localDateTime.slice(3,5)+ '-' + localDateTime.slice(0,2);
        setDue_date(toSet);
        due_date1 = new Date(due_date)
    }
    

    var handleMembersChange = (e) => {
        var temp = [];
        for(var i = 0 ; i < e.length ; i++) temp.push(e[i].key)
        setMembers_p(temp)
        projMem = e;
    }

    const handleProjAdminsChange = (e) => {
        var temp = [];
        for(var i = 0 ; i < e.length ; i++) temp.push(e[i].key)
        setProject_admins(temp)
        projAdmin = e;
    }

    async function setAllFields(){
        setProjectInfo(activeProj.project_name);
        setStart_date(activeProj.start_date);
        setDue_date(activeProj.due_date);
        setWiki(activeProj.wiki);
        setis_completed(activeProj.is_completed);
        setMembers_p(activeProj.members_p);
        setProject_admins(activeProj.project_admins);
        setUsers(allUsers);
        
    }

    React.useEffect(()=>{
        setAllFields();
    }, []);

    const members = users.map((user)=>({
        key : user.id,
        value : user.id,
        label : user.name,
        text : user.name
    }))
    var projMem = members.filter(mem => members_p.indexOf(mem.key)>-1);
    var projAdmin = members.filter(mem => project_admins.indexOf(mem.key)>-1);

    const handleFormSubmit = () => {
        const data = {
            project_name : projectInfo,
            start_date : "2021-09-04T10:18:00Z",
            due_date : "2021-09-04T10:18:00Z",
            wiki :wiki,
            is_completed : is_completed,
            members_p : members_p,
            project_admins : project_admins
        };

        axios
            .put("http://localhost:3000/keepTrack/project/"+projectId+"/",data, {
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
            trigger={   
                    <Button className='edit-delete' floated='left' basic color='yellow'>
                        <Icon name='edit' /> Edit
                    </Button> 
                    }
            modal
            className="temp"
            nested>

            {close => (
            <div className="editProjPopUp"> 
                <Form className='form-popup'>
                    <Form.Input 
                        placeholder='Project Name' 
                        width={16}
                        type = 'text'
                        name='project_name'
                        value={projectInfo}
                        className='input-box'
                        onChange= {(e) => setProjectInfo(e.target.value)} />

                    <Form.Group widths='equal'>
                        <SemanticDatepicker value={start_date1} label='Start-date' onChange={handleSDateChange} />
                        <SemanticDatepicker value={due_date1} label='Due-date' onChange={handleDDateChange} />
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
                    checked = {is_completed}
                    onChange={handleStatusChange}
                    />
                    
                    <MultiSelect
                        options={members}
                        value={projMem}
                        onChange={handleMembersChange}
                        labelledBy="Members"
                    />
                    <br></br>
                    <MultiSelect
                        options={members}
                        value={projAdmin}
                        onChange={handleProjAdminsChange}
                        labelledBy="Project Admins"
                    />
                    <br></br>
                    <div className='flex-div'>
                    <Button 
                        color='teal'
                        type='button'
                        onClick={() => {
                        handleFormSubmit()
                        close();
                        }}>Update Project</Button>
                    </div>
                </Form>
                <button className="button-close" onClick={() =>{close();props.refreshProjectList(true);setAllFields()}}>
                <Icon name='close' color='red' size='big'/>
                </button>
            </div>
            )}
        </Popup>
        </div>
    );
}

export default EditProject;