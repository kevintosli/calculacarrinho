<template>
  <application
    class="absolute pin-a flex-col"
    ontouchstart
    :version="app_version"
  >
    <!-- Desktop -->
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
          aplicativo
        </div>
        <div class="submessage">
          Este aplicativo foi desenvolvido para funcionar apenas em smartphones
        </div>
      </div>
    </template>

    <!-- Mobile -->
    <template v-else>
      <Notifications />

      <transition-group name="fade">
        <Overlay
          v-if="overlay_clearshoppingcart"
          accept-label="Limpar o carrinho"
          @reject="overlay_clearshoppingcart = false"
          @accept="clear_shoppingcart"
          key="clearshoppincart"
        >
          <p class="graphene-font-style-paragraph">
            Quer mesmo limpar o carrinho?
          </p>
          <p class="graphene-font-style-label">
            Esta ação não poderá ser desfeita.
          </p>
        </Overlay>

        <Overlay
          v-if="!overlay_was_app_updated"
          accept-label="Concluído"
          mode="drawer-bottom"
          :reject-label="false"
          @accept="overlay_was_app_updated = true"
          key="appupdates"
        >
          Atualizações
        </Overlay>
      </transition-group>

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

          <cartlist-footer class="flex-col flex-shrink-0" ontouchstart>
            <cartlist-footer-item class="flex-row">
              <div class="__label">Itens no carrinho</div>
              <div class="__value">{{ cart_units }}un</div>
            </cartlist-footer-item>
            <cartlist-footer-item class="flex-row">
              <div class="__label">Total da compra</div>
              <div class="__value">{{ cart_total_label }}</div>
            </cartlist-footer-item>
            <cartlist-controls class="flex-col">
              <cartlist-control
                class="_delete"
                role="button"
                @click="overlay_clearshoppingcart = true"
                @mouseleave.prevent="no_return"
              >
                <div class="__label">Remover todos os itens</div>
                <div class="__icon grphn-icon">trashcan</div>
              </cartlist-control>
            </cartlist-controls>
          </cartlist-footer>

          <div class="little-about-info text-right">
            <p>{{ app_title }} v{{ app_version }}{{ app_version_prefix }}</p>
            <p>Feito com ♥︎ por {{ app_developer }}</p>
            <p>
              {{ app_copyright }} ·
              <a target="_blank" :href="app_owner_url">{{ app_owner }}</a>
            </p>
          </div>
        </template>

        <template v-else>
          <div
            class="cart-empty flex-col flex-grow-1 align-items-center justify-center text-center"
          >
            <svg
              class="cart-empty-illustration"
              viewBox="0 0 160 120"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <!-- floor -->
              <line
                class="_soft"
                x1="20"
                y1="108"
                x2="140"
                y2="108"
                stroke-width="2"
              />
              <!-- price tag floating above the cart -->
              <g class="_tag">
                <path
                  class="_accent-fill"
                  d="M92 14h22a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H92l-9-11z"
                />
                <circle class="_bg-fill" cx="91" cy="25" r="2.2" />
                <line
                  class="_bg-stroke"
                  x1="98"
                  y1="22"
                  x2="111"
                  y2="22"
                  stroke-width="2.4"
                />
                <line
                  class="_bg-stroke"
                  x1="98"
                  y1="28"
                  x2="106"
                  y2="28"
                  stroke-width="2.4"
                />
              </g>
              <!-- dashed drop path -->
              <path
                class="_soft"
                d="M86 40c-6 6-10 12-12 22"
                stroke-width="2"
                stroke-dasharray="1 5"
              />
              <!-- cart -->
              <g class="_line" stroke-width="3.2">
                <path d="M22 42h12l12 44h58l10-34H40" />
                <line x1="58" y1="61" x2="58" y2="78" />
                <line x1="76" y1="61" x2="76" y2="78" />
                <line x1="94" y1="61" x2="94" y2="78" />
                <circle cx="52" cy="99" r="6" />
                <circle cx="98" cy="99" r="6" />
              </g>
            </svg>

            <h2 class="cart-empty-title">Seu carrinho está vazio</h2>
            <p class="cart-empty-subtitle">
              Some as compras enquanto passeia pelo mercado.
            </p>

            <ol class="walkthrough">
              <li>
                <span class="_keys">
                  <span class="key-helper">7</span>
                  <span class="key-helper">8</span>
                  <span class="key-helper">9</span>
                </span>
                <span class="_text">Digite o preço do item</span>
              </li>
              <li>
                <span class="_keys">
                  <span class="key-helper grphn-icon" title="Mais">plus</span>
                  <span class="key-helper grphn-icon" title="Menos">minus</span>
                </span>
                <span class="_text">Ajuste a quantidade</span>
              </li>
              <li>
                <span class="_keys">
                  <span
                    class="key-helper __accent grphn-icon"
                    title="Adicionar à lista"
                    >arrow_up</span
                  >
                </span>
                <span class="_text">Adicione ao carrinho</span>
              </li>
            </ol>

            <p class="cart-empty-tip">
              Dica: toque em <strong>Nome do item</strong> para identificar o
              produto (opcional).
            </p>
          </div>
          <!-- <div class="flex-shrink-0" style="height: var(--app-view-padding);" /> -->
        </template>
      </content>

      <CalcControls class="relative pin-b pin-x flex-shrink-0" />
    </template>
  </application>
</template>

<script>
import { no_return } from "@js/utils";
import { mapGetters, mapMutations } from "vuex";
import { format_brl } from "@js/currency";
import CartList from "@components/CartList";
import CalcControls from "@components/CalcControls";
import Notifications from "@components/Notifications";
import Overlay from "@components/Overlay";

export default {
  name: "app",
  components: {
    CartList,
    CalcControls,
    Notifications,
    Overlay,
    // Only the desktop screen needs the QR code library: load it on demand
    QRCode: () => import("@chenfengyuan/vue-qrcode")
  },
  data() {
    return {
      overlay_clearshoppingcart: false,
      overlay_was_app_updated: true
    };
  },
  computed: {
    ...mapGetters(["cart_list", "cart_units", "cart_total", "isMobile"]),
    cart_total_label() {
      return format_brl(this.cart_total);
    },
    qr_desktop_options() {
      return {
        scale: 6.5,
        margin: 2,
        color: {
          dark: "#fff",
          light: "#000"
        }
      };
    },
    qr_desktop_address() {
      return window.location.href;
    },
    app_version() {
      return process.env.VUE_APP_VERSION;
    },
    app_version_prefix() {
      return process.env.VUE_APP_VERSIONPREFIX;
    },
    app_copyright() {
      return process.env.VUE_APP_COPYRIGHT;
    },
    app_title() {
      return process.env.VUE_APP_TITLE;
    },
    app_developer() {
      return process.env.VUE_APP_DEVELOPER;
    },
    app_owner() {
      return process.env.VUE_APP_OWNER;
    },
    app_owner_url() {
      return process.env.VUE_APP_OWNER_URL;
    }
  },
  methods: {
    no_return,
    ...mapMutations([
      "changeMobileView",
      "cart_unselect_all",
      "cart_list_reset"
    ]),
    clear_shoppingcart() {
      this.cart_unselect_all();
      this.cart_list_reset();
      this.overlay_clearshoppingcart = false;
    },
    handleResize() {
      // Coalesce resize bursts (rotation, keyboard) into one check per frame
      if (this.resize_frame) return;
      this.resize_frame = window.requestAnimationFrame(() => {
        this.resize_frame = null;
        this.updateMobileView();
      });
    },
    updateMobileView() {
      // Treat any touch-first device whose shorter side is phone-sized as
      // mobile, regardless of orientation or how wide newer phones get.
      const coarsePointer =
        window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
      const shortestSide = Math.min(window.innerWidth, window.innerHeight);
      this.changeMobileView(
        window.innerWidth <= 600 || (coarsePointer && shortestSide <= 600)
      );
    }
  },
  created() {
    document.title = "Carregando...";
    this.resize_frame = null;
    this.updateMobileView();
  },
  mounted() {
    document.title = this.app_title;
    window.addEventListener("resize", this.handleResize, { passive: true });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize, { passive: true });
    window.cancelAnimationFrame(this.resize_frame);
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
  padding: 0 0 var(--app-view-padding);

  // @supports (padding-top: env(safe-area-inset-top)) {
  //   padding-top: calc(var(--app-view-padding) + env(safe-area-inset-top));
  // }

  &:after {
    content: "";
    flex-shrink: 0;
    display: block;
    height: var(--app-view-padding);
  }

  .heading {
    align-items: center;
    background-color: var(--color-ui-background);
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    padding: 24px var(--app-view-padding) rem(40px);
    z-index: 120;

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
  background: var(--color-ui-background);
  color: var(--color-text-placeholder);
  font-weight: $graphene-font-weight-semibold;
  padding: 8px var(--app-view-padding);
  position: sticky;
  text-transform: uppercase;
  top: 0;
  z-index: 100;
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
    color: var(--color-text-paragraph);
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
    &._delete {
      background-color: rgba($color-ui-delete-400, 0.2);
      color: var(--color-ui-delete);

      &:hover:active {
        background-color: var(--color-ui-delete);
        color: var(--color-ui-background);
      }
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

.little-about-info {
  @include graphene-font-style-meta();
  color: var(--color-text-placeholder);
  margin: rem(16px) var(--app-view-padding) 0;

  a:link,
  a:visited {
    color: var(--color-ui-accent);
    // text-decoration: underline;
  }
}

.cart-empty {
  padding: var(--app-view-padding) calc(var(--app-view-padding) * 1.5);

  .cart-empty-illustration {
    width: rem(160px);
    height: auto;
    margin-bottom: rem(20px);

    ._line {
      stroke: var(--color-text-description);
    }
    ._soft {
      stroke: var(--color-ui-separator);
    }
    ._accent-fill {
      fill: var(--color-ui-accent);
    }
    ._bg-fill {
      fill: var(--color-ui-background);
    }
    ._bg-stroke {
      stroke: var(--color-ui-background);
    }
    ._tag {
      animation: cart-empty-float 3.2s ease-in-out infinite;
      transform-box: fill-box;
      transform-origin: center;
    }
    @media (prefers-reduced-motion: reduce) {
      ._tag {
        animation: none;
      }
    }
  }

  .cart-empty-title {
    @include graphene-font-style-interest();
    color: var(--color-text-heading);
  }
  .cart-empty-subtitle {
    @include graphene-font-style-label();
    color: var(--color-text-description);
    margin-top: rem(4px);
  }

  .walkthrough {
    display: flex;
    flex-direction: column;
    gap: rem(10px);
    list-style: none;
    margin-top: rem(24px);
    padding: 0;
    width: 100%;
    max-width: rem(320px);

    li {
      align-items: center;
      background-color: var(--color-ui-listalt);
      border-radius: rem(12px);
      display: flex;
      gap: rem(14px);
      padding: rem(10px) rem(14px);
      text-align: left;
    }
    ._keys {
      display: flex;
      flex-shrink: 0;
      gap: rem(4px);
      justify-content: center;
      width: rem(92px);
    }
    ._text {
      @include graphene-font-style-label();
      color: var(--color-text-paragraph);
    }
  }

  .key-helper {
    align-items: center;
    background-color: var(--color-ui-separator);
    border-radius: rem(6px);
    color: var(--color-text-heading);
    display: inline-flex;
    font-size: rem(15px);
    height: rem(28px);
    justify-content: center;
    min-width: rem(28px);

    &.__accent {
      background-color: var(--color-ui-accent);
      color: var(--color-ui-background);
    }
  }

  .cart-empty-tip {
    @include graphene-font-style-label();
    color: var(--color-text-placeholder);
    margin-top: rem(20px);
    max-width: rem(300px);

    strong {
      color: var(--color-text-description);
      font-weight: 600;
    }
  }
}

// Short screens (e.g. iPhone SE): keep everything visible above the keypad
@media (max-height: 700px) {
  .cart-empty {
    padding-top: rem(12px);
    padding-bottom: rem(12px);

    .cart-empty-illustration {
      width: rem(96px);
      margin-bottom: rem(8px);
    }
    .cart-empty-title {
      font-size: rem(17px);
      line-height: rem(24px);
    }
    .cart-empty-subtitle,
    .cart-empty-tip {
      display: none;
    }
    .walkthrough {
      gap: rem(6px);
      margin-top: rem(12px);

      li {
        padding: rem(6px) rem(12px);
      }
    }
  }
}

@keyframes cart-empty-float {
  0%,
  100% {
    transform: translateY(0) rotate(-6deg);
  }
  50% {
    transform: translateY(-4px) rotate(-2deg);
  }
}

._viewport_desktop {
  .qr_code {
    border-radius: var(--ui-border-radius-regular);
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
