import React from 'react';
import Select from 'react-select'
import './temp.css';
import { Form, Checkbox, Button, Icon, Modal } from 'semantic-ui-react';
import axios from "axios";
import Cookies from 'js-cookie';
import Popup from 'reactjs-popup';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const AddProject = (props) => {
    const [projectInfo, setProjectInfo] = React.useState({
        project_name: "",
    });
    var today = new Date(),
    
    date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()+ ' ' + today.getHours() + ':' + today.getMinutes();
    
    const [is_completed, setis_completed] = React.useState(false);
    const [start_date, setStart_date] = React.useState(today);
    const [due_date, setDue_date] = React.useState(date);
    const [members_p, setMembers_p] = React.useState([]);
    const [project_admins, setProject_admins] = React.useState([]);
    const [wiki, setWiki] = React.useState("");
    const [users, setUsers] = React.useState([]);
    const [open, setOpen] = React.useState(false)

    const handleInfoChange = (e) => {
        const {name,value} = e.target;
        setProjectInfo((prevValue)=>({
            ...prevValue,
            [name]:value,
        }));
    };

    const handleStatusChange = (event, data) => {
        setis_completed(!is_completed);
    }
    
    const handleSDateChange = (event, data) =>{ 
        if(data.value===null){
            setStart_date('')
            return
        } 
        var temp = data.value.toISOString()
        // console.log(data.value)
        var isoDateTime = new Date(temp)
        var localDateTime = isoDateTime.toLocaleDateString() + " " + isoDateTime.toLocaleTimeString();
        var toSet = localDateTime.slice(6,10) + '-' + localDateTime.slice(3,5)+ '-' + localDateTime.slice(0,2);
        setStart_date(toSet);
    }
    const handleDDateChange = (event, data) =>{ 
        if(data.value===null){
            setDue_date('')
            return
        }
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
     
    const handleWikiChange = (event,editor) => {
        setWiki(editor.getData())
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
        const data = {
            project_name : projectInfo.project_name,
            start_date : start_date,
            due_date : due_date,
            wiki : wiki,
            is_completed : is_completed,
            members_p : members_p,
            project_admins : project_admins
        };
        var date1 = new Date(start_date)
        var date2 = new Date(due_date)

        if(date1-date2>0){
            setOpen(true)
            return
        }

        if(projectInfo.project_name===''||start_date===''||due_date===''||wiki===''||members_p==[]||project_admins==[]){
            alert('Please fill all the fields!')
            return;
        }

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
                alert('Please fill all the fields and enter a unique project name!')
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
                <Modal
                     onClose={() => setOpen(false)}
                     onOpen={() => setOpen(true)}
                     open={open}
                >
                    <Modal.Content>
                        Due date cannot be smaller than start date of project!
                    </Modal.Content>
                    <Button color='black' onClick={() => setOpen(false)}>
                        Ok
                    </Button>
                </Modal>
                <Form className='form-popup'>
                    <Form.Input 
                        placeholder='Project Name' 
                        width={16}
                        name='project_name'
                        value={projectInfo.project_name}
                        onChange={handleInfoChange} 
                        />

                    <Form.Group widths={2}>
                        <SemanticDatepicker error label='Start-date' onChange={handleSDateChange} />
                        <SemanticDatepicker error label='Due-date' onChange={handleDDateChange} />
                    </Form.Group>

                    <Select
                        placeholder='Members'
                        isMulti
                        isSearchable
                        options={members}
                        onChange={handleMembersChange}
                        error
                    ></Select>
                    <br></br>
                    <Select
                        placeholder='Project Admins'
                        isMulti
                        isSearchable
                        options={members}
                        onChange={handleProjAdminsChange}
                        error
                    ></Select>
                    <br></br>

                    <Form.Field
                    control={Checkbox}
                    width={1}
                    label='Complete?'
                    onChange={handleStatusChange}
                    />

                    <CKEditor 
                        placeholder='Wiki' 
                        label='Wiki'
                        data={wiki}
                        onChange={(event, editor) => handleWikiChange( event, editor)}
                        editor= {ClassicEditor}
                        error
                    />

                    <br></br>
                    
                    <div className='flex-div'>
                    <Button 
                        color='teal'
                        type='button'
                        onClick={() => {
                        handleFormSubmit()
                        // close();
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