const token = localStorage.getItem('token');
if (!token) window.location.href = '/login';

// Axios interceptor
axios.interceptors.request.use(config => {
    config.headers['x-auth-token'] = token;
    return config;
});

let allUsers = []; // Store all users for search

// Load users
async function loadUsers() {
    const res = await axios.get('http://localhost:5000/api/users');
    allUsers = res.data;
    displayUsers(allUsers);
}

// Display users
function displayUsers(users) {
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

// Search users
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredUsers = allUsers.filter(user => 
        user.name?.toLowerCase().includes(searchTerm) || 
        user.email?.toLowerCase().includes(searchTerm)
    );
    displayUsers(filteredUsers);
});

// Add user
document.getElementById('addUserForm').onsubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/users', {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    });
    e.target.reset();
    loadUsers();
};

// Delete user
window.deleteUser = async (id) => {
    if (confirm('Delete user?')) {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        loadUsers();
    }
};

// Edit user
window.editUser = async (id) => {
    const name = prompt('Enter new name:');
    const email = prompt('Enter new email:');
    if (name && email) {
        await axios.put(`http://localhost:5000/api/users/${id}`, { name, email });
        loadUsers();
    }
};

// Logout
document.getElementById('logoutBtn').onclick = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
};

loadUsers();