<template>
  <notification-list class="fixed flex-col pin-x">
    <transition-group name="notification">
      <notification-block-wrapper class="flex-row justify-center" v-for="(notification, index) in notification_list" :key="index">
        <notification-block class="inline-flex flex-row">
          <div class="_description">
            <font v-if="notification.type == 'info'" class="_icon grphn-icon">infomark_circle</font>
            <font v-if="notification.type == 'alert'" class="_icon grphn-icon">exclamationmark_octagon</font>
            <font v-if="notification.type == 'success'" class="_icon grphn-icon">checkmark_circle</font>
            {{ notification.description }}
          </div>
        </notification-block>
      </notification-block-wrapper>
    </transition-group>
  </notification-list>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Notifications",
  computed: {
    ...mapGetters(["notification_list"])
  }
};
</script>

<style lang="scss">
@import "@scss/_utils";
@import "@scss/_typography";

notification-list {
  margin-top: var(--app-view-padding);
  padding: rem(0px) var(--app-view-padding);
  pointer-events: none;
  z-index: 400;

  @supports (margin-top: env(safe-area-inset-top)) {
    margin-top: calc(env(safe-area-inset-top) + var(--app-view-padding));
  }

  notification-block-wrapper {
    &:not(:last-child) {
      margin-bottom: rem(4px);
    }

    notification-block {
      background-color: var(--color-ui-notification);
      border-radius: var(--ui-border-radius-regular);
      color: var(--color-ui-background);
      padding: rem(12px);
      pointer-events: auto;
      @include graphene-font-style-label();

      ._icon {
        font-size: rem(18px);
        margin-right: rem(4px);
      }
    }
  }
}
</style>
