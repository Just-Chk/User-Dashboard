document.getElementById('loginForm').onsubmit = async (e) => 
{
    e.preventDefault();
    
    const res = await fetch('http://localhost:5000/api/login', 
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
};

if (localStorage.getItem('token')) window.location.href = '/';