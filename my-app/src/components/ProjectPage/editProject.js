import React from 'react';
import './temp.css';
import { Form, Checkbox, Button, Icon, Modal } from 'semantic-ui-react';
import axios from "axios";
import Cookies from 'js-cookie';
import Popup from 'reactjs-popup';
import { MultiSelect } from "react-multi-select-component";
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const EditProject = (props) => {
    var allUsers = props.usersAll
    var activeProj = props.Proj
    var projectId = props.projectId
    const [projectInfo, setProjectInfo] = React.useState(activeProj.project_name);
    var today = new Date(),
    date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()+ ' ' + today.getHours() + ':' + today.getMinutes();
    //datea = date.toISOString();
    const [is_completed, setis_completed] = React.useState(activeProj.is_completed);
    const [start_date, setStart_date] = React.useState(activeProj.start_date);
    const [due_date, setDue_date] = React.useState(activeProj.due_date);
    const [members_p, setMembers_p] = React.useState(activeProj.members_p);
    const [project_admins, setProject_admins] = React.useState(activeProj.project_admins);
    const [wiki, setWiki] = React.useState(activeProj.wiki);
    const [users, setUsers] = React.useState(allUsers);
    const [open, setOpen] = React.useState(false)

    var start_date1 = new Date(activeProj.start_date)
    var due_date1 = new Date(activeProj.due_date)
 
    const handleStatusChange = (event, data) => {
        console.log(start_date)
        setis_completed(!is_completed);
    }
    
    const handleSDateChange = (event, data) =>{ 
        if(data.value===null){
            setStart_date('')
            return
        } 
        var temp = data.value.toISOString()
        var isoDateTime = new Date(temp)
        var localDateTime = isoDateTime.toLocaleDateString() + " " + isoDateTime.toLocaleTimeString();
        var toSet = localDateTime.slice(6,10) + '-' + localDateTime.slice(3,5)+ '-' + localDateTime.slice(0,2);
        setStart_date(toSet);
        start_date1 = new Date(start_date)
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

    const handleWikiChange = (event,editor) => {
        setWiki(editor.getData())
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
            start_date : start_date,
            due_date : due_date,
            wiki :wiki,
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
 
        if(projectInfo===''||start_date===''||due_date===''||wiki===''||members_p==[]||project_admins==[]){
            alert('Please fill all the fields!')
            return;
        }
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
                alert('Please fill all the fields and enter a unique project name!')
                console.log("hemlo")
                console.log(err);
            });
    }
    
    return(
        <div>
        <Popup
            trigger={(props.page===1)?(<Button className='edit-delete' floated='left' basic color='yellow'>
                                        <Icon name='edit' /> Edit</Button>):
                                        (<button className="addlist2">
                                        <Icon name='edit' size='big'/> <br></br>
                                        Edit
                                        </button>)}
            modal
            className="temp"
            onOpen={()=>setAllFields()}
            nested>

            {close => (
            <div className="editProjPopUp"> 
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
                        type = 'text'
                        name='project_name'
                        value={projectInfo}
                        className='input-box'
                        onChange= {(e) => setProjectInfo(e.target.value)} />

                    <Form.Group widths={2}>
                        <SemanticDatepicker value={start_date1} label='Start-date' onChange={handleSDateChange} />
                        <SemanticDatepicker value={due_date1} label='Due-date' onChange={handleDDateChange} />
                    </Form.Group>

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

                    <Form.Field
                    control={Checkbox}
                    width={1}
                    label='Complete?'
                    checked = {is_completed}
                    onChange={handleStatusChange}
                    />
                    
                    <CKEditor 
                        placeholder='Wiki' 
                        label='Wiki'
                        data={wiki}
                        onChange={(event, editor) => handleWikiChange( event, editor)}
                        editor= {ClassicEditor}
                    />

                    <br></br>
                    
                    <div className='flex-div'>
                    <Button 
                        color='teal'
                        type='button'
                        onClick={() => {
                        handleFormSubmit()
                        // close();
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