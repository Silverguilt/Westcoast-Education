// courses.js

import { getCurrentUser, enrollCourse } from './auth.js';

// Funktion för att skapa och lägga till ett produktkort i DOM
function createProductCard(product) {
  const productSection = document.getElementById('productSection');

  const productCard = document.createElement('div');
  productCard.classList.add('product-card');

  const productImage = document.createElement('img');
  productImage.src = product.image;
  productImage.alt = product.courseName;

  const productName = document.createElement('h2');
  productName.textContent = product.courseName;

  const startDate = document.createElement('h3');
  startDate.textContent = `Startdatum: ${product.startDate}`;

  const courseLength = document.createElement('h3');
  courseLength.textContent = `Kurslängd: ${product.courseLength}`;

  const classroom = document.createElement('h3');
  classroom.textContent = `Klassrum: ${product.classroom ? 'Ja' : 'Nej'}`;

  const distance = document.createElement('h3');
  distance.textContent = `Distans: ${product.distance ? 'Ja' : 'Nej'}`;

  const description = document.createElement('p');
  description.textContent = product.description;

  const teacher = document.createElement('h3');
  teacher.textContent = `Lärare: ${product.teacher}`;

  const price = document.createElement('h3');
  price.textContent = `Pris: ${product.coursePrice} kr`;

  productCard.appendChild(productImage);
  productCard.appendChild(productName);
  productCard.appendChild(startDate);
  productCard.appendChild(courseLength);
  productCard.appendChild(classroom);
  productCard.appendChild(distance);
  productCard.appendChild(description);
  productCard.appendChild(teacher);
  productCard.appendChild(price);

  // Kolla om användaren är inloggad och har rollen "student", visa då en knapp för att anmäla sig till kursen
  const user = getCurrentUser();
  if (user && user.role === 'student') {
    const addToCartButton = document.createElement('button');
    addToCartButton.textContent = 'Anmäl dig';
    addToCartButton.addEventListener('click', () =>
      addToCart(product.courseName)
    );
    productCard.appendChild(addToCartButton);
  }

  // Appenda produktkortet till produktsektionen
  productSection.appendChild(productCard);
}

// Hämta produkter från JSON-servern
fetch('http://localhost:3000/courses')
  .then((response) => response.json())
  .then((products) => {
    // Skapa och lägg till produktkort för varje produkt i arrayen
    products.forEach(createProductCard);
  })
  .catch((error) => console.error('Error fetching courses:', error));

// Funktion för att lägga till en kurs i varukorgen
export async function addToCart(courseId) {
  try {
    // Hämta den inloggade användaren från local storage
    const userJSON = localStorage.getItem('currentUser');
    let user = userJSON ? JSON.parse(userJSON) : null;

    // Kolla om användaren finns
    if (!user) {
      console.error('User not found. Please log in.');
      return;
    }

    // Kolla om användaren har en array för varukorgen
    if (!user.enrolledCourses) {
      user.enrolledCourses = [];
    }

    // Kolla om användaren redan är anmäld till kursen
    if (user.enrolledCourses.includes(courseId)) {
      console.log('Course already enrolled.');
      return;
    }

    // Lägg till kursid:n i varukorgen
    user.enrolledCourses.push(courseId);

    // Uppdatera den inloggade användaren i local storage
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Gör en PUT request till JSON-servern för att uppdatera användaren
    const userId = user.id;
    const apiUrl = `http://localhost:3000/users/${userId}`;
    await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ enrolledCourses: user.enrolledCourses }),
    });

    // Logga lyckat meddelande till konsolen
    console.log(`Enrolled in course with ID ${courseId}.`);
  } catch (error) {
    console.error('Error enrolling in course:', error);
  }
}

function initCoursesPage() {
  // Kolla om enroll-knappen finns i DOM:en
  const enrollButton = document.getElementById('enrollButton');
  if (enrollButton) {
    enrollButton.addEventListener('click', async () => {
      try {
        const userId = getCurrentUser().id;
        const courseId = 1; // Replace with the actual course ID
        await enrollCourse(userId, courseId);
      } catch (error) {
        console.error('Error enrolling user in course:', error);
        // Hantera felmeddelandet
      }
    });
  }
}

// Initialisera sidan när DOM:en är helt laddad
document.addEventListener('DOMContentLoaded', initCoursesPage);
