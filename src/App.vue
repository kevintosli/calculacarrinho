<template>
  <application class="absolute pin-a flex-col" @click.prevent="no_zoom">
    <content class="content flex-col flex-grow-1 flex-shrink-1">
      <template v-if="cart_list.length">
        <h1>Carrinho</h1>

        <div class="list-header flex-row flex-shrink-0">
          <div class="item-name">Nome</div>
          <div class="item-un">Un</div>
          <div class="item-price">Preço</div>
          <div></div>
        </div>

        <CartList :list="cart_list" />

        <div class="list-footer flex-col flex-shrink-0" :key="`${cart_list_updates}-${list_units_total}`">
          <div class="flex-row">
            <div class="__label">Itens no carrinho</div>
            <div class="__value">{{ calc_list_units() }}un</div>
          </div>
          <div class="flex-row">
            <div class="__label">Total da compra</div>
            <div class="__value">{{ calc_list_total() }}</div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="cart-empty flex-col flex-grow-1 align-items-center justify-center text-center">
          Seu carrinho de compras está vazio. Digite um valor, defina a quantidade e o nome do item é opcional.
        </div>
      </template>
    </content>

    <CalcControls class="relative pin-b pin-x flex-shrink-0" />
  </application>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "app",
  components: {
    CartList: () => import("@components/CartList"),
    CalcControls: () => import("@components/CalcControls")
  },
  watch: {
    cart_list_updates() {
      this.calc_list_units();
      this.calc_list_total();
    }
  },
  data() {
    return {
      cart: {
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
    ...mapGetters(["cart_list", "cart_list_updates"]),
    list_units_total() {
      let sum = 0;
      this.cart_list.forEach(item => {
        sum += item.units;
      });
      return sum;
    },
    list_total() {
      let sum = 0;
      this.cart_list.forEach(item => {
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
    ...mapMutations(["changeMobileView"]),
    calc_list_units() {
      let sum = 0;
      this.cart_list.forEach(item => {
        sum += item.units;
      });
      return sum;
    },
    calc_list_total() {
      let sum = 0;
      this.cart_list.forEach(item => {
        const item_sum = item.price * item.units;
        sum += item_sum;
      });
      return sum.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    },
    no_zoom() {
      return false;
    },
    handleResize() {
      this.changeMobileView(window.innerWidth <= 425);
    }
  },
  created() {
    this.handleResize();
    if (this.iOSDevice) {
      document.querySelector("body").classList.add("iOS");
    }
  },
  mounted() {
    document.title = "Calcula Carrinho";
    window.addEventListener("resize", this.handleResize, { passive: true });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize, { passive: true });
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
  font-size: rem(16px);
  @include graphene-font-style-paragraph();
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
    margin: 0 var(--app-view-padding);
    margin-bottom: rem(24px);
  }
}

.list-header {
  @include graphene-font-style-meta();
  color: var(--color-text-placeholder);
  padding: 0 var(--app-view-padding);
  font-weight: $graphene-font-weight-semibold;
  text-transform: uppercase;
}

.item-name {
  width: 56%;
}
.item-un {
  text-align: center;
  width: 8%;
}
.item-price {
  text-align: right;
  width: 36%;
}

.list-footer {
  background-color: var(--color-ui-separator);
  border-radius: var(--ui-border-radius-regular);
  color: var(--color-text-heading);
  line-height: rem(24px);
  margin: 0 var(--app-view-padding);
  margin-top: var(--app-view-padding);
  padding: rem(8px) rem(12px);
  @include graphene-font-style-paragraph();

  .__label,
  .__value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .__label {
    color: var(--color-text-placeholder);
    flex-grow: 1;
  }
  .__value {
    font-weight: $graphene-font-weight-semibold;
    flex-shrink: 0;
  }
}

.cart-empty {
  padding: 0 calc(var(--app-view-padding) * 2.5);
}
</style>
