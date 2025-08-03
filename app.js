// Portfolio JavaScript - Animations and Interactions

// Global variables
let scene, camera, renderer, particles = [];
let isLoading = true;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    setTimeout(() => {
        hideLoader();
    }, 2000);
    
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initTypingAnimation();
    initThreeJS();
    initParticles();
    initContactForm();
    initSmoothScroll();
});

// Loading Screen
function hideLoader() {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    isLoading = false;
    
    // Start animations after loading
    setTimeout(() => {
        animateOnScroll();
    }, 500);
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active state immediately
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
                
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
}

// Smooth Scroll
function initSmoothScroll() {
    // Handle all anchor links that start with #
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Typing Animation
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const text = "Hi, I'm Ajmal K – Future Software Engineer";
    let index = 0;
    
    typingElement.innerHTML = '';
    
    function typeWriter() {
        if (index < text.length) {
            typingElement.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, 100);
        }
    }
    
    // Start typing animation after a delay
    setTimeout(typeWriter, 1000);
}

// Three.js Setup
function initThreeJS() {
    const container = document.getElementById('three-container');
    if (!container) return;
    
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Create floating geometric shapes
    createFloatingShapes();
    
    // Camera position
    camera.position.z = 5;
    
    // Start animation loop
    animate3D();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function createFloatingShapes() {
    // Create various geometric shapes
    const geometries = [
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.ConeGeometry(0.3, 0.8, 8),
        new THREE.OctahedronGeometry(0.4),
        new THREE.TetrahedronGeometry(0.5)
    ];
    
    const materials = [
        new THREE.MeshBasicMaterial({ 
            color: 0x00d4ff, 
            wireframe: true,
            transparent: true,
            opacity: 0.8
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0xff6b6b, 
            wireframe: true,
            transparent: true,
            opacity: 0.6
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0x4ecdc4, 
            wireframe: true,
            transparent: true,
            opacity: 0.7
        })
    ];
    
    // Create multiple shapes
    for (let i = 0; i < 15; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);
        
        // Random position
        mesh.position.x = (Math.random() - 0.5) * 20;
        mesh.position.y = (Math.random() - 0.5) * 20;
        mesh.position.z = (Math.random() - 0.5) * 10;
        
        // Random rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;
        
        // Store initial position and rotation speed
        mesh.userData = {
            initialPosition: mesh.position.clone(),
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: Math.random() * 0.005 + 0.001
        };
        
        particles.push(mesh);
        scene.add(mesh);
    }
}

function animate3D() {
    requestAnimationFrame(animate3D);
    
    // Animate particles
    particles.forEach((particle, index) => {
        // Rotation
        particle.rotation.x += particle.userData.rotationSpeed.x;
        particle.rotation.y += particle.userData.rotationSpeed.y;
        particle.rotation.z += particle.userData.rotationSpeed.z;
        
        // Floating motion
        const time = Date.now() * particle.userData.floatSpeed;
        particle.position.y = particle.userData.initialPosition.y + Math.sin(time) * 2;
        particle.position.x = particle.userData.initialPosition.x + Math.cos(time * 0.5) * 1;
    });
    
    // Rotate camera slightly
    if (camera) {
        camera.position.x = Math.cos(Date.now() * 0.0005) * 0.5;
        camera.position.y = Math.sin(Date.now() * 0.0003) * 0.3;
        camera.lookAt(scene.position);
    }
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    if (!camera || !renderer) return;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Particles.js Setup
function initParticles() {
    // Hero particles
    if (document.getElementById('particles-hero')) {
        particlesJS('particles-hero', {
            particles: {
                number: { value: 80 },
                color: { value: '#00d4ff' },
                shape: { type: 'circle' },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: { enable: true, speed: 1, opacity_min: 0.1 }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: { enable: true, speed: 2, size_min: 0.1 }
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' }
                },
                modes: {
                    repulse: { distance: 100, duration: 0.4 },
                    push: { particles_nb: 4 }
                }
            }
        });
    }
    
    // About particles
    if (document.getElementById('particles-about')) {
        particlesJS('particles-about', {
            particles: {
                number: { value: 50 },
                color: { value: '#4ecdc4' },
                shape: { type: 'triangle' },
                opacity: { value: 0.3 },
                size: { value: 2, random: true },
                move: {
                    enable: true,
                    speed: 1,
                    direction: 'none',
                    random: true
                }
            }
        });
    }
    
    // Projects particles
    if (document.getElementById('particles-projects')) {
        particlesJS('particles-projects', {
            particles: {
                number: { value: 60 },
                color: { value: '#ff6b6b' },
                shape: { type: 'star' },
                opacity: { value: 0.4 },
                size: { value: 3, random: true },
                move: {
                    enable: true,
                    speed: 1.5,
                    direction: 'top',
                    straight: false
                }
            }
        });
    }
    
    // Contact particles
    if (document.getElementById('particles-contact')) {
        particlesJS('particles-contact', {
            particles: {
                number: { value: 40 },
                color: { value: '#00d4ff' },
                shape: { type: 'circle' },
                opacity: { value: 0.6 },
                size: { value: 4, random: true },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'bubble' }
                },
                modes: {
                    bubble: { distance: 150, size: 8, duration: 2, opacity: 0.8 }
                }
            }
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Special animations for specific sections
                if (entry.target.classList.contains('metric-card')) {
                    animateCounter(entry.target);
                }
                
                if (entry.target.classList.contains('skill-item')) {
                    animateSkillItem(entry.target);
                }
                
                if (entry.target.classList.contains('project-card')) {
                    animateProjectCard(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .metric-card,
        .timeline-item,
        .project-card,
        .skill-item,
        .cert-item,
        .contact-item,
        .section-title,
        .about-description
    `);
    
    animatedElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

function animateOnScroll() {
    // Initial animation for hero section
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 300);
    });
}

function animateCounter(element) {
    const numberElement = element.querySelector('.metric-number');
    if (!numberElement) return;
    
    const finalValue = numberElement.textContent;
    const isDecimal = finalValue.includes('.');
    const hasPlus = finalValue.includes('+');
    const numericValue = parseFloat(finalValue.replace('+', ''));
    
    let currentValue = 0;
    const increment = numericValue / 50;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= numericValue) {
            currentValue = numericValue;
            clearInterval(timer);
        }
        
        let displayValue = isDecimal ? currentValue.toFixed(1) : Math.floor(currentValue);
        if (hasPlus && currentValue >= numericValue) displayValue += '+';
        
        numberElement.textContent = displayValue;
    }, 50);
}

function animateSkillItem(element) {
    element.style.transform = 'scale(0.8)';
    element.style.opacity = '0';
    
    setTimeout(() => {
        element.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';
    }, Math.random() * 200);
}

function animateProjectCard(element) {
    element.style.transform = 'translateY(50px) rotateX(15deg)';
    element.style.opacity = '0';
    
    setTimeout(() => {
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        element.style.transform = 'translateY(0) rotateX(0)';
        element.style.opacity = '1';
    }, 100);
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Show success message
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = '#4ecdc4';
            
            // Reset form
            form.reset();
            
            // Reset button after delay
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        }, 2000);
    });
    
    // Form field animations
    const formControls = form.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        control.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
}

// Resume Download
function downloadResume() {
    // Create a temporary download link
    const link = document.createElement('a');
    link.href = '#'; // Replace with actual resume URL
    link.download = 'Ajmal_K_Resume.pdf';
    
    // Show downloading animation
    const downloadBtn = event.target.closest('.hero-btn');
    const originalText = downloadBtn.innerHTML;
    
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
    
    setTimeout(() => {
        // Simulate download completion
        downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
        
        // Reset button
        setTimeout(() => {
            downloadBtn.innerHTML = originalText;
        }, 2000);
    }, 1500);
    
    // Note: In a real implementation, you would trigger the actual download here
    console.log('Resume download triggered');
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Mouse movement effects
document.addEventListener('mousemove', debounce((e) => {
    const cursor = { x: e.clientX, y: e.clientY };
    
    // Parallax effect for hero section
    if (window.scrollY < window.innerHeight) {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            const xMove = (cursor.x - window.innerWidth / 2) * 0.01;
            const yMove = (cursor.y - window.innerHeight / 2) * 0.01;
            heroContent.style.transform = `translate(${xMove}px, ${yMove}px)`;
        }
    }
}, 16));

// Add custom cursor effect
document.addEventListener('DOMContentLoaded', function() {
    // Create custom cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, #00d4ff, transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.opacity = '0.7';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
});

// Performance optimization - Throttle scroll events
let ticking = false;

function updateScrollEffects() {
    // Add scroll-based effects here
    const scrolled = window.scrollY;
    const navbar = document.querySelector('.navbar');
    
    if (scrolled > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.8)';
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
});

// Easter egg - Konami code
let konamiCode = [];
const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konami.join(',')) {
        // Activate special effect
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0%, 100% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
    }
`;
document.head.appendChild(style);