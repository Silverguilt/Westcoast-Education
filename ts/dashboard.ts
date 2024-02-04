// Funktion för att hämta alla kurser från API:et
export async function fetchUserInfo() {
  try {
    const userJSON = localStorage.getItem('currentUser');
    const user = userJSON ? JSON.parse(userJSON) : null;

    if (!user) {
      console.error('User not found. Please log in.');
      return;
    }

    // Uppdatera användarinformationen i DOM:en
    document.getElementById(
      'userName'
    ).textContent = `${user.firstName} ${user.lastName} (${user.role})`;
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
    } else {
      userCoursesElement.textContent = 'Inga kurser anmälda';
    }
  } catch (error) {
    console.error('Error fetching user information:', error);
  }
}

// Initialisera dashboarden när DOM:en är helt laddad
document.addEventListener('DOMContentLoaded', () => {
  fetchUserInfo();
});
