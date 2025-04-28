    import { useEffect, useState } from 'react';
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { faPaperPlane, faSearch } from '@fortawesome/free-solid-svg-icons';
    import './PrivateChats.css';
    import axios from 'axios';

    function PrivateChats() {
        const [userData, setUserData] = useState(null);
        const [searchQuery, setSearchQuery] = useState('');
        const [searchResults, setSearchResults] = useState([]);
        const [myId, setMyId] = useState(null);
        const [chats, setChats] = useState([]);
        const [selectedChatUser, setSelectedChatUser] = useState(null);
        const [message, setMessage] = useState(""); 
        const [messages, setMessages] = useState([]); // Для хранения сообщений
        const [typingTimeout, setTypingTimeout] = useState(null); // Для предотвращения частых запросов

        useEffect(() => {
            const user = localStorage.getItem('user');
            if (user) {
                const userObject = JSON.parse(user);
                setUserData(userObject);
                setMyId(userObject.id);
            }
        }, []);

        useEffect(() => {
            if (myId) {
                fetchChats();
            }
        }, [myId]);

        useEffect(() => {
            if (myId && selectedChatUser) {
                fetchMessages(selectedChatUser.id);
            }
        }, [myId, selectedChatUser]); // При изменении selectedChatUser и myId загружаем сообщения

        const fetchChats = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/chat?myId=${myId}`);
                setChats(response.data);
            } catch (error) {
                alert('Error fetching chats:', error);
            }
        };

        const fetchMessages = async (toId) => {
            if (!toId) return;

            try {
                const response = await axios.get(`http://localhost:3000/chat/private-messages?fromId=${myId}&toId=${toId}`);
                setMessages(response.data);
            } catch (error) {
                alert('Error fetching messages:', error);
            }
        };

        const handleSearchChange = (event) => {
            const query = event.target.value;
            setSearchQuery(query);
        
            if (!query.trim()) {
                setSearchResults([]);
                return;
            }
        
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        
            setTypingTimeout(setTimeout(() => {
                if (query.trim()) { 
                    handleSearch(query);
                }
            }, 500)); 
        };

        const handleSearch = async (query) => {
            try {
                const response = await axios.get(`http://localhost:3000/user?userName=${encodeURIComponent(query)}`);
                const users = response.data.filter(user => user.id !== myId);
                const updatedResults = users.map(user => {
                    const chatExists = chats.some(chat =>
                        (chat.from.id === myId && chat.to.id === user.id) ||
                        (chat.to.id === myId && chat.from.id === user.id)
                    );
                    return { ...user, chatExists };
                });

                setSearchResults(updatedResults);
            } catch (error) {
                alert(`An error occurred while searching. ${error}`);
            }
        };

        const handleStartChat = async (toId) => {
            try {
                await axios.post('http://localhost:3000/chat', {
                    fromId: myId,
                    toId: toId
                });

                await fetchChats();

                setSearchResults(prevResults =>
                    prevResults.map(user =>
                        user.id === toId
                            ? { ...user, chatExists: true }
                            : user
                    )
                );
            } catch (error) {
                alert('Error creating chat:', error);
            }
        };

        const handleGoToChat = (user) => {
            setSelectedChatUser(user);
            fetchMessages(user.id);
        };

        const handleChange = (event) => {
            setMessage(event.target.value);
        };

        async function sendMessage(toId) {
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
            
            if (!toId) {
                alert('Choose person to send messages');
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/chat?fromId=${fromId}&toId=${toId}`);
                if (!response.ok) {
                    alert('Cannot get chatId');
                    return;
                }

                const chatData = await response.json();
                const chatId = chatData.id;
                const message = {
                    fromId: fromId,
                    toId: toId,
                    chatId: chatId,
                    text: text
                };

                const sendResponse = await fetch('http://localhost:3000/chat/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(message)
                });

                if (sendResponse.ok) {
                    setMessage(""); // Очистить поле ввода
                    fetchMessages(toId); // Обновить сообщения для текущего чата
                } else {
                    alert('Error sending message');
                }
            } catch (error) {
                alert(`Error sending message: ${error}`);
            }
        }

        const formatTime = (timestamp) => {
            const date = new Date(timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        return (
            <div className="private-chats-container">
                {userData ? (
                    <>
                        <div className="left-panel">
                            <div className="user-info">
                                <img 
                                    src={`http://localhost:3000/${userData.photo}`} 
                                    alt="User Avatar" 
                                    className="user-avatar" 
                                />
                                <span className="user-name">{userData.userName}</span>
                            </div>

                            <div className="search-container">
                                <input 
                                    type="text" 
                                    placeholder="Search..." 
                                    className="search-input" 
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>

                            <div className="search-results">
                                {searchResults.length > 0 && (
                                    <div className="search-results-list">
                                        {searchResults.map((user, index) => (
                                            <div key={index} className="search-result-item">
                                                <img 
                                                    src={`http://localhost:3000/${user.photo}`} 
                                                    alt={`${user.userName}'s avatar`} 
                                                    className="search-result-avatar"
                                                />
                                                <span className="search-result-name">{user.name}</span>
                                                <button 
                                                    onClick={() => {
                                                        if (user.chatExists) {
                                                            handleGoToChat(user);
                                                        } else {
                                                            handleStartChat(user.id);
                                                        }
                                                    }}
                                                >
                                                    {user.chatExists ? 'Go to chat' : 'Start a chat'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="chats-section">
                                <h3>Your Chats:</h3>
                                {chats.length > 0 ? (
                                    <div className="chat-list">
                                        {chats.map((chat, index) => {
                                            const otherUser = chat.from.id === myId ? chat.to : chat.from;
                                            return (
                                                <div
                                                    key={index} 
                                                    className="chat-item"
                                                    onClick={() => handleGoToChat(otherUser)}
                                                >
                                                    <img 
                                                        src={`http://localhost:3000/${otherUser.photo}`} 
                                                        alt={`${otherUser.userName}'s avatar`} 
                                                        className="chat-avatar"
                                                    />
                                                    <span className="chat-name">{otherUser.name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p>No chats yet.</p>
                                )}
                            </div>
                        </div>

                        <div className="right-panel">
                            {selectedChatUser ? (
                                <>
                                    <div className="chat-header-full">
                                        <img 
                                            src={`http://localhost:3000/${selectedChatUser.photo}`} 
                                            alt={`${selectedChatUser.name}'s avatar`} 
                                            className="chat-header-full-avatar"
                                        />
                                        <span className="chat-header-full-name">{selectedChatUser.name}</span>
                                    </div>

                                    <div className="chat-messages">
                                        {messages.map((msg, index) => (
                                            <div 
                                                key={index} 
                                                className={`message-item ${msg.fromId === myId ? 'my-message' : 'their-message'}`}
                                            >
                                                <div className="message-text">{msg.text}</div>
                                                <div className="message-time">
                                                    {formatTime(msg.createdAt)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="chat-input">
                                        <input 
                                            type="text" 
                                            placeholder="Type your message..." 
                                            className="message-input"
                                            value={message}
                                            onChange={handleChange}
                                        />
                                        <button className="send-button" onClick={() => sendMessage(selectedChatUser.id)}>
                                            <FontAwesomeIcon icon={faPaperPlane} className="send-icon" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <p>Select a chat or start a new one</p>
                            )}
                        </div>
                    </>
                ) : (
                    <p>Private Chats</p>
                )}
            </div>
        );
    }

    export default PrivateChats;
