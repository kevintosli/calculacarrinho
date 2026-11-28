<template>
  <cartlist-item
    :class="{ _selected: selected }"
    :data-item-index="itemIndex"
    role="button"
    tabindex="0"
    :aria-pressed="selected ? 'true' : 'false'"
    :aria-label="
      `${name || 'Sem nome'}, ${units} ${
        units === 1 ? 'unidade' : 'unidades'
      }, R$ ${amount_label}. Toque para editar`
    "
    @click="select_item"
    @keydown.enter.prevent="select_item"
    @keydown.space.prevent="select_item"
    ontouchstart=""
  >
    <span :class="['item-name', { _unnamed: !name }]">
      {{ name || "Sem nome" }}
    </span>
    <span class="item-un">{{ units }}</span>
    <span class="item-price">
      <span class="_symbol">R$</span>
      <span class="_amount">{{ amount_label }}</span>
    </span>
  </cartlist-item>
</template>

<script>
import { mapActions } from "vuex";
import { format_amount } from "@js/currency";

export default {
  name: "ListItem",
  props: {
    name: String,
    units: {
      type: Number,
      default: 1
    },
    price: {
      type: Number,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    itemIndex: Number
  },
  computed: {
    amount_label() {
      return format_amount(this.price);
    }
  },
  methods: {
    ...mapActions(["cart_select"]),
    select_item() {
      this.cart_select(this.itemIndex);
    }
  }
};
</script>

<style lang="scss">
@import "@scss/_utils";

cartlist-item {
  align-items: center;
  border-radius: rem(9999px);
  color: var(--tq-fg);
  cursor: pointer;
  display: flex;
  font-size: rem(16px);
  gap: rem(8px);
  height: rem(44px);
  line-height: 1.6;
  padding: 0 rem(12px);
  transition: background-color 160ms ease;
  -webkit-tap-highlight-color: transparent;

  &:not(._selected):active {
    background-color: var(--tq-holo);
  }
  &:focus-visible {
    outline: rem(2px) solid var(--tq-fg);
    outline-offset: rem(-2px);
  }
  &._selected {
    background-color: var(--tq-accent);
    color: var(--tq-on-accent);

    .item-name._unnamed {
      color: inherit;
    }
  }

  .item-name {
    flex: 1 1 0;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &._unnamed {
      color: var(--tq-fg-disabled);
    }
  }
  .item-un {
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
    text-align: center;
    width: rem(48px);
  }
  .item-price {
    display: flex;
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
    gap: rem(8px);
    min-width: rem(80px);
    white-space: nowrap;

    ._amount {
      flex: 1 1 auto;
      text-align: right;
    }
  }
}
</style>
