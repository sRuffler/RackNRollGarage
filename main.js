// window.onbeforeunload = function () {
//   document.body.style.opacity = 0;
//   window.scrollTo(0, 0);
// };

// window.addEventListener("pageshow", function () {
//   setTimeout(() => window.scrollTo(0, 0), 10);
// });

// window.addEventListener("DOMContentLoaded", function () {
//   setTimeout(() => window.scrollTo(0, 0), 10);
// });

const app = Vue.createApp({
  data() {
    return {
      rows: 3,
      cols: 6,
      speed: 70,
      cardImgs: [
        "images/hero1.jpg",
        "images/hero1.jpg",
        "images/hero1.jpg",
        "images/hero1.jpg",
        "images/hero1.jpg",
        "images/hero1.jpg",
      ],
    };
  },
  methods: {
    toggleSidePageById(id) {
      const element = document.getElementById(id);
      if (element) {
        element.classList.toggle("active");
        if (element.classList.contains("active")) {
          window.setTimeout(() => {
            document.body.style.overflow = "hidden";
          }, 500);
        } else {
          document.body.style.overflow = "auto";
        }
      }
    },
    scrollToSection(id) {
      const section = document.getElementById(id);
      if (!section) return;

      const targetY = section.getBoundingClientRect().top + window.pageYOffset;
      const startY = window.pageYOffset;
      const distance = targetY - startY;
      const duration = 1200; // duration in ms (increase for slower scroll)
      let startTime = null;

      function animateScroll(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        // Ease in-out
        const ease =
          progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;
        window.scrollTo(0, startY + distance * ease);
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      }

      requestAnimationFrame(animateScroll);
    },
  },
});

// Register the component defined in SlidingRowsCarousel.js
app.component("infinite-scroll-grid", window.InfiniteScrollGrid);
app.mount("#app");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("loaded");
      }
    });
  },
  {
    threshold: 0.3, // 30% of the element is visible
  }
);

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("loaded");
      }
    });
  },
  {
    threshold: 0.5, // 30% of the element is visible
  }
);

const galleryObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("loaded");
      }
    });
  },
  {
    threshold: 0.2,
  }
);

const target = document.getElementById("testimonalsSection");
if (target) {
  observer.observe(target);
}

const gallerytarget = document.getElementById("galleryGrid");
if (gallerytarget) {
  galleryObserver.observe(gallerytarget);
}

const fadeInElements = document.querySelectorAll(".fade-in");

if (fadeInElements) {
  fadeInElements.forEach((x) => fadeObserver.observe(x));
}
