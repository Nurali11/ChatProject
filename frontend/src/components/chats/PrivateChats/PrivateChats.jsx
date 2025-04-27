import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './PrivateChats.css'; // подключим отдельный css для чистоты
import axios from 'axios';

function PrivateChats() {
    const [userData, setUserData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]); // Для хранения результатов поиска

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUserData(JSON.parse(user));
        }
    }, []);

    const handleSearchClick = async () => {
        if (!searchQuery.trim()) {
            return;
        }

        try {
            // Отправляем поисковый запрос как часть URL
            const response = await axios.get(`http://localhost:3000/user?userName=${encodeURIComponent(searchQuery)}`);
            console.log('Search results:', response.data);
            setSearchResults(response.data); // Сохраняем полученные результаты в состояние
        } catch (error) {
            console.error('Search error:', error);
            alert(`An error occurred while searching. ${error}`);
        }
    };

    return (
        <div className="private-chats-container">
            {userData ? (
                <>
                    <div className="left-panel">
                        <div className="user-info">
                            <img 
                                src={`http://localhost:3000/${userData.photo}`} // Собираем путь к фото
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
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="search-button" onClick={handleSearchClick}>
                                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                            </button>
                        </div>
                        {/* Здесь будем отображать результаты поиска */}
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
                                            <span className="search-result-name">{user.userName}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="right-panel">
                        <p>Select a chat or start a new one</p>
                    </div>
                </>
            ) : (
                <p>Private Chats</p>
            )}
        </div>
    );
}

export default PrivateChats;
