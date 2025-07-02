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

const target = document.getElementById("testimonalsSection");
if (target) {
  observer.observe(target);
}
