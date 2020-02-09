<template>
  <cartlist class="flex-col flex-shrink-0 relative" :key="cart_list_updates">
    <transition-group name="pop">
      <CartListItem
        v-for="(item, index) in list"
        :name="item.name"
        :units="item.units"
        :price="String(item.price * item.units)"
        :selected="item.selected"
        :item-index="index"
        :key="`${index}-${item.selected}`"
      />
    </transition-group>
  </cartlist>
</template>

<script>
import { mapGetters } from "vuex";
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
  },
  computed: {
    ...mapGetters(["cart_list", "cart_list_updates"])
  }
};
</script>

<style lang="scss">
@import "@scss/_utils";
@import "@scss/_typography";

cartlist {
}
</style>
