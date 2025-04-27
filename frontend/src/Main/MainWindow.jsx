import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers, faGlobe } from '@fortawesome/free-solid-svg-icons';
import Login from './Login';
import Register from './Register';
import PrivateChats from '../components/chats/PrivateChats/PrivateChats';
import GroupChats from '../components/chats/GroupChats';
import GlobalChats from '../components/chats/GlobalChats';
import './Main.css';

function Main() {
    const [activeChat, setActiveChat] = useState(null);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);

    const handleChatClick = (chatType) => {
        setActiveChat(chatType);
    };

    const openRegisterForm = () => setShowRegisterForm(true);
    const openLoginForm = () => setShowLoginForm(true);

    const closeRegisterForm = () => setShowRegisterForm(false);
    const closeLoginForm = () => setShowLoginForm(false);

    return (
        <div className="main-container">
            <nav className="sidebar">
                <div className="left-menu">
                    <ul>
                        <li onClick={() => handleChatClick('private')}>
                            <FontAwesomeIcon icon={faUser} />
                        </li>
                        <li onClick={() => handleChatClick('group')}>
                            <FontAwesomeIcon icon={faUsers} />
                        </li>
                        <li onClick={() => handleChatClick('global')}>
                            <FontAwesomeIcon icon={faGlobe} />
                        </li>
                    </ul>
                </div>
                <div className="right-menu">
                    <button className="login-btn" onClick={openLoginForm}>Login</button>
                    <button className="register-btn" onClick={openRegisterForm}>Register</button>
                </div>
            </nav>

            <div className={`content ${activeChat === 'private' ? 'private-mode' : ''}`}>
    {activeChat === 'private' && <PrivateChats />}
    {activeChat === 'group' && <GroupChats />}
    {activeChat === 'global' && <GlobalChats />}
    {!activeChat && <p>Select a chat</p>}
</div>



            {showRegisterForm && <Register closeRegisterForm={closeRegisterForm} />}
            {showLoginForm && <Login closeLoginForm={closeLoginForm} />}
        </div>
    );
}

export default Main;
