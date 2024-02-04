var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { logoutUser } from './auth.js';
function addNewCourse() {
    const courseName = document.getElementById('courseName').value;
    const courseNumber = document.getElementById('courseNumber').value;
    const description = document.getElementById('description').value;
    const startDate = document.getElementById('startDate').value;
    const courseLength = document.getElementById('courseLength').value;
    const classroom = document.getElementById('classroom').checked;
    const distance = document.getElementById('distance').checked;
    const teacher = document.getElementById('teacher').value;
    const coursePrice = document.getElementById('coursePrice').value;
    // Skapa ett nytt objekt med kursinformationen
    const newCourse = {
        id: Math.floor(Math.random() * 1000), // Temporary way to generate a unique ID
        courseName,
        courseNumber,
        description,
        startDate,
        courseLength,
        classroom,
        distance,
        teacher,
    };
    // Skicka ett POST-anrop till API:et för att lägga till kursen
    fetch('http://localhost:3000/courses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourse),
    })
        .then((response) => response.json())
        .then((data) => {
        // Visa den tillagda kursen i addCourseSection
        const addCourseSection = document.getElementById('addCourseSection');
        const addedCourseInfo = document.createElement('p');
        addedCourseInfo.textContent = `Added Course: ${data.courseName} (ID: ${data.id})`;
        addCourseSection.appendChild(addedCourseInfo);
    })
        .catch((error) => {
        console.error('Error adding course:', error);
        alert('Failed to add the course. Please try again.');
    });
}
// Eventlyssnare för "Lägg till kurs"-knappen
document
    .getElementById('addCourseButton')
    .addEventListener('click', addNewCourse);
// Funktion för att hämta kurser från db.json
function fetchCourses() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('http://localhost:3000/courses');
            const courses = yield response.json();
            return courses;
        }
        catch (error) {
            console.error('Error fetching courses:', error);
            return [];
        }
    });
}
// Funktion för att hämta användare från db.json
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('http://localhost:3000/users');
            const users = yield response.json();
            return users;
        }
        catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    });
}
// Funktion för att initiera lärarens dashboard
function initTeacherDashboard() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Hämta kurser och användare från API:et
            const courses = yield fetchCourses();
            const users = yield fetchUsers();
            // Hämta sektionen för anmälda studenter
            const enrolledStudentsSection = document.getElementById('enrolledStudentsSection');
            // Skapa en oordnad lista för kurser
            const coursesList = document.createElement('ul');
            // Iterera över kurserna
            courses.forEach((course) => {
                // Skapa listitem för kursen
                const courseListItem = document.createElement('li');
                courseListItem.textContent = `Kurs: ${course.courseName}`;
                // Skapa en fetstilt text för studenterna
                const studentsList = document.createElement('b');
                // Filtrera ut de användare som är anmälda till kursen
                const enrolledUsers = users.filter((user) => user.enrolledCourses &&
                    user.enrolledCourses.includes(course.courseName));
                // Iterera över de anmälda studenterna
                enrolledUsers.forEach((user) => {
                    // Skapa ett listitem för studenten
                    const userListItem = document.createElement('ul');
                    userListItem.textContent = `Student: ${user.firstName} ${user.lastName}`;
                    // Appenda listitem för studenten till listan med studenter
                    studentsList.appendChild(userListItem);
                });
                // Appenda listan med studenter till kurslistitemet
                courseListItem.appendChild(studentsList);
                // Appenda kurslistitemet till listan med kurser
                coursesList.appendChild(courseListItem);
            });
            // Appenda listan med kurser till sektionen för anmälda studenter
            enrolledStudentsSection.appendChild(coursesList);
        }
        catch (error) {
            console.error('Error initializing teacher dashboard:', error);
        }
    });
}
// Initialisera lärarens dashboard när DOM:en är helt laddad
document.addEventListener('DOMContentLoaded', initTeacherDashboard);
