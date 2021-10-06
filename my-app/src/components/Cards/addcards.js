import React, {useRef} from 'react';
import Select from 'react-select'
import './temp3.css';
import { Form, Checkbox, Button, TextArea, Menu, Icon } from 'semantic-ui-react';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import axios from "axios";
import JoditEditor from "jodit-react";
import dateFormat from 'dateformat';
import Datetime from 'react-datetime';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom';
import Popup from 'reactjs-popup';
import DatePicker from "react-datepicker";
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
        setMembers_c(temp)
    }

    const members = props.users.map((user)=>({
        key : user.id,
        value : user.id,
        label : user.username,
        text : user.username,
    }))

    const handleFormSubmit = () => {
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
        setCardInfo((prevValue)=>({
            ...prevValue,
            card_name:'',
        }));
        setStart_date('')
        setDue_date('')
        setDescription('')
        setis_completed(false)
        setMembers_c([])
        
        axios
            .post("http://localhost:3000/keepTrack/card/",data, {
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
                <Form className='form-popup-c'>
                    <Form.Input 
                        placeholder='Card title' 
                        width={16}
                        name='card_name'
                        value={cardInfo.card_name}
                        onChange={handleInfoChange} />

                    <Form.Group widths='equal'>
                        <SemanticDatepicker label='Start-date' onChange={handleSDateChange} />
                        <SemanticDatepicker label='Due-date' onChange={handleDDateChange} />
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
                    <Form.Input 
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
                    />
                    <div className='flex-div'>
                    <Button 
                        color='teal'
                        type='button'
                        onClick={() => {
                        handleFormSubmit()
                        close();
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