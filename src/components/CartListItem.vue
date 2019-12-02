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
  line-height: rem(44px);
  overflow: hidden;
  padding: 0 var(--app-view-padding);

  &:first-of-type {
    .__separator {
      display: none;
    }
  }
  &:not(._selected):hover:active {
    background-color: var(--color-ui-listalt);
  }
  .__separator {
    background-color: var(--color-ui-separator);
    left: var(--app-view-padding);
    height: rem(1px);
    right: var(--app-view-padding);
  }
  &._selected {
    background-color: var(--color-ui-accent);
    color: var(--color-ui-background);

    .item-name {
      &._unnamed {
        color: inherit;
      }
    }
    .__separator {
      opacity: 0;
      visibility: hidden;
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
