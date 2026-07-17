// Navigation Authentication Helper

// Update navigation based on auth status
function updateAuthNav() {
    const isLoggedIn = Auth.isLoggedIn();
    const authLinks = document.querySelectorAll('#authLink');
    
    authLinks.forEach(link => {
        if (isLoggedIn) {
            link.textContent = 'Logout';
            link.href = '#';
            link.onclick = (e) => {
                e.preventDefault();
                Auth.logout();
                Utils.showAlert('Logged out successfully!', 'success');
                window.location.href = 'index.html';
            };
        } else {
            link.textContent = 'Login';
            link.href = 'login.html';
            link.onclick = null;
        }
    });

    // Add user name if logged in
    if (isLoggedIn) {
        const currentUser = Auth.getCurrentUser();
        if (currentUser) {
            authLinks.forEach(link => {
                const nav = link.closest('nav');
                if (nav) {
                    const userInfo = nav.querySelector('#userInfo');
                    if (!userInfo && currentUser.name) {
                        const userDiv = document.createElement('div');
                        userDiv.id = 'userInfo';
                        userDiv.style.display = 'flex';
                        userDiv.style.alignItems = 'center';
                        userDiv.style.gap = '1rem';
                        userDiv.style.marginRight = '1rem';
                        userDiv.innerHTML = `
                            <span style="color: var(--green-primary); font-weight: 500;">👤 ${currentUser.name}</span>
                        `;
                        const navList = nav.querySelector('ul');
                        if (navList) {
                            navList.parentNode.insertBefore(userDiv, navList);
                        }
                    }
                }
            });
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Auth to be available
    if (typeof Auth !== 'undefined') {
        updateAuthNav();
    } else {
        // Retry after a short delay
        setTimeout(() => {
            if (typeof Auth !== 'undefined') {
                updateAuthNav();
            }
        }, 100);
    }
});


