<template>
  <cartlist class="flex-col flex-shrink-0 relative">
    <span class="_rows">
      <CartListItem
        v-for="(item, index) in list"
        :key="item.id"
        :name="item.name"
        :units="item.units"
        :price="item.price * item.units"
        :selected="item.selected"
        :item-index="index"
      />
    </span>
  </cartlist>
</template>

<script>
import CartListItem from "@components/CartListItem";

export default {
  name: "CartList",
  components: {
    CartListItem
  },
  props: {
    list: {
      type: Array,
      required: true
    }
  }
};
</script>

<style lang="scss">
@import "@scss/_utils";

cartlist {
  background-color: var(--tq-card);
  border-radius: var(--tq-radius-card);
  margin: 0 var(--app-view-padding);
  padding: rem(8px);

  ._rows {
    display: flex;
    flex-direction: column;
  }
}
</style>
