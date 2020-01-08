<template>
  <application-overlay
    :class="[
      'flex fixed pin-a',
      {
        'flex-col justify-center': mode === 'window',
        'flex-col justify-center _center':
          mode === 'drawer' && position === 'center',
        'flex-col justify-start _top': mode === 'drawer' && position === 'top',
        'flex-row justify-end _right':
          mode === 'drawer' && position === 'right',
        'flex-col justify-end _bottom':
          mode === 'drawer' && position === 'bottom',
        'flex-row justify-start _left': mode === 'drawer' && position === 'left'
      }
    ]"
  >
    <component :is="`application-${mode}`" class="flex-col">
      <slot />
    </component>
    <application-scrim @click.prevent.stop="close" />
  </application-overlay>
</template>

<script>
export default {
  name: "Overlay",
  props: {
    cancelable: {
      type: Boolean,
      default: true
    },
    position: {
      type: String,
      default: "bottom",
      validator: value => {
        return value.match(/center|top|right|bottom|left/);
      }
    },
    mode: {
      type: String,
      default: "window",
      validator: value => {
        return value.match(/window|drawer/);
      }
    }
  },
  methods: {
    close() {
      if (this.cancelable) {
        window.console.log("Close overlay");
      }
    }
  }
};
</script>

<style lang="scss">
@import "@scss/_utils";
@import "@scss/variables";

application-overlay {
  display: flex;
  z-index: 200;

  application-scrim {
    background-color: var(--color-ui-overlay);
    bottom: 0;
    display: block;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1;
  }

  application-window,
  application-drawer {
    background: var(--color-ui-background);
    padding: var(--app-view-padding);
  }
  application-window {
    border-radius: var(--ui-border-radius-regular);
    box-shadow: 0 rem(6px) rem(8px) rem(-3px) $graphene-color-black-200,
      0 rem(8px) rem(24px) rem(-4px) $graphene-color-black-300;
    margin: calc(var(--app-view-padding) + var(--app-view-padding) * 0.5);
  }
  application-drawer {
    box-shadow: 0 0 rem(20px) rem(6px) $graphene-color-black-200;
  }
  &._top {
    application-drawer {
      border-bottom-left-radius: var(--ui-border-radius-regular);
      border-bottom-right-radius: var(--ui-border-radius-regular);

      @supports (padding-top: env(safe-area-inset-top)) {
        padding-top: calc(env(safe-area-inset-top) + var(--app-view-padding));
      }
    }
  }
  &._right {
    application-drawer {
      @supports (padding-right: env(safe-area-inset-right)) {
        padding-bottom: calc(
          env(safe-area-inset-bottom) + var(--app-view-padding)
        );
        padding-right: calc(
          env(safe-area-inset-right) + var(--app-view-padding)
        );
        padding-top: calc(env(safe-area-inset-top) + var(--app-view-padding));
      }
    }
  }
  &._bottom {
    application-drawer {
      border-top-left-radius: var(--ui-border-radius-regular);
      border-top-right-radius: var(--ui-border-radius-regular);

      @supports (padding-bottom: env(safe-area-inset-bottom)) {
        padding-bottom: calc(
          env(safe-area-inset-bottom) + var(--app-view-padding)
        );
      }
    }
  }
  &._left {
    application-drawer {
      @supports (padding-left: env(safe-area-inset-left)) {
        padding-bottom: calc(
          env(safe-area-inset-bottom) + var(--app-view-padding)
        );
        padding-left: calc(env(safe-area-inset-left) + var(--app-view-padding));
        padding-top: calc(env(safe-area-inset-top) + var(--app-view-padding));
      }
    }
  }
}
</style>
