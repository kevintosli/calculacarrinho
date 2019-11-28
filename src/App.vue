<template>
  <application class="absolute pin-a flex-col">
    <div class="content flex-col flex-grow-1 flex-shrink-1">
      <h1>Carrinho</h1>

      <div class="list-header flex-row flex-shrink-0">
        <div class="item-name">Nome</div>
        <div class="item-un">Un</div>
        <div class="item-price">Preço</div>
        <div></div>
      </div>

      <ul class="list-items flex-col flex-shrink-0">
        <ListItem v-for="(item, index) in cart" class="item flex-row" :item="item" :key="index" />
      </ul>

      <div class="list-footer flex-row flex-shrink-0">
        <div class="item-name"></div>
        <div class="item-un">{{ list_units_total }}</div>
        <div class="item-price">{{ list_total }}</div>
      </div>
    </div>
    <CalcControls class="relative pin-b pin-x flex-shrink-0" />
  </application>
</template>

<script>
export default {
  name: "app",
  components: {
    ListItem: () => import("@components/ListItem"),
    CalcControls: () => import("@components/CalcControls")
  },
  data() {
    return {
      cart: [
        {
          name: "Leite",
          units: 12,
          price: 2.99
        },
        {
          name: "Pão",
          units: 3,
          price: 4.5
        },
        {
          name: "Cacetinho",
          units: 3,
          price: 12.87
        },
        {
          name: "Bucetinha",
          units: 2,
          price: 0.54
        }
      ]
    };
  },
  computed: {
    list_units_total() {
      let sum = 0;
      this.cart.forEach(item => {
        sum += item.units;
      });
      return sum;
    },
    list_total() {
      let sum = 0;
      this.cart.forEach(item => {
        const item_sum = item.price * item.units;
        sum += item_sum;
      });
      return sum.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    }
  },
  mounted() {
    document.title = "Calcula Carrinho";
  }
};
</script>

<style lang="scss">
@import "@scss/resets";
@import "@scss/base";
@import "@scss/layout";

application {
  --app-view-padding: #{rem(20px)};
  background-color: var(--color-ui-background);
  color: var(--color-text-paragraph);
  display: block;
  font-family: $graphene-font-family;
  font-size: 16px;
  @extend %graphene-font-style-paragraph;
}

.content {
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  padding: var(--app-view-padding) 0;

  @supports (padding-top: env(safe-area-inset-top)) {
    padding-top: calc(var(--app-view-padding) + env(safe-area-inset-top));
  }

  h1 {
    color: var(--color-text-heading);
    margin-block-end: rem(24px);
  }
}

.list-header {
  color: var(--color-text-placeholder);
  padding: 0 var(--app-view-padding);
  font-weight: $graphene-font-weight-semibold;
  text-transform: uppercase;
  @extend %graphene-font-style-meta;
}
.list-items {
  padding: 0 rem(20px);

  .item {
    border-bottom: rem(1px) solid var(--color-ui-separator);
    line-height: rem(44px);

    // &:nth-child(even) {
    //   background-color: var(--color-ui-listalt);
    // }
  }
}
.item-name {
  width: 62%;
}
.item-un {
  text-align: right;
  width: 8%;
}
.item-price {
  text-align: right;
  width: 30%;
}
.list-footer {
  color: var(--color-text-placeholder);
  // border-top: rem(1.6px) solid var(--color-ui-separator);
  line-height: rem(36px);
  font-weight: $graphene-font-weight-semibold;
  margin: 0 var(--app-view-padding);
  @extend %graphene-font-style-paragraph;
}
</style>
