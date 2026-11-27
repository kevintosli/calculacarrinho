<template>
  <button
    type="button"
    :class="['hold-button', { _holding: holding }]"
    :style="{ '--hold-progress': progress }"
    :aria-label="`${label}: segure o botão para confirmar`"
    @pointerdown.prevent="start"
    @pointerup="stop"
    @pointerleave="stop"
    @pointercancel="stop"
    @keydown.enter.prevent="keyStart"
    @keydown.space.prevent="keyStart"
    @keyup.enter="stop"
    @keyup.space="stop"
    @contextmenu.prevent
  >
    <span class="_fill" aria-hidden="true" />
    <span class="_icon grphn-icon" aria-hidden="true">trashcan</span>
    <span class="_label">{{ holding ? holdingLabel : label }}</span>
  </button>
</template>

<script>
// A destructive action that only runs after the button is held down for
// `duration` ms. Letting go early cancels it and emits "too-short".
export default {
  name: "HoldButton",
  props: {
    label: {
      type: String,
      required: true
    },
    holdingLabel: {
      type: String,
      default: "Continue segurando…"
    },
    duration: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      holding: false,
      progress: 0
    };
  },
  methods: {
    start() {
      if (this.holding) return;
      this.holding = true;
      this.started_at = performance.now();
      const tick = now => {
        if (!this.holding) return;
        this.progress = Math.min(1, (now - this.started_at) / this.duration);
        if (this.progress >= 1) {
          this.finish();
        } else {
          this.frame = requestAnimationFrame(tick);
        }
      };
      this.frame = requestAnimationFrame(tick);
    },
    keyStart(event) {
      if (!event.repeat) this.start();
    },
    stop() {
      if (!this.holding) return;
      cancelAnimationFrame(this.frame);
      this.holding = false;
      this.progress = 0;
      this.$emit("too-short");
    },
    finish() {
      cancelAnimationFrame(this.frame);
      this.holding = false;
      this.progress = 0;
      if (navigator.vibrate) navigator.vibrate(30);
      this.$emit("confirm");
    }
  },
  beforeDestroy() {
    cancelAnimationFrame(this.frame);
  }
};
</script>

<style lang="scss">
@import "@scss/_utils";
@import "@scss/_typography";
@import "@scss/variables";

.hold-button {
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  align-items: center;
  background: none;
  border: rem(1px) solid var(--color-ui-separator);
  border-radius: var(--ui-border-radius-circular);
  color: var(--color-text-placeholder);
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  gap: rem(6px);
  overflow: hidden;
  padding: rem(8px) rem(16px);
  position: relative;
  touch-action: manipulation;
  user-select: none;
  @include graphene-font-style-label();

  ._fill {
    background-color: var(--color-ui-delete);
    bottom: 0;
    left: 0;
    position: absolute;
    top: 0;
    transform: scaleX(var(--hold-progress, 0));
    transform-origin: left center;
    width: 100%;
    z-index: 0;
  }
  ._icon,
  ._label {
    position: relative;
    z-index: 1;
  }
  ._icon {
    font-size: rem(16px);
  }

  &:focus-visible {
    outline: rem(2px) solid var(--color-ui-delete);
    outline-offset: rem(2px);
  }
  &._holding {
    border-color: var(--color-ui-delete);
    color: var(--color-text-heading);
  }
}
</style>
