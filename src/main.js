// Font: Nunito Sans & Lora
import "@fontsource/nunito-sans/300.css";
import "@fontsource/nunito-sans/400.css";
import "@fontsource/nunito-sans/600.css";
import "@fontsource/nunito-sans/700.css";
import "@fontsource/lora/400.css";
import "@fontsource/lora/600.css";
import "@fontsource/lora/700.css";

import "bootstrap/dist/js/bootstrap.bundle.min.js";

// ============================================
// Scroll to Top Button Functionality
// ============================================
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// ============================================
// Intersection Observer for Scroll Animations
// ============================================
// const observerOptions = {
//   threshold: 0.1,
//   rootMargin: "0px 0px -100px 0px",
// };

// const observer = new IntersectionObserver((entries) => {
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       const delay =
//         Array.from(entry.target.parentNode.children).indexOf(entry.target) *
//         150;

//       setTimeout(() => {
//         entry.target.style.animationDelay = "0ms";
//         entry.target.style.opacity = "1";
//       }, delay);

//       observer.unobserve(entry.target);
//     }
//   });
// }, observerOptions);

// Observe all scroll-animate elements
// document.querySelectorAll(".scroll-animate").forEach((el) => {
//   el.style.animationDelay = "0ms";
//   observer.observe(el);
// });

// ============================================
// Contact Form Validation & Submission
// ============================================
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

// Real-time validation functions
function validateName() {
  const name = document.getElementById("name");
  const error = document.getElementById("nameError");

  if (name.value.trim().length < 2) {
    error.textContent = "Name must be at least 2 characters";
    name.classList.add("is-invalid");
    return false;
  } else {
    error.textContent = "";
    name.classList.remove("is-invalid");
    return true;
  }
}

function validateEmail() {
  const email = document.getElementById("email");
  const error = document.getElementById("emailError");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.value)) {
    error.textContent = "Please enter a valid email address";
    email.classList.add("is-invalid");
    return false;
  } else {
    error.textContent = "";
    email.classList.remove("is-invalid");
    return true;
  }
}

function validateMessage() {
  const message = document.getElementById("message");
  const error = document.getElementById("messageError");

  if (message.value.trim().length < 10) {
    error.textContent = "Message must be at least 10 characters";
    message.classList.add("is-invalid");
    return false;
  } else {
    error.textContent = "";
    message.classList.remove("is-invalid");
    return true;
  }
}

// Add real-time validation listeners
document.getElementById("name").addEventListener("blur", validateName);
document.getElementById("email").addEventListener("blur", validateEmail);
document.getElementById("message").addEventListener("blur", validateMessage);

// Form submission
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Validate all fields
  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isMessageValid = validateMessage();

  if (isNameValid && isEmailValid && isMessageValid) {
    // Collect form data
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value,
      timestamp: new Date().toISOString(),
    };

    // Log to console (in production, send to backend API)
    console.log("Form Data:", formData);

    // Show success message
    formMessage.textContent =
      "✓ Thank you! Your message has been sent successfully.";
    formMessage.style.color = "#90EE90";

    // Reset form
    contactForm.reset();

    // Clear message after 5 seconds
    setTimeout(() => {
      formMessage.textContent = "";
    }, 5000);
  } else {
    // Show error message
    formMessage.textContent = "✗ Please fix the errors above and try again.";
    formMessage.style.color = "#FF6B6B";
  }
});

// ============================================
// Smooth Scrolling for Anchor Links
// ============================================
// document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
//   anchor.addEventListener("click", function (e) {
//     const href = this.getAttribute("href");

//     // Skip if it's just '#'
//     if (href === "#") return;

//     e.preventDefault();

//     const target = document.querySelector(href);
//     if (target) {
//       target.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });

//       // Close mobile menu if open
//       const navCollapse = document.querySelector(".navbar-collapse");
//       if (navCollapse.classList.contains("show")) {
//         document.querySelector(".navbar-toggler").click();
//       }
//     }
//   });
// });

// ============================================
// Add Active Navigation Link on Scroll
// ============================================
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.pageYOffset >= sectionTop - 500) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("text-brand-2");
    if (link.getAttribute("href").slice(1) === current) {
      // link.classList.add("active");
      link.classList.add("text-brand-2");
    }
  });
});

// ============================================
// Accessibility & Keyboard Navigation
// ============================================
document.addEventListener("keydown", (e) => {
  // Escape key to close mobile menu
  if (e.key === "Escape") {
    const navCollapse = document.querySelector(".navbar-collapse");
    if (navCollapse.classList.contains("show")) {
      document.querySelector(".navbar-toggler").click();
    }
  }
});

// ============================================
// Performance Optimization - Lazy Loading
// ============================================
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add("loaded");
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// ============================================
// animation typing hero title
// ============================================
const el = document.getElementById("typewriter");

// kata-kata yang diputar
const words = ["Inovatif", "Efisien", "Terpercaya"];

// pengaturan kecepatan (ms)
const TYPE_SPEED = 80; // jeda per karakter saat mengetik
const HOLD = 1000; // jeda setelah kata selesai diketik
const FADE = 350; // durasi fade-out (harus sama dengan CSS transition)

function typeWord(word, done) {
  el.textContent = "";
  let i = 0;
  (function tick() {
    if (i < word.length) {
      el.textContent += word[i++];
      setTimeout(tick, TYPE_SPEED);
    } else {
      setTimeout(done, HOLD);
    }
  })();
}

function fadeOut(done) {
  el.classList.add("fade-out");
  setTimeout(() => {
    el.classList.remove("fade-out");
    el.textContent = "";
    done && done();
  }, FADE);
}

(function cycle(index = 0) {
  typeWord(words[index], () => {
    fadeOut(() => {
      cycle((index + 1) % words.length);
    });
  });
})();
