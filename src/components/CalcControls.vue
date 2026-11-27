<template>
  <div
    :class="['calc-controls-wrapper', { _editing: editing }]"
    @dblclick="no_return"
  >
    <div v-if="editing" class="calc-status _editing flex-row">
      <div class="_label">
        Editando
        <strong>{{ cart_list_selected.name || "item sem nome" }}</strong>
      </div>
      <button type="button" class="_action" @click="cart_unselect_all">
        Cancelar
      </button>
    </div>
    <div v-else-if="cart_units" class="calc-status flex-row">
      <div class="_label">
        {{ cart_units }} {{ cart_units === 1 ? "item" : "itens" }} no carrinho
      </div>
      <div class="_value">{{ cart_total_label }}</div>
    </div>

    <div class="calc-header flex-row">
      <div
        :class="[
          'item-name',
          {
            '_initial-value': !input_name.value
          }
        ]"
      >
        <label class="calc-caption" for="calc-item-name">
          Produto <span class="_optional">(opcional)</span>
        </label>
        <form autocomplete="false" action="#" @submit.prevent="input_get_blur">
          <input
            class="_name-input"
            type="text"
            id="calc-item-name"
            name="product"
            ref="item_name"
            v-model="input_name.value"
            placeholder="Nome do item"
            enterkeyhint="done"
            autocomplete="off"
            @focus="input_focus"
            @blur="input_blur"
          />
        </form>
      </div>
      <div class="item-un flex-shrink-0">
        <div class="calc-caption">Qtd.</div>
        <div aria-live="polite">{{ input_units.value }}</div>
      </div>
      <div
        :class="[
          'item-price',
          {
            '_initial-value': is_initial_input_price
          }
        ]"
      >
        <div class="calc-caption">
          {{ input_units.value > 1 ? "Preço un." : "Preço" }}
        </div>
        <div aria-live="polite">{{ input_price_label }}</div>
      </div>
    </div>
    <div
      v-if="input_units.value > 1 && !is_initial_input_price"
      class="calc-subtotal"
    >
      {{ input_units.value }} × {{ input_price_label }} =
      <strong>{{ input_subtotal_label }}</strong>
    </div>
    <div class="calc-controls" ontouchstart="">
      <!-- Interaction -->
      <div class="calc-key" style="grid-area: add;">
        <div
          :class="[
            'calc-inner-key grphn-icon __accent',
            { _invisible: editing }
          ]"
          key="add"
          role="button"
          aria-label="Adicionar ao carrinho"
          title="Adicionar ao carrinho"
          @click="add_to_list"
        >
          arrow_up
        </div>
        <div
          :class="[
            'calc-inner-key grphn-icon __accent',
            { _invisible: !editing }
          ]"
          key="save"
          role="button"
          aria-label="Salvar alterações"
          title="Salvar alterações"
          @click="update_to_list"
        >
          checkmark
        </div>
      </div>
      <div
        class="calc-key"
        style="grid-area: plus;"
        title="Aumentar quantidade"
        @click="input_units.add(1)"
      >
        <div
          class="calc-inner-key grphn-icon __accent"
          role="button"
          aria-label="Aumentar quantidade"
        >
          plus
        </div>
      </div>
      <div
        class="calc-key"
        style="grid-area: minus;"
        title="Diminuir quantidade"
        @click="input_units.remove(1)"
      >
        <div
          class="calc-inner-key grphn-icon __accent"
          role="button"
          aria-label="Diminuir quantidade"
        >
          minus
        </div>
      </div>
      <div class="calc-key" style="grid-area: reset;">
        <div
          v-if="!editing"
          class="calc-inner-key __accent"
          role="button"
          aria-label="Limpar valores digitados"
          title="Limpar valores digitados"
          @click="reset_controls"
        >
          {{
            is_initial_input_units &&
            is_initial_input_price &&
            is_initial_input_name
              ? "AC"
              : "C"
          }}
        </div>
        <div
          v-else
          class="calc-inner-key grphn-icon __delete"
          role="button"
          aria-label="Remover item do carrinho"
          title="Remover item do carrinho"
          @click="remove_from_list"
        >
          trashcan
        </div>
      </div>
      <!-- Numbers -->
      <div class="calc-key" style="grid-area: r3c1;">
        <div class="calc-inner-key" @click="input_price.update(1)">1</div>
      </div>
      <div class="calc-key" style="grid-area: r3c2;">
        <div class="calc-inner-key" @click="input_price.update(2)">2</div>
      </div>
      <div class="calc-key" style="grid-area: r3c3;">
        <div class="calc-inner-key" @click="input_price.update(3)">3</div>
      </div>
      <div class="calc-key" style="grid-area: r2c1;">
        <div class="calc-inner-key" @click="input_price.update(4)">4</div>
      </div>
      <div class="calc-key" style="grid-area: r2c2;">
        <div class="calc-inner-key" @click="input_price.update(5)">5</div>
      </div>
      <div class="calc-key" style="grid-area: r2c3;">
        <div class="calc-inner-key" @click="input_price.update(6)">6</div>
      </div>
      <div class="calc-key" style="grid-area: r1c1;">
        <div class="calc-inner-key" @click="input_price.update(7)">7</div>
      </div>
      <div class="calc-key" style="grid-area: r1c2;">
        <div class="calc-inner-key" @click="input_price.update(8)">8</div>
      </div>
      <div class="calc-key" style="grid-area: r1c3;">
        <div class="calc-inner-key" @click="input_price.update(9)">9</div>
      </div>
      <div class="calc-key __key-zero" style="grid-area: zero;">
        <div class="calc-inner-key" @click="input_price.update(0)">
          <div class="__key-zero-1" style="grid-area: key1;">0</div>
          <div class="__key-zero-2" style="grid-area: key2;">0</div>
        </div>
      </div>
      <div class="calc-key" style="grid-area: erase;">
        <div
          :class="['calc-inner-key grphn-icon']"
          role="button"
          aria-label="Apagar último dígito"
          title="Apagar último dígito"
          @click="input_price.backspace"
        >
          delete_left
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { no_return } from "@js/utils";
import { mapMutations, mapGetters, mapActions } from "vuex";
import { format_brl } from "@js/currency";

export default {
  name: "CalcControls",
  data() {
    return {
      editing: false,
      input_name: {
        value: "",
        focus: false
      },
      input_price: {
        value: "0.00",
        update: key_value => {
          if (key_value == "reset") return (this.input_price.value = "0.00");
          if (Number(this.input_price.value) > 1000) {
            return this.notify({
              type: "alert",
              description: "Esse é o maior preço que dá para digitar",
              duration: 2500
            });
          }
          let VALUE = this.input_price.value;
          VALUE = String(VALUE)
            .replace(".", "") // Removing dot
            .replace(/(\d*)/, `$1${key_value}`) // Adding pressed key to end
            .replace(/(\d*)(\d{2})/, "$1.$2") // Adding dot again
            .replace(/(0?)(\d+\.\d*)/g, "$2"); // Removing leading zero
          this.input_price.value = VALUE;
        },
        backspace: () => {
          if (this.input_price.value == 0) return;

          let VALUE = this.input_price.value;
          VALUE = String(VALUE)
            .replace(".", "") // Removing dot
            .replace(/(\d*)(\d{1})/, "$1"); // Removing last char
          if (VALUE.length <= 2) {
            VALUE = String(VALUE).replace(/(\d*)/, "0$1"); // Adding leading zero
          }
          VALUE = String(VALUE).replace(/(\d*)(\d{2})/, "$1.$2"); // Adding dot again
          this.input_price.value = VALUE;
        }
      },
      input_units: {
        value: 1,
        add: quantity => {
          if (this.input_units.value == 99) {
            return this.notify({
              type: "alert",
              description: "A quantidade máxima é 99",
              duration: 2500
            });
          }
          this.input_units.value += quantity;
        },
        remove: quantity => {
          if (this.input_units.value == 1) return false;
          if (this.input_units.value >= 1)
            return (this.input_units.value -= quantity);
        },
        reset: () => {
          this.input_units.value = 1;
        }
      }
    };
  },
  watch: {
    cart_list_selected(NEW) {
      if (NEW.selected) {
        this.set_editing();
      } else {
        this.unset_editing();
      }
    }
  },
  computed: {
    ...mapGetters(["cart_list_selected", "cart_units", "cart_total"]),
    input_price_label() {
      return format_brl(this.input_price.value);
    },
    input_subtotal_label() {
      return format_brl(this.input_price.value * this.input_units.value);
    },
    cart_total_label() {
      return format_brl(this.cart_total);
    },
    is_initial_input_name() {
      return this.input_name.value === "";
    },
    is_initial_input_price() {
      return this.input_price.value == "0.00";
    },
    is_initial_input_units() {
      return this.input_units.value == 1;
    }
  },
  methods: {
    no_return,
    ...mapMutations(["cart_add", "cart_unselect_all", "notify"]),
    ...mapActions(["cart_update", "cart_remove"]),
    add_to_list() {
      if (this.is_initial_input_price) {
        this.notify({
          type: "alert",
          description: "Digite o preço no teclado para adicionar",
          duration: 2000
        });
      } else {
        const name = this.input_name.value.trim();
        this.cart_add({
          name,
          price: this.input_price.value,
          units: this.input_units.value
        });
        this.notify({
          type: "success",
          description: `${name || "Item"} adicionado ao carrinho`,
          duration: 2000
        });
        this.reset_controls();
      }
    },
    update_to_list() {
      const PAYLOAD = {
        name: this.input_name.value,
        units: this.input_units.value,
        price: this.input_price.value
      };
      this.cart_update({
        index: this.cart_list_selected.index,
        payload: PAYLOAD
      });
    },
    remove_from_list() {
      this.cart_remove(this.cart_list_selected.index);
    },
    reset_controls() {
      this.input_name.value = "";
      this.input_price.update("reset");
      this.input_units.reset();
    },
    set_editing() {
      this.input_name.value = this.cart_list_selected.name;
      this.input_units.value = this.cart_list_selected.units;
      this.input_price.value = this.cart_list_selected.price;
      this.editing = true;
    },
    unset_editing() {
      this.input_name.value = "";
      this.input_units.value = 1;
      this.input_price.value = "0.00";
      this.editing = false;
    },
    input_focus() {
      this.input_name.focus = true;
    },
    input_blur() {
      this.input_name.value.trim();
      this.input_name.focus = false;
    },
    input_get_blur() {
      this.$refs.item_name.blur();
    }
  }
};
</script>

<style lang="scss">
@import "@scss/_utils";
@import "@scss/_typography";
@import "@scss/variables";

.calc-controls-wrapper {
  background-color: var(--color-ui-background);
  box-shadow: inset 0 rem(1px) 0 var(--color-ui-separator);
  z-index: 100;

  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    padding-bottom: calc(var(--app-view-padding) + env(safe-area-inset-bottom));

    @media (max-width: 414px) and (min-height: 896px) {
      padding-bottom: env(safe-area-inset-bottom);
    }
    @media (max-width: 375px) and (min-height: 812px) {
      padding-bottom: env(safe-area-inset-bottom);
    }
  }

  &._editing {
    --color-ui-background: var(--color-ui-background-secondary);
    // box-shadow: inset 0 rem(3px) 0 var(--color-ui-accent);
  }

  .calc-status {
    align-items: center;
    background-color: var(--color-ui-listalt);
    color: var(--color-text-description);
    gap: rem(12px);
    min-height: rem(40px);
    padding: 0 calc(var(--app-view-padding) + #{rem(4px)});
    @include graphene-font-style-label();

    ._label {
      flex-grow: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      strong {
        color: var(--color-text-heading);
        font-weight: $graphene-font-weight-semibold;
      }
    }
    ._value {
      color: var(--color-text-heading);
      flex-shrink: 0;
      font-variant-numeric: tabular-nums;
      font-weight: $graphene-font-weight-semibold;
    }
    ._action {
      -webkit-appearance: none;
      background-color: var(--color-ui-separator);
      border: 0;
      border-radius: var(--ui-border-radius-circular);
      color: var(--color-text-heading);
      cursor: pointer;
      flex-shrink: 0;
      font: inherit;
      font-weight: $graphene-font-weight-semibold;
      padding: rem(4px) rem(14px);
    }
    &._editing {
      background-color: var(--color-ui-accent);
      color: var(--color-ui-background);

      ._label strong {
        color: inherit;
      }
      ._action {
        background-color: var(--color-ui-background);
        color: var(--color-text-heading);
      }
    }
  }

  // Very short screens: the running total is also at the end of the list
  @media (max-height: 600px) {
    .calc-status:not(._editing) {
      display: none;
    }
  }

  .calc-caption {
    color: var(--color-text-placeholder);
    display: block;
    @include graphene-font-style-meta();
    font-weight: $graphene-font-weight-semibold;
    letter-spacing: 0.04em;
    line-height: rem(16px);
    text-transform: uppercase;

    ._optional {
      font-weight: $graphene-font-weight-regular;
      text-transform: none;
    }
  }

  .calc-subtotal {
    color: var(--color-text-description);
    margin-top: rem(-8px);
    padding: 0 calc(var(--app-view-padding) + #{rem(4px)}) rem(8px);
    text-align: right;
    font-variant-numeric: tabular-nums;
    @include graphene-font-style-label();

    strong {
      color: var(--color-text-heading);
      font-weight: $graphene-font-weight-semibold;
    }
  }

  .calc-header {
    color: var(--color-text-heading);
    padding: rem(8px) calc(var(--app-view-padding) + #{rem(4px)});
    font-weight: $graphene-font-weight-semibold;

    @media (max-height: 568px) {
      @include graphene-font-style-paragraph();
      font-weight: $graphene-font-weight-semibold;
      line-height: rem(36px);
    }
    @media (min-height: 569px) {
      @include graphene-font-style-interest();
      font-size: rem(18px);
      padding: {
        bottom: rem(16px);
        top: rem(16px);
      }
    }

    ._initial-value {
      color: var(--color-text-placeholder);
    }
    ._name-input {
      -webkit-box-shadow: inset 0 0 0 999px var(--color-ui-background) !important;
      color: var(--color-text-heading);
      width: 100%;

      &::placeholder {
        color: var(--color-text-placeholder);
      }
    }
    .item-name,
    .item-un,
    .item-price {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .calc-controls {
    border-radius: var(--app-view-padding);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    grid-template-areas:
      "r1c1 r1c2 r1c3 reset"
      "r2c1 r2c2 r2c3 plus"
      "r3c1 r3c2 r3c3 minus"
      "zero zero erase add";
    grid-gap: rem(2px);
    margin: 0 var(--app-view-padding);
    overflow: hidden;
    transform: translate3d(0, 0, 0);

    .calc-key {
      font-size: $graphene-font-size-interest;
      font-weight: $graphene-font-weight-regular;
      min-height: rem(48px);
      position: relative;
      transform: translate3d(0, 0, 0);

      @media (max-height: 568px) {
        @include graphene-font-style-interest();
        font-weight: $graphene-font-weight-regular;
      }
      @media (min-height: 569px) {
        @include graphene-font-style-subheading();
        min-height: rem(64px);
        font-weight: $graphene-font-weight-regular;
      }

      .calc-inner-key {
        align-items: center;
        background-color: var(--color-ui-separator);
        bottom: 0;
        display: inline-flex;
        justify-content: center;
        left: 0;
        right: 0;
        position: absolute;
        top: 0;
        transform: translate3d(0, 0, 0);
        transition-property: background-color;
        transition-duration: var(--motion-duration-regular);
        transition-timing-function: linear;

        &:not(._disabled):hover:active {
          background-color: var(--color-text-placeholder);
          transition-duration: 0ms;
        }
        &._invisible {
          position: absolute;
          visibility: hidden;
        }
        &:not(._invisible) {
          animation: pulse;
          animation-duration: var(--motion-duration-regular);
          animation-iteration-count: 1;
          animation-play-state: running;
          font-size: inherit;
          visibility: visible;

          @keyframes pulse {
            from {
              font-size: rem(32px);
            }
            to {
              font-size: rem(24px);
            }
          }
        }
        &.__accent {
          background-color: var(--color-ui-accent);
          color: var(--color-ui-background);

          &:not(._disabled):hover:active {
            background-color: var(--color-text-heading);
          }
        }
        &.__delete {
          background-color: var(--color-ui-delete);
          color: var(--color-ui-background);

          &:not(._disabled):hover:active {
            background-color: var(--color-text-heading);
          }
        }
      }
    }

    .__key-zero {
      display: inline-grid;
      grid-template-columns: 1fr 1fr;
      grid-template: "key1 key2";
      grid-gap: rem(8px);
      justify-content: stretch;

      div {
        flex-grow: 1;
        text-align: center;
        width: 100%;
      }
      .__key-zero-2 {
        color: transparent;
      }
    }
  }
}
</style>
