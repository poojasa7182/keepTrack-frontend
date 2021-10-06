import React from 'react'
import SidebarMenu from '../SideBar/menu'
import './temp5.css';
import UserInfoO from './info-user';

const UsersPageO = () => (
    <div>
        <div className='container'>
            <div className='sidebar'>
                <SidebarMenu />
            </div>
            <div className='projectsContainer'>
                <UserInfoO />
            </div>
        </div>
        <div className='footer'>
            Footer
        </div>
    </div>
)

export default UsersPageO