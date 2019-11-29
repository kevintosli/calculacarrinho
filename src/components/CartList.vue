<template>
  <cartlist class="flex-col flex-shrink-0">
    <template v-if="list.length">
      <CartListItem
        v-for="(item, index) in list"
        :name="item.name"
        :units="item.units"
        :price="item.price"
        :selected="item.selected"
        :item-index="index"
        :key="`${index}-${item.name}-${item.selected}`"
        @select="$emit('select', $event)"
      />
    </template>
    <template v-else>
      Ainda não há nada no seu carrinho de compras. Comece digitando o valor e
      quantidade de unidades.
    </template>
  </cartlist>
</template>

<script>
export default {
  name: "CartList",
  components: {
    CartListItem: () => import("@components/CartListItem")
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
}
</style>
