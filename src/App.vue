<template>
  <application class="absolute pin-a flex-col" @click.prevent="no_zoom">
    <template v-if="!isMobile">
      <div
        class="_viewport_desktop flex-col align-items-center justify-center text-center absolute pin-a"
      >
        <QRCode
          class="qr_code"
          :value="qr_desktop_address"
          :options="qr_desktop_options"
        />
        <div class="message">
          Escaneie o código com a câmera do seu celular para acessar o
          aplicativo.
        </div>
        <div class="submessage">
          Este aplicativo foi desenvolvido para funcionar apenas em smartphones.
        </div>
      </div>
    </template>
    <template v-else>
      <Notifications />

      <content class="flex-col flex-grow-1 flex-shrink-1 relative">
        <template v-if="cart_list.length">
          <div class="heading">
            <h1 class="_label text-center">Carrinho</h1>
            <!-- <div class="_icon grphn-icon">questionmark_circle</div> -->
          </div>

          <div class="list-header flex-row flex-shrink-0">
            <div class="item-name">Nome</div>
            <div class="item-un">Un</div>
            <div class="item-price">Preço</div>
            <div></div>
          </div>

          <CartList :list="cart_list" />

          <cartlist-footer
            class="flex-col flex-shrink-0"
            :key="`${cart_list_updates}-${calc_list_total()}`"
            ontouchstart=""
          >
            <cartlist-footer-item class="flex-row">
              <div class="__label">Itens no carrinho</div>
              <div class="__value">{{ calc_list_units() }}un</div>
            </cartlist-footer-item>
            <cartlist-footer-item class="flex-row">
              <div class="__label">Total da compra</div>
              <div class="__value">{{ calc_list_total() }}</div>
            </cartlist-footer-item>
            <cartlist-controls class="flex-col">
              <cartlist-control @click="cart_list_reset">
                <div class="__label">Limpar carrinho</div>
                <div class="__icon grphn-icon">trashcan</div>
              </cartlist-control>
            </cartlist-controls>
          </cartlist-footer>
        </template>

        <template v-else>
          <div
            class="cart-empty flex-col flex-grow-1 align-items-center justify-center text-center"
          >
            Seu carrinho de compras está vazio. Digite um valor, defina a
            quantidade e o nome do item é opcional.
          </div>
        </template>
      </content>

      <CalcControls class="relative pin-b pin-x flex-shrink-0" />
    </template>
  </application>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import QRCode from "@chenfengyuan/vue-qrcode";

export default {
  name: "app",
  components: {
    CartList: () => import("@components/CartList"),
    CalcControls: () => import("@components/CalcControls"),
    Notifications: () => import("@components/Notifications"),
    QRCode
  },
  watch: {
    cart_list_updates() {
      this.calc_list_units();
      this.calc_list_total();
    }
  },
  computed: {
    ...mapGetters(["cart_list", "cart_list_updates", "isMobile"]),
    qr_desktop_options() {
      return {
        scale: 6,
        margin: 3,
        color: {
          dark: "#000000cc"
        }
      };
    },
    qr_desktop_address() {
      return window.location.href;
    }
  },
  methods: {
    ...mapMutations(["changeMobileView", "cart_list_reset"]),
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

content {
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  padding: var(--app-view-padding) 0;

  @supports (padding-top: env(safe-area-inset-top)) {
    padding-top: calc(var(--app-view-padding) + env(safe-area-inset-top));
  }

  .heading {
    align-items: center;
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    margin: 0 var(--app-view-padding) rem(40px);

    ._label {
      color: var(--color-text-heading);
      flex-grow: 1;
    }
    ._icon {
      color: var(--color-text-placeholder);
      font-size: rem(24px);
      justify-items: flex-end;
    }
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

cartlist-footer {
  --padding-y: #{rem(8px)};
  --padding-x: #{rem(12px)};
  background-color: var(--color-ui-separator);
  border-radius: var(--ui-border-radius-regular);
  color: var(--color-text-heading);
  margin: rem(16px) var(--app-view-padding) 0;
  overflow: hidden;
  padding: var(--padding-y) var(--padding-x) 0;
  @include graphene-font-style-paragraph();

  cartlist-footer-item {
    line-height: rem(30px);

    .__label,
    .__value {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .__label {
      color: var(--color-text-placeholder);
      flex-grow: 1;

      .grphn-icon {
        margin-right: rem(4px);
      }
    }
    .__value {
      font-weight: $graphene-font-weight-semibold;
      flex-shrink: 0;
    }
  }
}
cartlist-controls {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  margin: rem(8px) calc(var(--padding-x) * -1) 0;

  cartlist-control {
    @include graphene-font-style-label;
    align-items: center;
    border-top: rem(1.6px) solid var(--color-ui-background);
    color: var(--color-text-placeholder);
    display: flex;
    flex-direction: row;
    font-weight: $graphene-font-weight-semibold;
    height: rem(48px);
    justify-content: center;
    // line-height: rem(44px);
    padding: 0 var(--padding-x);
    position: relative;

    &:hover:active {
      color: var(--color-text-heading);
    }
    .__label {
      flex-grow: 1;
    }
    .__icon {
      flex-shrink: 0;
      font-size: rem(24px);
      justify-content: flex-end;
    }
  }
}

.cart-empty {
  padding: 0 calc(var(--app-view-padding) * 2.5);
}

._viewport_desktop {
  .qr_code {
    margin-bottom: rem(32px);
  }
  .submessage,
  .message {
    max-width: rem(420px);
  }
  .message {
    @include graphene-font-style-interest();
  }
  .submessage {
    background-color: var(--color-ui-separator);
    border-radius: var(--ui-border-radius-regular);
    color: var(--color-text-placeholder);
    // border-top: rem(1px) solid var(--color-ui-separator);
    margin-top: rem(24px);
    padding: rem(8px) rem(16px);
    @include graphene-font-style-label();
  }
}
</style>
