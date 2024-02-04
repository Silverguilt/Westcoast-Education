function addCourse(course) {
    const courses = getCourses();
    courses.push(course);
    saveCourses(courses);
}
function removeCourse(courseId) {
    const courses = getCourses();
    const updatedCourses = courses.filter((course) => course.id !== courseId);
    saveCourses(updatedCourses);
}
function getCourses() {
    const coursesJSON = localStorage.getItem('courses');
    return coursesJSON ? JSON.parse(coursesJSON) : [];
}
function saveCourses(courses) {
    localStorage.setItem('courses', JSON.stringify(courses));
}
