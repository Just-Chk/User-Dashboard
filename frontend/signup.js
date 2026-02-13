document.getElementById('signupForm').onsubmit = async (e) => {
    e.preventDefault();
    
    const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        })
    });
    
    const data = await res.json();
    
    if (res.ok) {
        document.getElementById('success').textContent = 'Account created! Redirecting to login...';
        document.getElementById('error').textContent = '';
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
    } else {
        document.getElementById('error').textContent = data.msg;
        document.getElementById('success').textContent = '';
    }
};

if (localStorage.getItem('token')) window.location.href = '/';