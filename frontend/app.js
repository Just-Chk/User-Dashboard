const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://user-dashboard-nyp7.onrender.com';

// Check token and redirect before anything else
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'login.html';
} else {
    // Hide loading and show container
    document.querySelector('.loading').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
}

// Axios interceptor
axios.interceptors.request.use(config => {
    config.headers['x-auth-token'] = token;
    return config;
});

let allUsers = [];

async function loadUsers() {
    try {
        const res = await axios.get(`${API_URL}/api/users`);
        allUsers = res.data;
        displayUsers(allUsers);
    } catch (err) {
        console.error('Error loading users:', err);
        if (err.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    }
}

function displayUsers(users) 
{
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name || ''}</td>
            <td>${user.email || ''}</td>
            <td>
                <button onclick="editUser('${user._id}')" class="btn-edit">Edit</button>
                <button onclick="deleteUser('${user._id}')" class="btn-delete">Delete</button>
            </td>
        </tr>
    `).join('');
}

document.getElementById('searchInput')?.addEventListener('input', (e) => 
{
    const searchTerm = e.target.value.toLowerCase();
    const filteredUsers = allUsers.filter(user => 
        user.name?.toLowerCase().includes(searchTerm) || 
        user.email?.toLowerCase().includes(searchTerm)
    );
    displayUsers(filteredUsers);
});

document.getElementById('addUserForm').onsubmit = async (e) => 
{
    e.preventDefault();
    try {
        await axios.post(`${API_URL}/api/users`, 
        {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        });
        e.target.reset();
        loadUsers();
    } 
    
    catch (err) 
    {
        alert('Error adding user: ' + (err.response?.data?.msg || err.message));
    }
};

window.deleteUser = async (id) => 
{
    if (confirm('Delete user?')) 
    {
        try 
        {
            await axios.delete(`${API_URL}/api/users/${id}`);
            loadUsers();
        } 
        
        catch (err) 
        {
            alert('Error deleting user: ' + (err.response?.data?.msg || err.message));
        }
    }
};

window.editUser = async (id) => 
{
    const name = prompt('Enter new name:');
    const email = prompt('Enter new email:');
    if (name && email) 
    {
        try 
        {
            await axios.put(`${API_URL}/api/users/${id}`, { name, email });
            loadUsers();
        } 
        
        catch (err) 
        {
            alert('Error updating user: ' + (err.response?.data?.msg || err.message));
        }
    }
};

document.getElementById('logoutBtn').onclick = () => 
{
    localStorage.removeItem('token');
    window.location.href = '/login';
};

loadUsers();

