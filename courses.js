// Sample course data
const coursesData = [
    {
        id: 1,
        title: "Complete Web Development Bootcamp",
        instructor: "John Smith",
        image: "web dev.png",
        level: "Beginner",
        rating: 4.8,
        lessons: 45,
        duration: "22 Hours",
        price: 89.99,
        originalPrice: 129.99,
        category: "programming",
        students: 12500
    },
    {
        id: 2,
        title: "UI/UX Design Masterclass",
        instructor: "Emily Rodriguez",
        image: "ui ux.jpg",
        level: "Intermediate",
        rating: 4.7,
        lessons: 38,
        duration: "18 Hours",
        price: 79.99,
        originalPrice: 99.99,
        category: "design",
        students: 8900
    },
    {
        id: 3,
        title: "Business Analytics Fundamentals",
        instructor: "Dr. James Wilson",
        image: "business analytics.jpg",
        level: "Beginner",
        rating: 4.6,
        lessons: 32,
        duration: "15 Hours",
        price: 69.99,
        originalPrice: 89.99,
        category: "business",
        students: 7500
    },
    {
        id: 4,
        title: "Python Programming for Beginners",
        instructor: "Michael Chen",
        image: "python.png",
        level: "Beginner",
        rating: 4.9,
        lessons: 40,
        duration: "20 Hours",
        price: 0,
        originalPrice: 49.99,
        category: "programming",
        students: 21000
    },
    // Add more courses...
];

// Load courses on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCourses(coursesData);
    setupFilters();
});

function loadCourses(courses) {
    const coursesGrid = document.getElementById('coursesGrid');
    coursesGrid.innerHTML = '';
    
    if (courses.length === 0) {
        coursesGrid.innerHTML = `
            <div class="no-courses">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
                <h3>No courses found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }
    
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <div class="course-image">
                <img src="${course.image}" alt="${course.title}">
                <span class="course-level">${course.level}</span>
            </div>
            <div class="course-content">
                <div class="instructor">
                    <img src="images/instructors/instructor${course.id}.jpg" alt="${course.instructor}">
                    <span>${course.instructor}</span>
                </div>
                <h3>${course.title}</h3>
                <div class="rating">
                    <div class="stars">
                        ${getStarRating(course.rating)}
                    </div>
                    <span>(${course.rating})</span>
                </div>
                <div class="course-meta">
                    <span><i class="fas fa-video"></i> ${course.lessons} Lessons</span>
                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                </div>
                <div class="course-price">
                    ${course.price === 0 ? 
                        '<span class="price free">Free</span>' : 
                        `<span class="price">$${course.price.toFixed(2)}</span>
                         <span class="original-price">$${course.originalPrice.toFixed(2)}</span>`
                    }
                </div>
                <button class="btn btn-primary" onclick="enrollCourse(${course.id})">
                    ${course.price === 0 ? 'Enroll Now' : 'Add to Cart'}
                </button>
            </div>
        `;
        coursesGrid.appendChild(courseCard);
    });
}

function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function setupFilters() {
    const filters = ['categoryFilter', 'levelFilter', 'priceFilter', 'sortFilter'];
    
    filters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', filterCourses);
        }
    });
}

function filterCourses() {
    const category = document.getElementById('categoryFilter').value;
    const level = document.getElementById('levelFilter').value;
    const price = document.getElementById('priceFilter').value;
    const sort = document.getElementById('sortFilter').value;
    
    let filteredCourses = [...coursesData];
    
    // Apply filters
    if (category !== 'all') {
        filteredCourses = filteredCourses.filter(course => course.category === category);
    }
    
    if (level !== 'all') {
        filteredCourses = filteredCourses.filter(course => course.level.toLowerCase() === level);
    }
    
    if (price !== 'all') {
        if (price === 'free') {
            filteredCourses = filteredCourses.filter(course => course.price === 0);
        } else {
            filteredCourses = filteredCourses.filter(course => course.price > 0);
        }
    }
    
    // Apply sorting
    switch(sort) {
        case 'popularity':
            filteredCourses.sort((a, b) => b.students - a.students);
            break;
        case 'newest':
            filteredCourses.sort((a, b) => b.id - a.id);
            break;
        case 'price-low':
            filteredCourses.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredCourses.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredCourses.sort((a, b) => b.rating - a.rating);
            break;
    }
    
    loadCourses(filteredCourses);
}

function searchCourses() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm.trim() === '') {
        loadCourses(coursesData);
        return;
    }
    
    const filteredCourses = coursesData.filter(course => 
        course.title.toLowerCase().includes(searchTerm) ||
        course.instructor.toLowerCase().includes(searchTerm) ||
        course.category.toLowerCase().includes(searchTerm)
    );
    
    loadCourses(filteredCourses);
}

function enrollCourse(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (course) {
        if (course.price === 0) {
            alert(`Successfully enrolled in "${course.title}"!`);
        } else {
            alert(`Added "${course.title}" to your cart!`);
        }
    }
}