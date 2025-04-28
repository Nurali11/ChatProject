import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './GlobalChats.css';

function GlobalChat() {
    const [userData, setUserData] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const userObject = JSON.parse(user);
            setUserData(userObject);
        }
    }, []);

    useEffect(() => {
        if (userData) {
            fetchMessages();
        }
    }, [userData]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get('http://localhost:3000/global');
            setMessages(response.data);
        } catch (error) {
            alert('Error fetching messages:', error);
        }
    };

    const handleChange = (event) => {
        setMessage(event.target.value);
    };

    const sendMessage = async () => {
        const text = message.trim();
        
        if (!text) {
            console.log('Message is empty');
            return;
        }
    
        const user = JSON.parse(localStorage.getItem('user'));
        const fromId = user.id;

        if (!fromId) {
            alert('Login first to send messages');
            return;
        }

        try {
            const newMessage = {
                fromId,
                text,
            };
    
            const sendResponse = await axios.post('http://localhost:3000/global', newMessage);
    
            if (sendResponse.status === 200 || 201) {
                setMessage("");
                fetchMessages(); 
            } else {
                alert('Error sending message');
            }
    
        } catch (error) {
            alert(`Error sending message: ${error}`);
        }
    };

    return (
        <div className="global-chat-container">
            {userData ? (
                <>
                    <div className="global-chat-header">
                        <h2>Global Chats</h2>
                    </div>

                    <div className="global-chat-messages">
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`global-message-item ${msg.fromId === userData.id ? 'global-my-message' : 'global-their-message'}`}
                            >
                                <div className="global-message-text">
                                    {msg.fromId !== userData.id && msg.from && (
                                        <div className="global-message-user-info">
                                            <img 
                                                src={`http://localhost:3000/${msg.from.photo}`} 
                                                alt={`${msg.from.name}'s avatar`} 
                                                className="global-message-avatar"
                                            />
                                            <span className="global-message-user-name">{msg.from.name}</span>
                                        </div>
                                    )}
                                    <span>{msg.text}</span>
                                    <div className="global-message-time">
                                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="global-chat-input">
                        <input 
                            type="text" 
                            placeholder="Type your message..." 
                            className="global-message-input"
                            value={message}
                            onChange={handleChange}
                        />
                        <button className="global-send-button" onClick={sendMessage}>
                            <FontAwesomeIcon icon={faPaperPlane} className="global-send-icon" />
                        </button>
                    </div>
                </>
            ) : (
                <p>Global Chats</p>
            )}
        </div>
    );
}

export default GlobalChat;
