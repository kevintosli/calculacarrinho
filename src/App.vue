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

      <content
        ref="content"
        class="flex-col flex-grow-1 flex-shrink-1 relative"
      >
        <template v-if="cart_list.length">
          <div class="heading">
            <h1 class="_label text-center">Carrinho</h1>
            <p class="_hint text-center">
              Toque em um item para editar ou remover
            </p>
            <!-- <div class="_icon grphn-icon">questionmark_circle</div> -->
          </div>

          <div class="list-header flex-row flex-shrink-0">
            <div class="item-name">Nome</div>
            <div class="item-un">Un</div>
            <div class="item-price">Subtotal</div>
            <div></div>
          </div>

          <CartList :list="cart_list" />

          <div class="cart-clear flex-row justify-center">
            <HoldButton
              label="Esvaziar carrinho"
              @confirm="cart_clear"
              @too-short="clear_hint"
            />
          </div>

          <div class="little-about-info text-right">
            <p>{{ app_title }} v{{ app_version }}{{ app_version_prefix }}</p>
            <p>Feito com ♥︎ por {{ app_developer }}</p>
            <p>© Copyright {{ current_year }}</p>
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
          </div>
          <!-- <div class="flex-shrink-0" style="height: var(--app-view-padding);" /> -->
        </template>
      </content>

      <CalcControls class="relative pin-b pin-x flex-shrink-0" />
    </template>
  </application>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import CartList from "@components/CartList";
import CalcControls from "@components/CalcControls";
import Notifications from "@components/Notifications";
import Overlay from "@components/Overlay";
import HoldButton from "@components/HoldButton";

export default {
  name: "app",
  components: {
    CartList,
    CalcControls,
    Notifications,
    Overlay,
    HoldButton,
    // Only the desktop screen needs the QR code library: load it on demand
    QRCode: () => import("@chenfengyuan/vue-qrcode")
  },
  data() {
    return {
      overlay_was_app_updated: true
    };
  },
  watch: {
    // Show the item that was just added at the end of the list
    "cart_list.length"(length, previous) {
      if (length > previous) {
        this.$nextTick(() => {
          const content = this.$refs.content;
          if (content) content.scrollTop = content.scrollHeight;
        });
      }
    }
  },
  computed: {
    ...mapGetters(["cart_list", "isMobile"]),
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
    current_year() {
      return new Date().getFullYear();
    },
    app_title() {
      return process.env.VUE_APP_TITLE;
    },
    app_developer() {
      return process.env.VUE_APP_DEVELOPER;
    }
  },
  methods: {
    ...mapMutations(["changeMobileView", "notify"]),
    ...mapActions(["cart_clear"]),
    clear_hint() {
      this.notify({
        type: "info",
        description: "Segure o botão por 2 segundos para esvaziar",
        duration: 2500
      });
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
    flex-direction: column;
    gap: rem(4px);
    flex-shrink: 0;
    padding: 24px var(--app-view-padding) rem(24px);
    z-index: 120;

    ._label {
      color: var(--color-text-heading);
    }
    ._hint {
      color: var(--color-text-placeholder);
      @include graphene-font-style-label();
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

.cart-clear {
  margin: rem(24px) var(--app-view-padding) 0;
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
}

// Very short screens (e.g. iPhone SE): the steps matter more than the drawing
@media (max-height: 600px) {
  .cart-empty .cart-empty-illustration {
    display: none;
  }
}

// Short screens: keep everything visible above the keypad
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
    .cart-empty-subtitle {
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
