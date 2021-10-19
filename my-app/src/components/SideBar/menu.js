import React from 'react'
import { Icon, Menu, Sidebar } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import AddProject from '../ProjectPage/addProject';
const SidebarMenu = () => {
    const visible = !(window.location.href=='http://localhost:3000/project')
    // console.log(visible)
    return (
            <Sidebar
                as={Menu}
                icon='labeled'
                inverted
                vertical
                visible
                className='sidebar'
            >   
                <Menu.Item as='a'>
                <Icon name='tasks' />
                    KeepTrack
                    <br></br>
                </Menu.Item>
                <br></br>
                <Menu.Item as={Link} to='/project'>
                <Icon name='home' />
                    Home
                </Menu.Item>
                <Menu.Item as={Link} to='/project'>
                <Icon name='folder open' />
                    Projects
                </Menu.Item>
                <Menu.Item as={Link} to='/dashboard'>
                <Icon name='address book' />
                    Dashboard
                </Menu.Item>
                <Menu.Item as={Link} to='/users'>
                <Icon name='users' />
                    Users
                </Menu.Item>
                {/* pass visible={(window.location.href=='http://localhost:3000/project')?true:undefined} */}
                <Menu.Item as='' to='/'>
                    <AddProject />
                </Menu.Item>
                <Menu.Item as={Link} to='/logout'>
                <Icon name='sign-out alternate' />
                    Log-out
                </Menu.Item>
            </Sidebar>
    )
}

export default SidebarMenu