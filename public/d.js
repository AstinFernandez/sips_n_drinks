const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const overlay = document.getElementById('overlay');

function toggleMenu(){
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    mainContent.classList.toggle('blurred');
    menuToggle.classList.toggle('active');
}

menuToggle.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && sidebar.classList.contains('active')){
        toggleMenu();
    }
});

document.addEventListener('click', (e) =>{
    if(sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) &&
        !menuToggle.contains(e.target)
    ){
        toggleMenu();
    }
});

function setActiveMenuItem(){
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll('.menu-item');

    menuLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = link.getAttribute('href');
        if(currentPath.includes(linkPath.replace('/',''))){
            link.classList.add('active');
        }
        if(currentPath === '/' && currentPath.includes('dashboard')){
            link.classList.add('active');
        }
    });
}


sidebar.addEventListener('click', (e) =>{
    const menuItem = e.target.closest('.menu-item');
    if(menuItem){
        const linkPath = menuItem.getAttribute('href');
        const currentPath = window.location.pathname;
        
        const isCurrentPage = (linkPath.toLowerCase() === currentPath.toLowerCase());
        if(isCurrentPage){
            e.preventDefault();
            mainContent.classList.remove('blurred');
            setTimeout(() =>{
                if(sidebar.classList.contains('active')){
                    mainContent.classList.add('blurred');
                }
            }, 2000);
        }
    }
});
setActiveMenuItem();

const API_URL = '/api';
let currentUserRole = null;

window.addEventListener('DOMContentLoaded', checkAuth);

async function checkAuth(){
    try{
        const response = await fetch('${API_URL}/check-auth', {
            credentials: 'include'
        });
        if(response.ok){
            const data = await response.json();
            showDashboard(data.user);
        }
    }
    catch(error){
        console.log('Not authenticated.');
    }
}

async function handleLogin(){
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    const loadingDiv = document.getElementById('loginLoading');
    const loginBtn = document.getElementById('loginBtn');

    errorDiv.classList.remove('show');
    errorDiv.textContent = '';

    if(!username || !password){
        errorDiv.textContent = 'Please enter username and password';
        errorDiv.classList.add('show');
        return;
    }

    loginBtn.disabled = true;
    loadingDiv.style.display = 'block';

    try{
        const response = await fetch('${API_URL}/login', {
            method: 'POST',
            headers: {
                'content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({username, password})
        });

        const data = await response.json();
        
        if(response.ok){
            showDashboard(data.user);
        }
        else{
            errorDiv.textContent = data.error || 'Login failed.';
            errorDiv.classList.add('show');
        }
    }
    catch(error){
        errorDiv.textContent = 'Connection error. Make sure the server is running';
        errorDiv.classList.add('show');
    }
    finally{
        loginBtn.disabled = true;
        loadingDiv.style.display = 'none';
    }
}

async function handleLogout(){
    try{
        const response = await fetch('${API_URL}/logout',{
            method: 'POST',
            credentials: 'include',
        });
    }
    catch(error){
        console.error('Logout error: ', error);
    }

    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('dashboardPage').classList.remove('active');
    document.getElementById('loginPage').classList.add('active');

    currentUserRole = null;
}

async function showDashboard(user){
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('dashboardPage').classList.remove('active');

    currentUserRole = user.role;
    document.getElementById('WelcomeMessage').innerHTML = 'Welcome, ${user.username}!';
    if(user.role === 'admin'){
        document.getElementById('welcomeMessage').innerHTML += '<span class = "admin-badge">ADMIN</span>';
        document.getElementById('adminSection').display.style = 'block';
        loadUsers();
    }
    document.getElementById('userEmail').textContent = user.email;

    const createdDate = new Date(user.created_at).toLocaleDateString();
    document.getElementById('accountCreated').textContent = createdDate;

    const lastLoginDate = user.last_login? new Date(user.last_login).toLocaleString(): 'just now';
}