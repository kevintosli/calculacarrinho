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

      <CartList :list="cart.list" @select="toggle_selected_item" />

      <div class="list-footer flex-col flex-shrink-0">
        <div class="flex-row">
          <div class="__label">Itens no carrinho</div>
          <div class="__value">{{ list_units_total }}un</div>
        </div>
        <div class="flex-row">
          <div class="__label">Total da compra</div>
          <div class="__value">{{ list_total }}</div>
        </div>
      </div>
    </div>

    <CalcControls
      class="relative pin-b pin-x flex-shrink-0"
      @submit="cart.add"
    />
  </application>
</template>

<script>
export default {
  name: "app",
  components: {
    CartList: () => import("@components/CartList"),
    CalcControls: () => import("@components/CalcControls")
  },
  data() {
    return {
      cart: {
        list: [
          {
            name: "Leite",
            units: 12,
            price: "2.99",
            selected: false
          },
          {
            name: "Pão",
            units: 3,
            price: "4.50",
            selected: false
          },
          {
            name: "Cacetinho",
            units: 3,
            price: "12.87",
            selected: false
          },
          {
            name: "Bucetinha",
            units: 2,
            price: "0.54",
            selected: false
          }
        ],
        add: $event => {
          // window.console.log($event);
          this.cart.list.push({
            name: "",
            units: $event.units,
            price: $event.value,
            selected: false
          });
        }
      }
    };
  },
  computed: {
    list_units_total() {
      let sum = 0;
      this.cart.list.forEach(item => {
        sum += item.units;
      });
      return sum;
    },
    list_total() {
      let sum = 0;
      this.cart.list.forEach(item => {
        const item_sum = item.price * item.units;
        sum += item_sum;
      });
      return sum.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    }
  },
  methods: {
    toggle_selected_item($event) {
      const NEW_STATE = !this.cart.list[$event].selected;
      this.cart.list.forEach(item => {
        item.selected = false;
      });
      this.cart.list[$event].selected = NEW_STATE;
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
  background-color: var(--color-ui-separator);
  border-radius: var(--ui-border-radius-regular);
  color: var(--color-text-heading);
  // border-top: rem(1.6px) solid var(--color-ui-separator);
  line-height: rem(24px);
  margin: 0 var(--app-view-padding);
  margin-top: rem(8px);
  padding: rem(8px) rem(12px);
  @extend %graphene-font-style-paragraph;

  .__label {
    color: var(--color-text-placeholder);
    flex-grow: 1;
  }
  .__value {
    font-weight: $graphene-font-weight-semibold;
  }
}
</style>
