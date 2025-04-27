import { useState } from 'react';
import axios from 'axios';

function Login({ closeLoginForm }) {
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPhone, setLoginPhone] = useState('+998 ');
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

        setLoginPhone(formatted);
    };

    const validateLoginForm = () => {
        const newErrors = {};
        if (!loginUsername.trim()) newErrors.loginUsername = 'Username is required';

        const digits = loginPhone.replace(/\D/g, '');
        if (digits.length !== 12) newErrors.loginPhone = 'Phone must be a valid Uzbek number';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLoginSubmit = async () => {
        if (validateLoginForm()) {
            const loginData = {
                userName: loginUsername,
                phone: loginPhone,
            };
    
            try {
                const response = await axios.post('http://localhost:3000/user/login', loginData, {
                    headers: { 'Content-Type': 'application/json' },
                });
                
                if(response.data.error_message){
                    alert(response.data.error_message)
                    return
                }

                console.log('Login response:', response.data);
                
                closeLoginForm();
                alert(`Login Successful!`);
                window.location.reload();

                localStorage.setItem('user', JSON.stringify(response.data.user));

                const users = localStorage.getItem("user")
                console.log(users);
                
            } catch (error) {
                console.error('Login error:', error.response?.data || error.message);
                alert('Login Failed: ' + (error.response?.data?.message || error.message));
            }
            
        }
    };
    
    return (
        <div className="login-overlay">
            <div className="login-form">
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                />
                {errors.loginUsername && <p className="error">{errors.loginUsername}</p>}

                <input
                    type="text"
                    value={loginPhone}
                    onChange={handlePhoneChange}
                    placeholder="Phone"
                />
                {errors.loginPhone && <p className="error">{errors.loginPhone}</p>}

                <div className="login-buttons">
                    <button className="submit-btn" onClick={handleLoginSubmit}>Login</button>
                    <button className="cancel-btn" onClick={closeLoginForm}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default Login;