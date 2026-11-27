<template>
  <div
    ref="track"
    :class="['swipe-button', { _dragging: dragging, _done: progress >= 1 }]"
    :style="{ '--swipe-progress': progress }"
  >
    <span class="_fill" aria-hidden="true" />
    <span class="_label" aria-hidden="true">{{ label }} ›</span>
    <div
      ref="thumb"
      class="_thumb grphn-icon"
      role="slider"
      tabindex="0"
      :aria-label="`${label}: arraste até o fim para confirmar`"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="Math.round(progress * 100)"
      @pointerdown.prevent="start"
      @pointermove="move"
      @pointerup="end"
      @pointercancel="cancel"
      @keydown.right.prevent="step(0.25)"
      @keydown.left.prevent="step(-0.25)"
      @keydown.end.prevent="step(1)"
      @blur="cancel"
      @contextmenu.prevent
    >
      trashcan
    </div>
  </div>
</template>

<script>
// A destructive action confirmed by dragging the thumb to the end of the
// track. Releasing early springs it back; a plain tap emits "tap" so the
// page can explain what to do.
export default {
  name: "SwipeButton",
  props: {
    label: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dragging: false,
      progress: 0
    };
  },
  methods: {
    range() {
      const track = this.$refs.track.getBoundingClientRect();
      const thumb = this.$refs.thumb.getBoundingClientRect();
      // Called at the start of a drag, when the thumb rests at the left:
      // travel = track minus thumb minus the gap on both sides
      const gap = thumb.left - track.left;
      return Math.max(1, track.width - thumb.width - gap * 2);
    },
    start(event) {
      this.dragging = true;
      this.moved = false;
      this.start_x = event.clientX;
      this.distance = this.range();
      this.$refs.thumb.setPointerCapture(event.pointerId);
    },
    move(event) {
      if (!this.dragging) return;
      const dx = event.clientX - this.start_x;
      if (Math.abs(dx) > 4) this.moved = true;
      this.progress = Math.min(1, Math.max(0, dx / this.distance));
    },
    end() {
      if (!this.dragging) return;
      this.dragging = false;
      if (this.progress >= 0.95) {
        this.confirm();
      } else {
        if (!this.moved) this.$emit("tap");
        this.progress = 0;
      }
    },
    cancel() {
      this.dragging = false;
      if (this.progress < 1) this.progress = 0;
    },
    step(amount) {
      this.progress = Math.min(1, Math.max(0, this.progress + amount));
      if (this.progress >= 1) this.confirm();
    },
    confirm() {
      this.progress = 1;
      if (navigator.vibrate) navigator.vibrate(30);
      this.$emit("confirm");
      // Reset after the list re-renders (the button may be gone by then)
      setTimeout(() => {
        this.progress = 0;
      }, 400);
    }
  }
};
</script>

<style lang="scss">
@import "@scss/_utils";
@import "@scss/_typography";
@import "@scss/variables";

.swipe-button {
  --thumb-size: #{rem(40px)};
  --inset: #{rem(4px)};
  -webkit-touch-callout: none;
  align-items: center;
  border: rem(1px) solid var(--color-ui-separator);
  border-radius: var(--ui-border-radius-circular);
  display: flex;
  height: calc(var(--thumb-size) + var(--inset) * 2);
  justify-content: center;
  overflow: hidden;
  position: relative;
  user-select: none;
  width: min(100%, #{rem(280px)});

  ._fill {
    background-color: var(--color-ui-delete);
    bottom: 0;
    left: 0;
    opacity: min(0.35, var(--swipe-progress, 0));
    position: absolute;
    top: 0;
    width: calc(
      var(--thumb-size) + var(--inset) * 2 +
        (100% - var(--thumb-size) - var(--inset) * 2) * var(--swipe-progress, 0)
    );
  }
  ._label {
    color: var(--color-text-placeholder);
    opacity: calc(1 - var(--swipe-progress, 0) * 1.5);
    padding-left: var(--thumb-size);
    position: relative;
    @include graphene-font-style-label();
  }
  ._thumb {
    align-items: center;
    background-color: var(--color-ui-separator);
    border-radius: 50%;
    color: var(--color-text-heading);
    cursor: grab;
    display: flex;
    font-size: rem(18px);
    height: var(--thumb-size);
    justify-content: center;
    left: calc(
      var(--inset) + (100% - var(--thumb-size) - var(--inset) * 2) *
        var(--swipe-progress, 0)
    );
    position: absolute;
    top: var(--inset);
    touch-action: none;
    width: var(--thumb-size);
    z-index: 1;

    &:focus-visible {
      outline: rem(2px) solid var(--color-ui-delete);
      outline-offset: rem(2px);
    }
  }

  &:not(._dragging) {
    ._fill,
    ._thumb {
      transition: all var(--motion-duration-regular)
        var(--motion-timing-ease_out);
    }
  }
  &._dragging ._thumb,
  &._done ._thumb {
    background-color: var(--color-ui-delete);
    color: var(--color-ui-background);
    cursor: grabbing;
  }
}
</style>
