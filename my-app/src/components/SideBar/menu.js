import React from 'react'
import {
  Icon,
  Menu,
  Sidebar,
} from 'semantic-ui-react'
import {Route,Link} from 'react-router-dom';
import AddProject from '../ProjectPage/addProject';

const SidebarMenu = () => {

    return (
            <Sidebar
                as={Menu}
                icon='labeled'
                inverted
                vertical
                visible
                width='thinner'
                className='sidebar'
            >   
                <Menu.Item as='a'>
                <Icon name='tasks' />
                    KeepTrack
                </Menu.Item>
                <br></br>
                <Link to='/project'>
                    <Menu.Item as='a'>
                    <Icon name='home' />
                        Home
                    </Menu.Item>
                </Link>
                <Link to='/project'>
                    <Menu.Item as='a'>
                    <Icon name='folder open' />
                        Projects
                    </Menu.Item>
                </Link>
                <Link to='/dashboard'>
                    <Menu.Item as='a'>
                    <Icon name='address book' />
                        Dashboard
                    </Menu.Item>
                </Link>
                <Link to='/dashboard'>
                    <Menu.Item as='a'>
                    <Icon name='users' />
                        Users
                    </Menu.Item>
                </Link>
                <Menu.Item as='a'>
                <Icon name='add square' />
                    <AddProject/>
                </Menu.Item>
            </Sidebar>
    )
}

export default SidebarMenu