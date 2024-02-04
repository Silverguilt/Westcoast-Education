var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Funktion för att hämta alla kurser från API:et
function fetchUserInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userJSON = localStorage.getItem('currentUser');
            const user = userJSON ? JSON.parse(userJSON) : null;
            if (!user) {
                console.error('User not found. Please log in.');
                return;
            }
            // Uppdatera användarinformationen i DOM:en
            document.getElementById('userName').textContent = `${user.firstName} ${user.lastName} (${user.role})`;
            document.getElementById('userEmail').textContent = user.email;
            document.getElementById('userPhone').textContent = user.phone;
            document.getElementById('userAddress').textContent = `${user.address}`;
            document.getElementById('userCity').textContent = user.city;
            document.getElementById('userZip').textContent = user.postalCode;
            // Visa användarens kurser
            const userCoursesElement = document.getElementById('userCourses');
            if (user.enrolledCourses && user.enrolledCourses.length > 0) {
                const ul = document.createElement('ul');
                user.enrolledCourses.forEach((course) => {
                    const li = document.createElement('li');
                    li.textContent = course;
                    ul.appendChild(li);
                });
                userCoursesElement.appendChild(ul);
            }
            else {
                userCoursesElement.textContent = 'Inga kurser anmälda';
            }
        }
        catch (error) {
            console.error('Error fetching user information:', error);
        }
    });
}
// Initialisera dashboarden när DOM:en är helt laddad
document.addEventListener('DOMContentLoaded', () => {
    fetchUserInfo();
});
