<template>
  <cartlist-item
    :class="[
      'flex-col relative',
      {
        _selected: selected
      }
    ]"
    :data-item-index="itemIndex"
    @click="toggleItem"
  >
    <cartlist-item-info class="flex-row">
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
    </cartlist-item-info>
    <cartlist-item-controls
      :class="[
        'flex-row',
        {
          _expanded: selected
        }
      ]"
    >
      <control-section></control-section>
      <control-section>
        <div class="grphn-icon">minus_circle</div>
        <div class="grphn-icon">plus_circle</div>
      </control-section>
      <control-section>
        <div class="grphn-icon">xmark_circle</div>
      </control-section>
    </cartlist-item-controls>
    <hr class="__separator absolute pin-t" />
  </cartlist-item>
</template>

<script>
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
    toggleItem() {
      this.$emit("select", this.itemIndex);
    }
  }
};
</script>

<style lang="scss">
@import "@scss/_utils";

cartlist-item {
  line-height: rem(44px);
  overflow: hidden;
  padding: 0 var(--app-view-padding);

  &:first-of-type {
    .__separator {
      display: none;
    }
  }
  .__separator {
    background-color: var(--color-ui-separator);
    left: var(--app-view-padding);
    height: rem(1px);
    right: var(--app-view-padding);
  }
  &._selected {
    box-shadow: inset 0 0 0 rem(2px) var(--color-ui-accent);
  }

  .item-name {
    &._unnamed {
      color: var(--color-text-placeholder);
    }
  }

  cartlist-item-controls {
    font-size: rem(24px);
    padding-bottom: rem(12px);

    &:not(._expanded) {
      height: 0rem;
      padding: 0;
      visibility: hidden;
    }

    control-section {
      display: inline-flex;
      flex-direction: row;

      div:not(:first-child) {
        margin-left: rem(12px);
      }
    }
    control-section:nth-child(1) {
      flex-grow: 5;
    }
    control-section:nth-child(2) {
      flex-grow: 1;
      justify-content: flex-end;
    }
    control-section:nth-child(3) {
      flex-grow: 2;
      justify-content: flex-end;
    }
  }
}
</style>
