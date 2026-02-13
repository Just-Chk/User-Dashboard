const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://user-dashboard-nyp7.onrender.com';

document.getElementById('loginForm').onsubmit = async (e) => 
{
    e.preventDefault();
    
    try {
        const res = await fetch(`${API_URL}/api/login`, 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify
            ({
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            })
        });
        
        const data = await res.json();
        
        if (res.ok) 
        {
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        } 
        
        else 
        {
            document.getElementById('error').textContent = data.msg;
        }
    } 
    
    catch (err) 
    {
        document.getElementById('error').textContent = 'Network error: ' + err.message;
    }
};

if (localStorage.getItem('token')) window.location.href = '/';
