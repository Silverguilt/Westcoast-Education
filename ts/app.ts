import {
  getCurrentUser,
  registerUser,
  loginUser,
  logoutUser,
  enrollCourse,
} from './auth.js';

const user = getCurrentUser();
const logoutButton = document.getElementById('logoutButton');

// Kolla om logout-knappen finns i DOM:en
if (logoutButton) {
  //Visa eller dölj logga ut-knappen beroende på om det finns en inloggad användare
  if (user && user.role === 'student') {
    logoutButton.style.display = 'block';
  } else {
    logoutButton.style.display = 'none';
  }
}

if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    // Kalla på logoutUser-funktionen för att ta bort den inloggade användaren från local storage
    logoutUser();
    // Redirect:a till login-sidan efter utloggning
    window.location.href = 'login.html';
  });
}

function initDashboard() {
  // Lägg till eventlyssnare för logga ut-knappen när DOM:en är helt laddad
  document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById('logoutButton');

    if (document.getElementById('registerButton')) {
      document
        .getElementById('registerButton')
        .addEventListener('click', registerUser);
    }

    if (document.getElementById('loginButton')) {
      document
        .getElementById('loginButton')
        .addEventListener('click', loginUser);
    }
  });
}

// Funktion för att kolla användarens roll och uppdatera navigeringen
function updateNavigation() {
  const userJSON = localStorage.getItem('currentUser');
  const user = userJSON ? JSON.parse(userJSON) : null;

  if (user && user.role === 'student') {
    // Om användaren är student, skapa "Mina sidor"-länk
    const myPagesLink = document.getElementById('myPagesLink');
    const link = document.createElement('a');
    link.href = 'dashboard.html';
    link.textContent = 'Mina sidor';
    myPagesLink.appendChild(link);
  }
}

// Initialisera navigeringen när DOM:en är helt laddad
document.addEventListener('DOMContentLoaded', () => {
  updateNavigation();
});

// Initialisera dashboarden när DOM:en är helt laddad
initDashboard();
