import { useEffect, useState } from 'react';
import axios from 'axios';

function MyChats() {
    const [myChats, setMyChats] = useState([]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await axios.get('http://localhost:3000/chat?myId=0ed51372-f9b0-4e44-864f-9bd50a477fad');
                setMyChats(response.data);
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };

        fetchChats();
    }, []);

    return (
        <div className="my-chats-container">
            <h2>My Chats</h2>
            <div className="chats-list">
                {myChats.length > 0 ? (
                    myChats.map((chat) => (
                        <div key={chat.id} className="chat-item">
                            <img 
                                src={`http://localhost:3000/${chat.to.photo}`} 
                                alt={`${chat.to.userName}'s avatar`} 
                                className="chat-avatar" 
                            />
                            <span className="chat-name">{chat.to.userName}</span>
                        </div>
                    ))
                ) : (
                    <p>No chats available</p>
                )}
            </div>
        </div>
    );
}

export default MyChats;
