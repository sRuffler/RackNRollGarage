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
      touchStartX: 0,
      touchEndX: 0,
    };
  },
  methods: {
    toggleSidePageById(id) {
      const element = document.getElementById(id);
      if (element) {
        element.classList.toggle("active");
        if (element.classList.contains("active")) {
          element.scrollTop = 0;
          window.setTimeout(() => {
            document.body.style.overflow = "hidden";
          }, 100);
        } else {
          document.body.style.overflow = "auto";
        }
      }
    },
    scrollToSection(id) {
      const section = document.getElementById(id);
      if (!section) return;

      // Close all side bars
      const bespokeSideBar = document.getElementById("bespokeConversions");
      const vwSidebar = document.getElementById("vwConversions");
      const skylineSidebar = document.getElementById("skylineConversions");

      document.body.style.overflow = "auto";

      bespokeSideBar.classList.remove("active");
      vwSidebar.classList.remove("active");
      skylineSidebar.classList.remove("active");

      const targetY = section.getBoundingClientRect().top + window.pageYOffset;
      const startY = window.pageYOffset;
      const distance = targetY - startY;
      if (id !== "heroSection") distance - 88;

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
        window.scrollTo(0, startY + (distance - 88) * ease);
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      }

      requestAnimationFrame(animateScroll);
    },
    openImagePreview(event) {
      const modal = document.getElementById("galleryModal");
      const modalImg = document.getElementById("galleryModalImg");
      modalImg.src = event.target.src;
      modal.classList.add("active");
      document.body.style.overflow = "hidden";

      window.setTimeout(() => {
        const overlay = document.getElementById("galleryModalOverlay");
        overlay.style.opacity = 0.85;

        const img = document.getElementById("galleryModalImg");
        img.style.transform = "scale(1)";
        img.style.opacity = 1;
      }, 100);
    },
    closeImagePreview() {
      document.getElementById("galleryModal").classList.remove("active");
      document.body.style.overflow = "auto";
      const overlay = document.getElementById("galleryModalOverlay");
      overlay.style.opacity = 0;
      const img = document.getElementById("galleryModalImg");
      img.style.transform = "scale(0)";
      img.style.opacity = 0;
    },
    onTouchStart(e) {
      this.touchStartX = e.changedTouches[0].screenX;
    },
    onTouchMove(e) {
      this.touchEndX = e.changedTouches[0].screenX;
    },
    onTouchEnd(id) {
      const swipeDistance = this.touchEndX - this.touchStartX;
      const minSwipeDistance = 150;

      if (swipeDistance > minSwipeDistance) {
        const el = document.getElementById(id);
        el.classList.remove("active");
        document.body.style.overflow = "auto";
      }

      this.touchStartX = 0;
      this.touchEndX = 0;
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

const contactObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("loaded");
      }
    });
  },
  {
    threshold: 0.05,
  }
);

const target = document.getElementById("testimonalsSection");
if (target) {
  observer.observe(target);
}
const contact = document.getElementById("contactSectionContainer");
if (contact) {
  contactObserver.observe(contact);
}

const gallerytarget = document.getElementById("galleryGrid");
if (gallerytarget) {
  galleryObserver.observe(gallerytarget);
}

const fadeInElements = document.querySelectorAll(".fade-in");

if (fadeInElements) {
  fadeInElements.forEach((x) => fadeObserver.observe(x));
}

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".desktop-nav");
  const sentinel = document.querySelector("#hero-sentinel");

  const io = new IntersectionObserver(
    ([entry]) => {
      // entry.isIntersecting = true when sentinel is in view (i.e. hero bottom is visible)
      nav.classList.toggle("scrolled", !entry.isIntersecting);
    },
    { rootMargin: "0px", threshold: 0 }
  );

  io.observe(sentinel);
});
