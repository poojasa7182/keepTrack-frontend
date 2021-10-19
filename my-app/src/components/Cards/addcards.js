import React from 'react';
import Select from 'react-select'
import './temp3.css';
import { Form, Checkbox, Button, TextArea, Modal, Icon } from 'semantic-ui-react';
import axios from "axios";
import Cookies from 'js-cookie';
import Popup from 'reactjs-popup';
import 'react-datepicker/dist/react-datepicker.css';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

const AddCard = (props) => {
    const [cardInfo, setCardInfo] = React.useState({
        card_name: "",
    });
    const [is_completed, setis_completed] = React.useState(false);
    const [start_date, setStart_date] = React.useState('');
    const [due_date, setDue_date] = React.useState('');
    const [members_c, setMembers_c] = React.useState([]);
    const [description, setDescription] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [messageNo, setNum] = React.useState(-1);
    var start_date1 = null
    var due_date1 = null

    const handleInfoChange = (e) => {
        const {name,value} = e.target;
        setCardInfo((prevValue)=>({
            ...prevValue,
            [name]:value,
        }));
    };

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
        console.log(data.value)
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
        setMembers_c(temp)
    }

    const members = props.users.map((user)=>({
        key : user.id,
        value : user.id,
        label : user.name,
        text : user.name,
    }))

    const handleFormSubmit = () => {
        if(cardInfo.card_name===''||start_date===''||due_date===''||description===''){
            // alert('Please fill all the fields!')
            setNum(1);
            setOpen(true)
            return;
        }

        const data = {
            card_name : cardInfo.card_name,
            start_date : start_date,
            due_date : due_date,
            description: description,
            is_completed : is_completed,
            members_c : members_c,
            project_c : props.projectId,
            list_c : props.listId
        };
        var date1 = new Date(start_date)
        var date2 = new Date(due_date)

        if(date1-date2>0){
            setNum(2)
            setOpen(true)
            return
        }
        
        axios
            .post("http://localhost:3000/keepTrack/card/",data, {
                headers: { 'Content-Type': 'application/json', "X-CSRFToken":Cookies.get('keepTrack_csrftoken') },
                params: {withCredentials : true}
            })
            .then((response)=>{
                console.log(response);
                props.refreshProjectList(true);
                setCardInfo((prevValue)=>({
                    ...prevValue,
                    card_name:'',
                }));
                setStart_date('')
                setDue_date('')
                setDescription('')
                setis_completed(false)
                setMembers_c([])
                start_date1 = null;
                due_date1 = null;
            })
            .catch((err) => {
                setNum(3);
                setOpen(true)
                console.log("hemlo")
                console.log(err);
            });
    }

    return(
        <div>
        <Popup
            trigger={(props.page===1)?(<button className="addlist">
                            <Icon name='add square' size='big'/> <br></br>
                            Add Card
                            </button>):(<Button
                    color='orange'
                    circular
                    floated='right'
                    size='mini'
                    >  Add Card</Button>)}
            modal
            className="temp"
            nested
            closeOnDocumentClick
        >
            {close => (
            <div className="addCardPopUp"> 
                <Modal
                     onClose={() => setOpen(false)}
                     onOpen={() => setOpen(true)}
                     open={open}
                >
                    <Modal.Content>
                        {
                            (messageNo===2)?('Due date cannot be smaller than start date of project!')
                            :((messageNo===1)?('Please fill all the fields'):('Please enter a unique card name'))
                        }
                        
                    </Modal.Content>
                    <Button color='black' onClick={() => setOpen(false)}>
                        Ok
                    </Button>
                </Modal>
                <Form className='form-popup-c'>
                    <Form.Input 
                        placeholder='Card title' 
                        width={16}
                        name='card_name'
                        value={cardInfo.card_name}
                        onChange={handleInfoChange} />
 
                    <Form.Group widths={2}>
                        <SemanticDatepicker value={start_date1} label='Start-date' onChange={handleSDateChange} />
                        <SemanticDatepicker value={due_date1} label='Due-date' onChange={handleDDateChange} />
                    </Form.Group>

                    <TextArea 
                    placeholder='Description' 
                    style={{ minHeight: 100 }}
                    value = {description}
                    onChange= {newWiki => setDescription(newWiki.target.value)}
                    />
                    <br></br>
                    <br></br>
                    <Form.Field
                    control={Checkbox}
                    width={1}
                    label='Complete?'
                    onChange={handleStatusChange}
                    />
                    
                    <Select
                        placeholder='Assignees'
                        isMulti
                        isSearchable
                        options={members}
                        onChange={handleMembersChange}
                    ></Select>
                    <br></br>
                    {/* <Form.Input 
                        placeholder='Project Name' 
                        width={16}
                        name='project_name'
                        value={props.project_name}
                    />
                    <Form.Input 
                        placeholder='List Name' 
                        width={16}
                        name='list_name'
                        value={props.list_name}
                    /> */}
                    <div className='flex-div'>
                    <Button 
                        color='teal'
                        type='button'
                        onClick={() => {
                        handleFormSubmit()
                        // close();
                        }}>Add Card</Button>
                    </div>
                </Form>
                <button onClick={close} className="button-close-c">
                <Icon name='close' color='red' size='big'/>
                </button>
            </div>
            )}
        </Popup>
        </div>
    );
    
}

export default AddCard;