const SlidingRowsCarousel = {
  name: 'SlidingRowsCarousel',
  props: {
    rows:     { type: Number, default: 3 },
    cols:     { type: Number, default: 6 },
    speed:    { type: Number, default: 5 }, // seconds per loop
    cardImgs: { type: Array,  required: true }
  },
  data() {
    return {
      animations: [],
      dragging: false,
      drag: {
        row:       null,
        startX:    0,
        startTime: 0
      }
    };
  },
  mounted() {
    this.$nextTick(this.setupAnimations);
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
    this.animations.forEach(anim => anim.cancel());
  },
  methods: {
    rowImages(rowIndex) {
      return Array.from({ length: this.cols }, (_, i) =>
        this.cardImgs[(rowIndex * this.cols + i) % this.cardImgs.length]
      );
    },
    cardStyle(url) {
      const widthCalc = `calc((100vw) / ${this.cols} - 20px)`;
      return { width: widthCalc, backgroundImage: `url(${url})` };
    },
    setupAnimations() {
      // cancel existing animations
      this.animations.forEach(anim => anim.cancel());
      this.animations = [];

      const tracks = this.$refs.tracks || [];
      tracks.forEach((track, i) => {
        const first = track.querySelector('.card');
        if (!first) return;
        const cw   = first.getBoundingClientRect().width;
        const dist = (cw + 20) * this.cols;
        track.style.setProperty('--slide-dist', `${dist}px`);

        // Define start/end frames based on row parity
        let frames;
        if (i % 2 === 0) {
          // slide-left: 0 -> -dist
          frames = [
            { transform: 'translateX(0)' },
            { transform: `translateX(${-dist}px)` }
          ];
        } else {
          // slide-right: -dist -> 0
          frames = [
            { transform: `translateX(${-dist}px)` },
            { transform: 'translateX(0)' }
          ];
        }

        // Create Web Animation
        const anim = track.animate(frames, {
          duration: this.speed * 1000,
          iterations: Infinity,
          easing: 'linear',
          fill: 'forwards',
          composite: 'replace'
        });
        this.animations[i] = anim;
      });
    },
    onPointerDown(e, rowIndex) {
      this.dragging = true;
      this.drag.row = rowIndex;
      this.drag.startX = e.clientX;
      const anim = this.animations[rowIndex];
      anim.pause();
      this.drag.startTime = anim.currentTime || 0;
      window.addEventListener('pointermove', this.onPointerMove);
      window.addEventListener('pointerup',   this.onPointerUp);
      window.addEventListener('pointercancel',this.onPointerUp);
    },
    onPointerMove(e) {
      if (!this.dragging) return;
      const { row, startX, startTime } = this.drag;
      const delta = e.clientX - startX;
      const anim = this.animations[row];
      // calculate time shift
      const track = this.$refs.tracks[row];
      const first = track.querySelector('.card');
      const cw   = first.getBoundingClientRect().width;
      const dist = (cw + 20) * this.cols;
      const duration = this.speed * 1000;
      const direction = row % 2 === 0 ? -1 : 1;
      const timeShift = (delta / dist) * duration * direction;
      anim.currentTime = startTime + timeShift;
    },
    onPointerUp(e) {
      if (!this.dragging) return;
      const row = this.drag.row;
      const anim = this.animations[row];
      anim.play();
      this.dragging = false;
      window.removeEventListener('pointermove', this.onPointerMove);
      window.removeEventListener('pointerup',   this.onPointerUp);
      window.removeEventListener('pointercancel',this.onPointerUp);
    },
    onHoverStart(rowIndex) {
      // pause animation on hover
      if (this.animations[rowIndex]) {
        this.animations[rowIndex].pause();
      }
    },
    onHoverEnd(rowIndex) {
      // resume animation when hover ends
      if (this.animations[rowIndex] && !this.dragging) {
        this.animations[rowIndex].play();
      }
    },
    onResize() {
      this.setupAnimations();
    }
  },
  template: `
     <div class="container">
    <div
      v-for="(row, rowIndex) in rows"
      :key="rowIndex"
      class="row"
      @mouseenter="onHoverStart(rowIndex)"
      @mouseleave="onHoverEnd(rowIndex)"
      @pointerdown.prevent="onPointerDown($event, rowIndex)"
    >
      <div class="track" ref="tracks">
        <div
          v-for="(url, c) in rowImages(rowIndex)"
          :key="c"
          class="card"
          :style="cardStyle(url)"
        ></div>
        <div
          v-for="(url, c) in rowImages(rowIndex)"
          :key="'dup-' + c"
          class="card"
          :style="cardStyle(url)"
        ></div>
      </div>
    </div>
  </div>
  `
}

window.SlidingRowsCarousel = SlidingRowsCarousel
