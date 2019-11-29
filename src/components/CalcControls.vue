<template>
  <div class="calc-controls-wrapper">
    <div class="calc-header flex-row">
      <div class="__price flex-grow-1">
        {{
          Number(input_price.value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })
        }}
      </div>
      <div class="__units flex-shrink-0">{{ input_units.value }}un</div>
    </div>
    <div class="calc-controls" ontouchstart="">
      <!-- Interaction -->
      <div
        :class="[
          'calc-key grphn-icon __accent',
          {
            _disabled: is_initial_input_price
          }
        ]"
        style="grid-area: add;"
        @click="add_to_list"
      >
        arrow_up
      </div>
      <div
        class="calc-key grphn-icon __accent"
        style="grid-area: plus;"
        @click="input_units.add(1)"
      >
        plus
      </div>
      <div
        class="calc-key grphn-icon __accent"
        style="grid-area: minus;"
        @click="input_units.remove(1)"
      >
        minus
      </div>
      <div
        class="calc-key __accent"
        style="grid-area: reset;"
        @click="reset_controls"
      >
        {{ is_initial_input_price ? "AC" : "C" }}
      </div>
      <!-- Numbers -->
      <div
        class="calc-key"
        style="grid-area: r3c1;"
        @click="input_price.update(1)"
      >
        1
      </div>
      <div
        class="calc-key"
        style="grid-area: r3c2;"
        @click="input_price.update(2)"
      >
        2
      </div>
      <div
        class="calc-key"
        style="grid-area: r3c3;"
        @click="input_price.update(3)"
      >
        3
      </div>
      <div
        class="calc-key"
        style="grid-area: r2c1;"
        @click="input_price.update(4)"
      >
        4
      </div>
      <div
        class="calc-key"
        style="grid-area: r2c2;"
        @click="input_price.update(5)"
      >
        5
      </div>
      <div
        class="calc-key"
        style="grid-area: r2c3;"
        @click="input_price.update(6)"
      >
        6
      </div>
      <div
        class="calc-key"
        style="grid-area: r1c1;"
        @click="input_price.update(7)"
      >
        7
      </div>
      <div
        class="calc-key"
        style="grid-area: r1c2;"
        @click="input_price.update(8)"
      >
        8
      </div>
      <div
        class="calc-key"
        style="grid-area: r1c3;"
        @click="input_price.update(9)"
      >
        9
      </div>
      <div
        class="calc-key __key-zero"
        style="grid-area: zero;"
        @click="input_price.update(0)"
      >
        <div class="__key-zero-1" style="grid-area: key1;">0</div>
        <div class="__key-zero-2" style="grid-area: key2;">0</div>
      </div>
      <div
        :class="[
          'calc-key grphn-icon',
          {
            _disabled: is_initial_input_price
          }
        ]"
        style="grid-area: erase;"
        @click="input_price.backspace"
      >
        delete_left
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CalcControls",
  data() {
    return {
      input_price: {
        value: "0.00",
        update: key_value => {
          if (key_value == "reset") return (this.input_price.value = "0.00");

          let VALUE = this.input_price.value;
          VALUE = String(VALUE)
            .replace(".", "") // Removing dot
            .replace(/(\d*)/, `$1${key_value}`) // Adding pressed key to end
            .replace(/(\d*)(\d{2})/, "$1.$2") // Adding dot again
            .replace(/(0?)(\d+\.\d*)/, "$2"); // Removing leading zero
          this.input_price.value = VALUE;
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
          this.input_units.value += quantity;
        },
        remove: quantity => {
          if (this.input_units.value == 1)
            return window.console.log("Não pode remover mais");
          if (this.input_units.value >= 1)
            return (this.input_units.value -= quantity);
        },
        reset: () => {
          this.input_units.value = 1;
        }
      }
    };
  },
  computed: {
    is_initial_input_price() {
      return this.input_price.value == "0.00";
    }
  },
  methods: {
    add_to_list() {
      if (this.is_initial_input_price)
        return window.console.log("Digite um valor para adicionar");
      this.$emit("submit", {
        value: this.input_price.value,
        units: this.input_units.value
      });
      this.reset_controls();
    },
    reset_controls() {
      this.input_price.update("reset");
      this.input_units.reset();
    }
  }
};
</script>

<style lang="scss">
@import "@scss/_utils";
@import "@scss/_typography";

.calc-controls-wrapper {
  background-color: var(--color-ui-background);
  border-top: rem(1px) solid var(--color-ui-separator);

  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    padding-bottom: calc(var(--app-view-padding) + env(safe-area-inset-bottom));

    @media (max-width: 414px) and (min-height: 896px) {
      padding-bottom: env(safe-area-inset-bottom);
    }
    @media (max-width: 375px) and (min-height: 812px) {
      padding-bottom: env(safe-area-inset-bottom);
    }
  }

  .calc-header {
    color: var(--color-text-heading);
    padding: rem(8px) calc(var(--app-view-padding) + #{rem(6px)});
    font-weight: $graphene-font-weight-semibold;
    @extend %graphene-font-style-interest;

    @media (min-height: 569px) {
      padding: {
        bottom: rem(16px);
        top: rem(16px);
      }
    }

    .__price,
    .__units {
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

    .calc-key {
      align-items: center;
      background-color: var(--color-ui-separator);
      display: inline-flex;
      font-weight: $graphene-font-weight-regular;
      justify-content: center;
      min-height: rem(48px);
      transition-property: background-color;
      transition-duration: var(--transition-duration-regular);
      transition-timing-function: linear;
      @extend %graphene-font-style-subheading;

      @media (min-height: 569px) {
        min-height: rem(64px);
      }

      &:not(._disabled):hover:active {
        background-color: var(--color-text-placeholder);
        transition-duration: 0ms;
      }

      &.__accent {
        background-color: var(--color-ui-accent);
        color: var(--color-ui-background);

        &:not(._disabled):hover:active {
          background-color: var(--color-text-heading);
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
