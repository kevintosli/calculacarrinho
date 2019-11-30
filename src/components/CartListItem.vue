<template>
  <cartlist-item
    :class="[
      'flex-row relative',
      {
        _selected: selected
      }
    ]"
    :data-item-index="itemIndex"
    @click="select_item"
    ontouchstart=""
  >
    <div
      :class="[
        'item-name',
        {
          _unnamed: !name
        }
      ]"
    >
      {{ name || "Sem nome" }}
    </div>
    <div class="item-un">{{ units }}</div>
    <div class="item-price">
      {{
        Number(price).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        })
      }}
    </div>
    <hr class="__separator absolute pin-t" />
  </cartlist-item>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "ListItem",
  props: {
    name: String,
    units: {
      type: Number,
      default: 1
    },
    price: {
      type: String,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    itemIndex: Number
  },
  methods: {
    ...mapActions(["cart_select", "cart_remove"]),
    select_item() {
      this.cart_select(this.itemIndex);
    }
  }
};
</script>

<style lang="scss">
@import "@scss/_utils";
@import "@scss/variables";

cartlist-item {
  border-radius: var(--ui-border-radius-regular);
  line-height: rem(44px);
  overflow: hidden;
  padding: 0 var(--app-view-padding);

  &:first-of-type {
    .__separator {
      display: none;
    }
  }
  &:hover:active {
    background-color: var(--color-ui-listalt);
  }
  .__separator {
    background-color: var(--color-ui-separator);
    left: var(--app-view-padding);
    height: rem(1px);
    right: var(--app-view-padding);
  }
  &._selected {
    background-color: rgba($color-ui-accent-400, 0.08);
    color: var(--color-ui-accent);
    box-shadow: inset 0 0 0 rem(2px) var(--color-ui-accent);

    &:hover:active {
      background-color: rgba($color-ui-accent-400, 0.12);
    }
  }

  .item-name,
  .item-un,
  .item-price {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .item-name {
    &._unnamed {
      color: var(--color-text-placeholder);
    }
  }
}
</style>
