<template>
  <application-overlay
    :class="[
      'flex fixed pin-a',
      {
        _mounted: mounted,
        'flex-col justify-center _window': mode === 'window',
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
      default: "",
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
  data() {
    return {
      mounted: false
    };
  },
  methods: {
    close() {
      if (this.cancelable) {
        this.$emit("close");
      }
    }
  },
  mounted() {
    this.mounted = true;
  },
  beforeDestroy() {
    this.mounted = false;
  }
};
</script>

<style lang="scss">
@import "@scss/_utils";
@import "@scss/_typography";
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

  &:not(._mounted) {
    application-window,
    application-drawer {
      animation: anim_leave running;
      animation-duration: var(--transition-duration-regular);
      animation-iteration-count: 1;
      visibility: hidden;
    }
  }
  &._mounted {
    application-window,
    application-drawer {
      animation: anim_enter running;
      animation-duration: var(--transition-duration-regular);
      animation-timing-function: var(--transition-timing-ease_out);
      animation-iteration-count: 1;
      visibility: visible;
    }
  }

  application-window,
  application-drawer {
    background: var(--color-ui-background);
    padding: var(--app-view-padding);

    .actions {
      border-top: rem(1px) solid var(--color-ui-separator);
      display: flex;
      flex-direction: row;
      margin: {
        bottom: calc(var(--app-view-padding) * -1);
        left: calc(var(--app-view-padding) * -1);
        right: calc(var(--app-view-padding) * -1);
        top: rem(16px);
      }
      padding: 0 var(--app-view-padding);

      input[type="button"],
      button {
        @include graphene-font-style-label();
        flex-shrink: 1;
        font-weight: $graphene-font-weight-semibold;
        height: rem(48px);
        transition-property: opacity;
        transition-duration: var(--transition-duration-regular);
        width: 100%;
        white-space: nowrap;

        &.accept {
          color: var(--color-ui-accent);
          text-align: right;
        }
        &.reject {
          color: var(--color-ui-delete);
          text-align: left;
        }
        &:hover:active {
          opacity: 0.4;
          transition-duration: 0;
        }
      }
    }
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
  &._window {
    @keyframes anim_enter {
      from {
        transform: scale(1.1);
      }
      to {
        transform: translateY(1);
      }
    }
    @keyframes anim_leave {
      from {
        transform: translateY(1);
      }
      to {
        transform: translateY(1.1);
      }
    }
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
    @keyframes anim_enter {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0%);
      }
    }
    @keyframes anim_leave {
      from {
        transform: translateY(0%);
      }
      to {
        transform: translateY(100%);
      }
    }
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
