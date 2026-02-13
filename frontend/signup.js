const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://user-dashboard-nyp7.onrender.com';

document.getElementById('signupForm').onsubmit = async (e) => 
{
    e.preventDefault();
    
    try 
    {
        const res = await fetch(`${API_URL}/api/signup`, 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify
            ({
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            })
        });
        
        const data = await res.json();
        
        if (res.ok) 
        {
            document.getElementById('success').textContent = 'Account created! Redirecting to login...';
            document.getElementById('error').textContent = '';
            setTimeout(() => 
            {
                window.location.href = '/login';
            }, 2000);
        } 
        
        else 
        {
            document.getElementById('error').textContent = data.msg;
            document.getElementById('success').textContent = '';
        }
    } 
    
    catch (err) 
    {
        document.getElementById('error').textContent = 'Network error: ' + err.message;
    }
};

if (localStorage.getItem('token')) window.location.href = '/';
