import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

function Register({ closeRegisterForm }) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('+998 ');
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [errors, setErrors] = useState({});

    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (!value.startsWith('998')) value = '998' + value;
        value = value.slice(0, 12);

        let formatted = '+998';
        if (value.length > 3) formatted += ' ' + value.slice(3, 5);
        if (value.length > 5) formatted += ' ' + value.slice(5, 8);
        if (value.length > 8) formatted += ' ' + value.slice(8, 10);
        if (value.length > 10) formatted += ' ' + value.slice(10, 12);

        setPhoneNumber(formatted);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        } else {
            setPhoto(null);
            setPhotoPreview(null);
            setErrors((prev) => ({ ...prev, photo: 'Please upload a valid image file' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) newErrors.name = 'Name is required';
        if (!username.trim()) newErrors.username = 'Username is required';
        else if (username.trim().length < 4) newErrors.username = 'Username must be at least 4 characters';

        const digits = phoneNumber.replace(/\D/g, '');
        if (digits.length !== 12) newErrors.phone = 'Phone must be a valid Uzbek number';

        if (!photo) newErrors.photo = 'Profile photo is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('userName', username);
            formData.append('phone', phoneNumber);
    
            // Фото
            if (photo) {
                formData.append('photo', photo);
            }
    
            try {
                const response = await axios.post('http://localhost:3000/user/register', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
    
                if (response.status >= 200 && response.status < 300) {
                    closeRegisterForm();
                    alert('Registration Successful!');
                } else {
                    alert('Registration Failed!');
                }
            } catch (error) {
                console.error('Error during registration:', error);
                alert(`Error during registration: ${error.response?.data?.message || error.message}`);
            }
        }
    };
    
    return (
        <div className="register-overlay">
            <div className="register-form">
                <h2>Register</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <p className="error">{errors.name}</p>}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <p className="error">{errors.username}</p>}

                <input
                    type="text"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="Phone"
                />
                {errors.phone && <p className="error">{errors.phone}</p>}

                <div className="photo-upload">
                    <label htmlFor="photo-upload" className="photo-label">
                        <FontAwesomeIcon icon={faImage} /> Upload Photo
                    </label>
                    <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        style={{ display: 'none' }}
                    />
                </div>
                {photoPreview && <img src={photoPreview} alt="Preview" className="photo-preview" />}
                {errors.photo && <p className="error">{errors.photo}</p>}

                <div className="register-buttons">
                    <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                    <button className="cancel-btn" onClick={closeRegisterForm}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default Register;
