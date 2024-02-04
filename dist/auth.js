var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Funktion för att hämta den aktuella inloggade användaren från localStorage
export function getCurrentUser() {
    const userJSON = localStorage.getItem('currentUser');
    const user = userJSON ? JSON.parse(userJSON) : null;
    // Kolla om användaren finns och har en roll
    if (user && user.role) {
        return user;
    }
    else {
        return null;
    }
}
export function registerUser() {
    // Hämta användarinformation från formuläret
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const address = document.getElementById('address').value;
    const postalCode = document.getElementById('postalCode').value;
    const city = document.getElementById('city').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // Kontrollera om något fält är tomt
    if (!firstName ||
        !lastName ||
        !address ||
        !postalCode ||
        !city ||
        !phone ||
        !email ||
        !username ||
        !password) {
        alert('Var vänlig och fyll i alla fält.');
        return;
    }
    // Lägg till användaren i db.json
    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: Math.floor(Math.random() * 1000), // Ett temporärt sätt att generera unika ID:n
            firstName,
            lastName,
            address,
            postalCode,
            city,
            phone,
            email,
            username,
            password,
            role: 'student', // Alla nya användare som registrerar sig får rollen "student"
            enrolledCourses: [],
        }),
    })
        .then((response) => response.json())
        .then((data) => {
        alert('Registreringen lyckades! Du kan nu logga in.');
        // Redirecta användaren till inloggningssidan
        window.location.href = 'login.html';
    })
        .catch((error) => {
        console.error('Error:', error);
        alert('Registreringen misslyckades. Vänligen försök igen.');
    });
}
export function loginUser() {
    // Hämta användarinformation från formuläret
    const loginUsername = document.getElementById('loginUsername').value;
    const loginPassword = document.getElementById('loginPassword').value;
    //Hämta användare från db.json
    fetch('http://localhost:3000/users')
        .then((response) => response.json())
        .then((users) => {
        console.log('Users from db.json:', users);
        // Hitta användaren med matchande användarnamn och lösenord
        const user = users.find((u) => u.username === loginUsername && u.password === loginPassword);
        if (user) {
            console.log('User found:', user);
            // Spara användaren i localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            // Redirecta användaren beroende på roll
            if (user.role === 'teacher') {
                console.log('Redirecting to teacher-dashboard.html');
                window.location.href = 'teacher-dashboard.html';
            }
            else {
                console.log('Redirecting to dashboard.html');
                window.location.href = 'dashboard.html';
            }
        }
        else {
            console.log('User not found');
            alert('Incorrect username or password. Please try again.');
        }
    })
        .catch((error) => {
        console.error('Error fetching users:', error);
        alert('Login failed. Please try again.');
    });
}
export function updateUserOnServer(userId, userData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://localhost:3000/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                throw new Error('Failed to update user on the server.');
            }
        }
        catch (error) {
            console.error('Error updating user on the server:', error);
            throw new Error('Failed to update user on the server.');
        }
    });
}
export function logoutUser() {
    localStorage.removeItem('currentUser');
}
export function enrollCourse(userId, courseId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://localhost:3000/users/${userId}`);
            const userData = yield response.json();
            // Kolla om användaren redan är anmäld till kursen
            if (!userData.enrolledCourses.includes(courseId)) {
                // Uppdatera användarens enrolledCourses-array
                userData.enrolledCourses.push(courseId);
                // Updatera användaren på servern
                yield updateUserOnServer(userId, userData);
                // Skicka tillbaka ett meddelande om att anmälan lyckades
                return `Enrolled in Course ${courseId} successfully!`;
            }
            else {
                // Skicka tillbaka ett meddelande om att användaren redan är anmäld
                return `You are already enrolled in Course ${courseId}.`;
            }
        }
        catch (error) {
            console.error('Error enrolling in course:', error);
            throw new Error('Failed to enroll in the course.');
        }
    });
}
