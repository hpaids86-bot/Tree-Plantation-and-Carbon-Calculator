// Authentication System - EcoTree Impact Analyzer

// User Management
const Auth = {
    // Get current user
    getCurrentUser() {
        return Storage.get('ecotree_current_user', null);
    },

    // Set current user
    setCurrentUser(user) {
        Storage.set('ecotree_current_user', user);
        Storage.set('ecotree_is_logged_in', true);
        Storage.set('ecotree_login_time', Date.now());
        return true;
    },

    // Check if user is logged in
    isLoggedIn() {
        const isLoggedIn = Storage.get('ecotree_is_logged_in', false);
        const loginTime = Storage.get('ecotree_login_time', 0);
        const sessionTimeout = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        // Check session timeout
        if (isLoggedIn && (Date.now() - loginTime) > sessionTimeout) {
            this.logout();
            return false;
        }
        
        return isLoggedIn;
    },

    // Logout
    logout() {
        Storage.remove('ecotree_current_user');
        Storage.remove('ecotree_is_logged_in');
        Storage.remove('ecotree_login_time');
        return true;
    },

    // Register new user
    register(userData) {
        const { name, email, password } = userData;
        
        // Validate input
        if (!name || !email || !password) {
            return { success: false, message: 'Please fill in all fields' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters' };
        }

        // Get existing users
        const users = Storage.get('ecotree_users', []);
        
        // Check if user already exists
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: this.hashPassword(password), // Simple hash (in production, use proper hashing)
            createdAt: new Date().toISOString(),
            progress: {
                totalTrees: 0,
                totalCO2: 0,
                speciesCount: {}
            }
        };

        // Save user
        users.push(newUser);
        Storage.set('ecotree_users', users);

        // Auto login
        this.setCurrentUser({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        });

        return { success: true, message: 'Account created successfully!', user: newUser };
    },

    // Login user
    login(email, password) {
        // Validate input
        if (!email || !password) {
            return { success: false, message: 'Please enter email and password' };
        }

        // Get users
        const users = Storage.get('ecotree_users', []);
        
        // Find user
        const user = users.find(u => u.email === email);
        
        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Check password (simple comparison for demo - use proper hashing in production)
        const hashedPassword = this.hashPassword(password);
        if (user.password !== hashedPassword) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Set current user
        this.setCurrentUser({
            id: user.id,
            name: user.name,
            email: user.email
        });

        return { success: true, message: 'Login successful!', user: user };
    },

    // Simple password hash (for demo - use bcrypt in production)
    hashPassword(password) {
        // Simple hash function for demo purposes
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    },

    // Get user profile
    getProfile() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return null;

        const users = Storage.get('ecotree_users', []);
        return users.find(u => u.id === currentUser.id) || null;
    },

    // Update user profile
    updateProfile(updates) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return { success: false, message: 'Not logged in' };
        }

        const users = Storage.get('ecotree_users', []);
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex === -1) {
            return { success: false, message: 'User not found' };
        }

        // Update user
        users[userIndex] = { ...users[userIndex], ...updates };
        Storage.set('ecotree_users', users);

        // Update current user
        this.setCurrentUser({
            ...currentUser,
            ...updates
        });

        return { success: true, message: 'Profile updated successfully' };
    },

    // Reset password (demo - would send email in production)
    resetPassword(email) {
        const users = Storage.get('ecotree_users', []);
        const user = users.find(u => u.email === email);
        
        if (!user) {
            // Don't reveal if user exists for security
            return { success: true, message: 'If email exists, reset link will be sent' };
        }

        // In production, send email with reset token
        // For demo, just return success
        return { success: true, message: 'Password reset link sent to your email' };
    }
};

// Login Handler
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    const result = Auth.login(email, password);
    
    if (result.success) {
        Utils.showAlert(result.message, 'success');
        // Redirect to dashboard or home
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        Utils.showAlert(result.message, 'error');
    }
}

// Signup Handler
function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    // Validate passwords match
    if (password !== confirmPassword) {
        Utils.showAlert('Passwords do not match', 'error');
        return;
    }

    const result = Auth.register({ name, email, password });
    
    if (result.success) {
        Utils.showAlert(result.message, 'success');
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        Utils.showAlert(result.message, 'error');
    }
}

// Forgot Password Handler
function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('resetEmail').value;
    const result = Auth.resetPassword(email);
    
    Utils.showAlert(result.message, 'info');
    
    // Show login after 2 seconds
    setTimeout(() => {
        showLogin();
    }, 2000);
}

// Toggle between login and signup
function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'none';
}

function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('forgotPasswordForm').style.display = 'none';
}

function showForgotPassword() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'block';
}

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    if (Auth.isLoggedIn() && window.location.pathname.includes('login.html')) {
        // Already logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
});

// Random tree quote selector
const treeQuotes = [
    {
        text: "The best time to plant a tree was 20 years ago. The second best time is now.",
        author: "Chinese Proverb"
    },
    {
        text: "A society grows great when old men plant trees whose shade they know they shall never sit in.",
        author: "Greek Proverb"
    },
    {
        text: "He who plants a tree plants hope.",
        author: "Lucy Larcom"
    },
    {
        text: "Trees are poems that the earth writes upon the sky.",
        author: "Kahlil Gibran"
    },
    {
        text: "Plant trees, they will plant hope.",
        author: "Lucy Larcom"
    },
    {
        text: "The creation of a thousand forests is in one acorn.",
        author: "Ralph Waldo Emerson"
    },
    {
        text: "In the end, we will conserve only what we love. We will love only what we understand. We will understand only what we are taught.",
        author: "Baba Dioum"
    },
    {
        text: "What we are doing to the forests of the world is but a mirror reflection of what we are doing to ourselves and to one another.",
        author: "Mahatma Gandhi"
    }
];

// Update quote on page load
document.addEventListener('DOMContentLoaded', () => {
    const randomQuote = treeQuotes[Math.floor(Math.random() * treeQuotes.length)];
    const quoteText = document.querySelector('.quote-text');
    const quoteAuthor = document.querySelector('.quote-author');
    
    if (quoteText && quoteAuthor) {
        quoteText.textContent = `"${randomQuote.text}"`;
        quoteAuthor.textContent = `— ${randomQuote.author}`;
    }
});


