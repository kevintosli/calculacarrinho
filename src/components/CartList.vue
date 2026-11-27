<template>
  <cartlist class="flex-col flex-shrink-0 relative">
    <span>
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
