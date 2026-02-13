const API_URL = 'https://user-dashboard-nyp7.onrender.com';

document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const res = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        } else {
            document.getElementById('error').textContent = data.msg;
        }
    } catch (err) {
        document.getElementById('error').textContent = 'Connection error. Please try again.';
        console.error('Login error:', err);
    }
};

// Redirect if already logged in
if (localStorage.getItem('token')) {
    window.location.href = 'index.html';
}
