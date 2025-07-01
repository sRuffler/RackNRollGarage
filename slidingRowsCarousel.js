const InfiniteScrollGrid = {
  name: "InfiniteScrollGrid",
  props: {
    rows: { type: Number, default: 3 },
    cols: { type: Number, default: 6 },
    cardImgs: { type: Array, required: true },
    gap: { type: Number, default: 20 },
  },
  data() {
    return {
      dragging: false,
      drag: { row: null, startX: 0, startScroll: 0 },
      lastWidth: window.innerWidth,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.centerTracks();
      window.addEventListener("resize", this.onResize);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    rowImages(rowIndex, repeat = 5) {
      // Repeat enough cards for seamless scroll
      const base = Array.from(
        { length: this.cols },
        (_, i) =>
          this.cardImgs[(rowIndex * this.cols + i) % this.cardImgs.length]
      );
      return Array.from(
        { length: this.cols * repeat },
        (_, i) => base[i % this.cols]
      );
    },
    cardStyle(url) {
      return { backgroundImage: `url(${url})` };
    },
    centerTracks() {
      // Center the middle card in each track
      this.$nextTick(() => {
        const tracks = this.$refs.tracks || [];
        tracks.forEach((track, index) => {
          const cards = track.querySelectorAll(".card");
          if (!cards.length) return;
          const trackWidth = track.offsetWidth;

          const cardWidth = cards[0].offsetWidth;
          const gap = this.gap;
          const middleIndex = Math.floor(cards.length / 2);
          const scrollTo =
            (cardWidth + gap) * middleIndex + cardWidth / 2 - trackWidth / 2;
          track.scrollLeft = scrollTo;
          if (index == 1) track.scrollLeft += 160;
        });
      });
    },
    onPointerDown(e, rowIndex) {
      this.dragging = true;
      this.drag.row = rowIndex;
      this.drag.startX = e.clientX;
      const track = this.$refs.tracks[rowIndex];
      this.drag.startScroll = track.scrollLeft;
      window.addEventListener("pointermove", this.onPointerMove);
      window.addEventListener("pointerup", this.onPointerUp);
      window.addEventListener("pointercancel", this.onPointerUp);
    },
    onPointerMove(e) {
      if (!this.dragging) return;
      const { row, startX, startScroll } = this.drag;
      const track = this.$refs.tracks[row];
      const delta = startX - e.clientX;
      track.scrollLeft = startScroll + delta;

      // Infinite scroll logic for 3 repeats
      const cards = track.querySelectorAll(".card");
      if (!cards.length) return;
      const cardWidth = cards[0].offsetWidth;
      const gap = this.gap;
      const setLength = (cardWidth + gap) * this.cols;
      const totalLength = (cardWidth + gap) * cards.length;

      // If near the left end, jump to the same position in the middle set
      if (track.scrollLeft < setLength) {
        track.scrollLeft += setLength;
        this.drag.startScroll = track.scrollLeft;
        this.drag.startX = e.clientX;
      }
      // If near the right end, jump to the same position in the middle set
      else if (track.scrollLeft > totalLength - setLength * 2) {
        track.scrollLeft -= setLength;
        this.drag.startScroll = track.scrollLeft;
        this.drag.startX = e.clientX;
      }
    },
    onPointerUp() {
      this.dragging = false;
      window.removeEventListener("pointermove", this.onPointerMove);
      window.removeEventListener("pointerup", this.onPointerUp);
      window.removeEventListener("pointercancel", this.onPointerUp);
    },
    onResize() {
      // Only recenter if width changed (not just height)
      if (window.innerWidth !== this.lastWidth) {
        this.lastWidth = window.innerWidth;
        this.centerTracks();
      }
    },
  },
  template: `
    <div class="infinite-grid">
      <div
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
        class="row"
      >
        <div
          class="track"
          ref="tracks"
          @pointerdown.prevent="onPointerDown($event, rowIndex)"
        >
          <div
            v-for="(url, c) in rowImages(rowIndex, 6)"
            :key="c"
            class="card"
            :style="cardStyle(url)"
          ></div>
        </div>
      </div>
    </div>
  `,
};

window.InfiniteScrollGrid = InfiniteScrollGrid;
