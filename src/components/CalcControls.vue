<template>
  <div :class="['calc-controls-wrapper', { _editing: editing }]">
    <div class="calc-header flex-row">
      <div
        :class="[
          'item-name',
          {
            '_initial-value': !input_name.value
          }
        ]"
      >
        <input
          class="_name-input"
          type="text"
          name="item-name"
          v-model="input_name.value"
          placeholder="Nome do item"
          @focus="input_focus"
          @blur="input_blur"
        />
      </div>
      <div class="item-un flex-shrink-0">{{ input_units.value }}</div>
      <div
        :class="[
          'item-price',
          {
            '_initial-value': is_initial_input_price
          }
        ]"
      >
        {{
          Number(input_price.value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })
        }}
      </div>
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
          @click="update_to_list"
        >
          checkmark
        </div>
      </div>
      <div
        class="calc-key"
        style="grid-area: plus;"
        @click="input_units.add(1)"
      >
        <div class="calc-inner-key grphn-icon __accent">plus</div>
      </div>
      <div
        class="calc-key"
        style="grid-area: minus;"
        @click="input_units.remove(1)"
      >
        <div class="calc-inner-key grphn-icon __accent">minus</div>
      </div>
      <div class="calc-key" style="grid-area: reset;">
        <div
          v-if="!editing"
          class="calc-inner-key __accent"
          @click="reset_controls"
        >
          {{
            is_initial_input_price && this.input_units.value == 1 ? "AC" : "C"
          }}
        </div>
        <div
          v-else
          class="calc-inner-key grphn-icon __delete"
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
          @click="input_price.backspace"
        >
          delete_left
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";

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
          if (Number(this.input_price.value) <= 1000) {
            let VALUE = this.input_price.value;
            VALUE = String(VALUE)
              .replace(".", "") // Removing dot
              .replace(/(\d*)/, `$1${key_value}`) // Adding pressed key to end
              .replace(/(\d*)(\d{2})/, "$1.$2") // Adding dot again
              .replace(/(0?)(\d+\.\d*)/g, "$2"); // Removing leading zero
            this.input_price.value = VALUE;
          }
        },
        backspace: () => {
          if (this.input_price.value == 0)
            return window.console.log("Não pode apagar mais");

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
          if (this.input_units.value == 99) return false;
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
    ...mapGetters(["cart_list_selected"]),
    is_initial_input_price() {
      return this.input_price.value == "0.00";
    }
  },
  methods: {
    ...mapMutations(["cart_add", "notify"]),
    ...mapActions(["cart_update", "cart_remove"]),
    add_to_list() {
      if (this.is_initial_input_price) {
        this.notify({
          type: "alert",
          description: "Digite um valor para adicionar à lista",
          duration: 2000
        });
      } else {
        this.cart_add({
          name: this.input_name.value,
          price: this.input_price.value,
          units: this.input_units.value
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
    box-shadow: inset 0 rem(3px) 0 var(--color-ui-accent);
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
