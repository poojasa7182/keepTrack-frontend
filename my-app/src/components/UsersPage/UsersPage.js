import React from 'react'
import SidebarMenu from '../SideBar/menu'
import './temp5.css';
import Users from './users';

const UsersPage = () => (
    <div>
        <div className='container'>
            <div className='sidebar'>
                <SidebarMenu />
            </div>
            <div className='projectsContainer'>
                <Users />
            </div>
        </div>
        <div className='footer'>
            Footer
        </div>
    </div>
)

export default UsersPage