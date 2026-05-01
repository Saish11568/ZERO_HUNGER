// Mock Authentication System

const AUTH_KEY = 'zh_user';

function login(role, name) {
    const user = { role, name, token: 'mock_token_' + Date.now() };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    
    // Redirect based on role
    if (role === 'NGO') {
        window.location.href = 'NGO_Dashboard.html';
    } else if (role === 'Donor') {
        window.location.href = 'Donor_Dashboard.html';
    } else if (role === 'Supermarket') {
        window.location.href = 'Donor_Dashboard.html'; // Assuming donor dashboard for supermarkets
    } else if (role === 'Volunteer') {
        window.location.href = 'Volunteer_Fleet.html'; // Volunteer goes to Fleet/Dashboard
    } else {
        window.location.href = 'index.html';
    }
}

function logout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = 'index.html';
}

function getUser() {
    const user = localStorage.getItem(AUTH_KEY);
    return user ? JSON.parse(user) : null;
}

function checkAuth(requireRole = null) {
    const user = getUser();
    if (!user) {
        // Only redirect if we're not already on a login/registration page
        const path = window.location.pathname;
        const isPublicPage = path === '/' || path === '' || path.endsWith('index.html') || path.includes('Login.html') || path.includes('Registration.html');
        
        if (!isPublicPage) {
            window.location.href = 'Login.html';
        }
        return;
    }
    if (requireRole && user.role !== requireRole) {
        // Mock unauthorized access
        alert('Unauthorized access. Redirecting...');
        window.location.href = 'index.html';
    }
}

window.auth = { login, logout, getUser, checkAuth };
