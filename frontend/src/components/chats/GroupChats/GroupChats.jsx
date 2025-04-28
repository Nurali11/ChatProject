    import { useEffect, useState } from 'react';
    import axios from 'axios';
    import './GroupChats.css';
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { faImage, faPaperPlane} from '@fortawesome/free-solid-svg-icons';
    
    function GroupChats() {
        const [userData, setUserData] = useState(null);
        const [myId, setMyId] = useState(null);
        const [groups, setGroups] = useState([]);
        const [filteredGroups, setFilteredGroups] = useState([]);
        const [selectedGroup, setSelectedGroup] = useState(null);
        const [messages, setMessages] = useState([]);
        const [searchQuery, setSearchQuery] = useState('');
        const [errors, setErrors] = useState({});

        const [isModalOpen, setIsModalOpen] = useState(false);
        const [createGroupData, setCreateGroupData] = useState({
            groupName: '',
            name: '',
            photo: null,
            photoPreview: null
        });
        

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
                fetchGroups();
            }
        }, [myId]);

        const fetchGroups = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/group?myId=${myId}`);
                setGroups(response.data);
                alert(JSON.stringify(response.data))
                setFilteredGroups(response.data);
            } catch (error) {
                alert(`Error fetching groups: ${error}`);
            }
        };

        const fetchMessages = async (groupId) => {
            try {
                const response = await axios.get(`http://localhost:3000/groups/message?groupId=${groupId}`);
                setMessages(response.data);
            } catch (error) {
                alert(`Error fetching group messages: ${error}`);
            }
        };

        
        const handleSearchChange = (event) => {
            const query = event.target.value;
            setSearchQuery(query);
            
            if (!query.trim()) {
                setFilteredGroups(groups);
                return;
            }

            const filtered = groups.filter(group =>
                group.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredGroups(filtered);
        };

        const openCreateGroupModal = () => {
            setIsModalOpen(true);
            setCreateGroupData({
                groupName: 't.me/',
                name: '',
                photo: null,
                photoPreview: null
            });
        };
        

        const closeCreateGroupModal = () => {
            setIsModalOpen(false);
            setCreateGroupData({
                groupName: '',
                name: '',
                photo: null
            });
        };

        
        const handleGroupLinkChange = (e) => {
            let value = e.target.value;
        
            // Если пользователь начал удалять "t.me/", вернем обратно
            if (!value.startsWith('t.me/')) {
                value = 't.me/';
            }
        
            // Обрезаем лишнее до разумной длины
            value = value.slice(0, 30);
        
            setCreateGroupData({ 
                ...createGroupData, 
                groupName: value 
            });
        };
        
        

        const handleCreateGroupSubmit = async () => {
            const newErrors = {};
        
            if (!createGroupData.groupName || createGroupData.groupName === 't.me/') {
                newErrors.groupName = 'Group link is required';
            }
        
            if (!createGroupData.name) {
                newErrors.name = 'Group name is required';
            }
        
            if (!createGroupData.photo) {
                newErrors.photo = 'Group photo is required';
            }
        
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
        
            
            setErrors({});
            
            const myId = JSON.parse(localStorage.getItem('user')).id
            if(!myId){
                return 
            }

            const formData = new FormData();
            formData.append('groupName', createGroupData.groupName);
            formData.append('name', createGroupData.name);
            formData.append('photo', createGroupData.photo);
            formData.append('userId', myId)
        
            try {
                const respone = await axios.post('http://localhost:3000/group', formData);
                alert('Group created successfully!');
                closeCreateGroupModal();
                fetchGroups();
            } catch (error) {
                alert(`Error creating group: ${error}`);
            }
        };
        

        return (
            <div className="group-chats-container">
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

                            <div className="group-search">
                                <input
                                    type="text"
                                    placeholder="Search groups..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="group-search-input"
                                />
                            </div>

                            <div className="create-group-btn">
                                <button onClick={openCreateGroupModal} className="create-group-button">
                                    Create Group
                                </button>
                            </div>

                            <div className="group-list">
                                <h3>Your Groups:</h3>
                                {filteredGroups.length > 0 ? (
                                    <div className="group-list-items">
                                        {filteredGroups.map((group, index) => (
                                            <div
                                                key={index}
                                                className="group-item"
                                                onClick={() => {
                                                    setSelectedGroup(group);
                                                    fetchMessages(group.id);
                                                }}
                                            >
                                                <img 
                                                    src={`http://localhost:3000/${group.photo}`} 
                                                    alt={`${group.name} avatar`} 
                                                    className="group-avatar"
                                                />
                                                <span className="group-name">{group.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No groups found.</p>
                                )}
                            </div>
                        </div>

                        <div className="right-panel">
                            {selectedGroup ? (
                                <>
                                    <div className="group-header">
                                        <img 
                                            src={`http://localhost:3000/${selectedGroup.photo}`} 
                                            alt={`${selectedGroup.name}'s avatar`} 
                                            className="group-header-avatar"
                                        />
                                        <span className="group-header-name">{selectedGroup.name}</span>
                                    </div>

                                    <div className="group-messages">
                                        {messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`message-item ${msg.fromId === myId ? 'my-message' : 'their-message'}`}
                                            >
                                                <div className="message-text">{msg.text}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="group-input">
                                        <input 
                                            type="text" 
                                            placeholder="Type your message..." 
                                            className="message-input"
                                        />
                                        <button className="send-button">
                                            <FontAwesomeIcon icon={faPaperPlane} className="send-icon" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <p>Select a group to start chatting</p>
                            )}
                        </div>

                       {/* Модалка создания группы */}
                       {isModalOpen && (
    <div className="modal-overlay">
        <div className="modal-content">
            <h2>Create Group</h2>

            <div className="group-link-input">
    <input
        type="text"
        placeholder="t.me/yourGroupName"
        value={createGroupData.groupName}
        onChange={handleGroupLinkChange}
        className="modal-input"
    />
    {errors.groupName && <div className="error-text">{errors.groupName}</div>}
</div>

<div>
    <input
        type="text"
        placeholder="Group Name"
        value={createGroupData.name}
        onChange={(e) => setCreateGroupData({ ...createGroupData, name: e.target.value })}
        className="modal-input"
    />
    {errors.name && <div className="error-text">{errors.name}</div>}
</div>

<div className="photo-upload">
    <label htmlFor="group-photo-upload" className="photo-label">
        <FontAwesomeIcon icon={faImage} /> Upload Group Photo
    </label>
    <input
        id="group-photo-upload"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                setCreateGroupData({
                    ...createGroupData,
                    photo: file,
                    photoPreview: URL.createObjectURL(file),
                });
            } else {
                setCreateGroupData({
                    ...createGroupData,
                    photo: null,
                    photoPreview: null,
                });
                alert('Please upload a valid image file');
            }
        }}
    />
    {errors.photo && <div className="error-text">{errors.photo}</div>}
</div>

            {createGroupData.photoPreview && (
                <img src={createGroupData.photoPreview} alt="Group Preview" className="photo-preview" />
            )}

            <div className="modal-buttons">
                <button className="modal-create-button" onClick={handleCreateGroupSubmit}>Create</button>
                <button className="modal-cancel-button" onClick={closeCreateGroupModal}>Cancel</button>
            </div>
        </div>
    </div>
)}


                    </>
                ) : (
                    <p>Loading user data...</p>
                )}
            </div>
        );
    }

    export default GroupChats;
