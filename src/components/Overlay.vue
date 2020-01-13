<template>
  <application-overlay
    :class="[
      'flex fixed pin-a',
      {
        _mounted: mounted,
        'flex-col justify-center _window': mode === 'window',
        'flex-col justify-center _center': mode === 'drawer-center',
        'flex-col justify-start _top': mode === 'drawer-top',
        'flex-row justify-end _right': mode === 'drawer-right',
        'flex-col justify-end _bottom': mode === 'drawer-bottom',
        'flex-row justify-start _left': mode === 'drawer-left'
      }
    ]"
    tabindex="-1"
  >
    <component :is="`application-${mode.split('-')[0]}`" class="flex-col">
      <slot />
      <div class="actions">
        <input type="button" :value="rejectLabel" class="reject" @click="reject" @mouseleave.prevent="no_return" />
        <input type="button" :value="acceptLabel" class="accept" @click="accept" @mouseleave.prevent="no_return" />
      </div>
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
      default: false
    },
    mode: {
      type: String,
      default: "window",
      validator: value => {
        return value.match(/window|drawer-center|drawer-top|drawer-right|drawer-bottom|drawer-left/);
      }
    },
    rejectLabel: {
      type: String,
      default: "Agora não"
    },
    acceptLabel: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      mounted: false
    };
  },
  methods: {
    no_return() {
      return false;
    },
    reject() {
      this.mounted = false;
      setTimeout(() => {
        this.$emit("reject");
      });
    },
    accept() {
      this.mounted = false;
      setTimeout(() => {
        this.$emit("accept");
      });
    },
    close() {
      if (this.cancelable) {
        this.mounted = false;
        setTimeout(() => {
          this.$emit("reject");
        });
      }
    }
  },
  mounted() {
    this.mounted = true;
    this.$el.focus();
  },
  beforeDestroy() {
    this.mounted = false;
  },
  destroyed() {
    document.querySelector("application").focus();
  }
};
</script>

<style lang="scss">
@import "@scss/_utils";
@import "@scss/_typography";
@import "@scss/_motion";
@import "@scss/variables";

application-overlay {
  display: flex;
  z-index: 200;

  application-scrim {
    background-color: var(--color-ui-overlay);
    backdrop-filter: saturate(0) contrast(0.7);
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
      animation-play-state: running;
      animation-duration: var(--motion-duration-regular);
      animation-iteration-count: 1;
      visibility: hidden;
    }
  }
  &._mounted {
    application-window,
    application-drawer {
      animation-play-state: running;
      animation-duration: var(--motion-duration-regular);
      animation-timing-function: var(--motion-timing-ease_out);
      animation-iteration-count: 1;
      visibility: visible;
    }
  }

  application-window,
  application-drawer {
    background: var(--color-ui-background);
    padding: var(--app-view-padding);
    transition-property: visibility;
    transition-duration: var(--motion-duration-regular);

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
        transition-duration: var(--motion-duration-regular);
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
    box-shadow: 0 rem(6px) rem(8px) rem(-3px) $graphene-color-black-200, 0 rem(8px) rem(24px) rem(-4px) $graphene-color-black-300;
    margin: calc(var(--app-view-padding) + var(--app-view-padding) * 0.5);
  }
  application-drawer {
    box-shadow: 0 0 rem(20px) rem(6px) $graphene-color-black-200;
  }
  &._window {
    &:not(._mounted) {
      application-window {
        animation-name: dialog_leave;
      }
    }
    &._mounted {
      application-window {
        animation-name: dialog_enter;
      }
    }
  }
  &._top {
    &:not(._mounted) {
      application-drawer {
        animation-name: slide_out_up;
      }
    }
    &._mounted {
      application-drawer {
        animation-name: slide_in_down;
      }
    }
    application-drawer {
      border-bottom-left-radius: var(--ui-border-radius-regular);
      border-bottom-right-radius: var(--ui-border-radius-regular);

      @supports (padding-top: env(safe-area-inset-top)) {
        padding-top: calc(env(safe-area-inset-top) + var(--app-view-padding));
      }
    }
  }
  &._right {
    &:not(._mounted) {
      application-drawer {
        animation-name: slide_out_right;
      }
    }
    &._mounted {
      application-drawer {
        animation-name: slide_in_right;
      }
    }
    application-drawer {
      @supports (padding-right: env(safe-area-inset-right)) {
        padding-bottom: calc(env(safe-area-inset-bottom) + var(--app-view-padding));
        padding-right: calc(env(safe-area-inset-right) + var(--app-view-padding));
        padding-top: calc(env(safe-area-inset-top) + var(--app-view-padding));
      }
    }
  }
  &._bottom {
    &:not(._mounted) {
      application-drawer {
        animation-name: slide_out_down;
      }
    }
    &._mounted {
      application-drawer {
        animation-name: slide_in_up;
      }
    }
    application-drawer {
      border-top-left-radius: var(--ui-border-radius-regular);
      border-top-right-radius: var(--ui-border-radius-regular);

      @supports (padding-bottom: env(safe-area-inset-bottom)) {
        padding-bottom: calc(env(safe-area-inset-bottom) + var(--app-view-padding));
      }
    }
  }
  &._left {
    &:not(._mounted) {
      application-drawer {
        animation-name: slide_out_left;
      }
    }
    &._mounted {
      application-drawer {
        animation-name: slide_in_left;
      }
    }
    application-drawer {
      @supports (padding-left: env(safe-area-inset-left)) {
        padding-bottom: calc(env(safe-area-inset-bottom) + var(--app-view-padding));
        padding-left: calc(env(safe-area-inset-left) + var(--app-view-padding));
        padding-top: calc(env(safe-area-inset-top) + var(--app-view-padding));
      }
    }
  }
}
</style>
