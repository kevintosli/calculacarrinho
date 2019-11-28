<template>
  <div class="calc-controls-wrapper">
    <div class="calc-header flex-row">
      <div class="__price flex-grow-1">
        {{
          input_price.value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })
        }}
      </div>
      <div class="__units flex-shrink-0">{{ input_units.value }}un</div>
    </div>
    <div class="calc-controls" ontouchstart="">
      <!-- Interaction -->
      <div class="calc-key grphn-icon __accent" style="grid-area: add;">arrow_up</div>
      <div class="calc-key grphn-icon __accent" style="grid-area: plus;" @click="input_units.add(1)">plus</div>
      <div class="calc-key grphn-icon __accent" style="grid-area: minus;" @click="input_units.remove(1)">minus</div>
      <div class="calc-key __accent" style="grid-area: total;" @click="reset_controls">AC</div>
      <!-- Numbers -->
      <div class="calc-key" style="grid-area: r3c1;" @click="input_price.update(1)">1</div>
      <div class="calc-key" style="grid-area: r3c2;" @click="input_price.update(2)">2</div>
      <div class="calc-key" style="grid-area: r3c3;" @click="input_price.update(3)">3</div>
      <div class="calc-key" style="grid-area: r2c1;" @click="input_price.update(4)">4</div>
      <div class="calc-key" style="grid-area: r2c2;" @click="input_price.update(5)">5</div>
      <div class="calc-key" style="grid-area: r2c3;" @click="input_price.update(6)">6</div>
      <div class="calc-key" style="grid-area: r1c1;" @click="input_price.update(7)">7</div>
      <div class="calc-key" style="grid-area: r1c2;" @click="input_price.update(8)">8</div>
      <div class="calc-key" style="grid-area: r1c3;" @click="input_price.update(9)">9</div>
      <div class="calc-key __key-zero" style="grid-area: zero;" @click="input_price.update(0)">
        <div class="__key-zero-1" style="grid-area: key1;">0</div>
        <div class="__key-zero-2" style="grid-area: key2;">0</div>
      </div>
      <div class="calc-key grphn-icon" style="grid-area: erase;" @click="input_price.backspace">delete_left</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CalcControls",
  data() {
    return {
      input_price: {
        value: 0,
        update: key_value => {
          if (key_value == "reset") return (this.input_price.value = 0);
          key_value = key_value / 100;
          this.input_price.value = this.input_price.value * 10;
          this.input_price.value += key_value;
          this.input_price.value.toFixed(2);
        },
        backspace: () => {
          if (this.input_price.value == 0) return window.console.log("Não pode apagar mais");
          // let LAST_DIGIT = String(this.input_price.value).slice(-1);
          window.console.log("Actual value:", this.input_price.value);
          window.console.log("Length:", String(this.input_price.value).length);
          // this.input_price.value -= LAST_DIGIT / 100;
        }
      },
      input_units: {
        value: 1,
        add: quantity => {
          this.input_units.value += quantity;
        },
        remove: quantity => {
          if (this.input_units.value == 1) return window.console.log("Não pode remover mais");
          if (this.input_units.value >= 1) return (this.input_units.value -= quantity);
        },
        reset: () => {
          this.input_units.value = 1;
        }
      }
    };
  },
  methods: {
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
    @extend %graphene-font-style-subheading;

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
      "r1c1 r1c2 r1c3 add"
      "r2c1 r2c2 r2c3 plus"
      "r3c1 r3c2 r3c3 minus"
      "zero zero erase total";
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
      transition-timing-function: var(--transition-timing-ease_out);
      @extend %graphene-font-style-subheading;

      @media (min-height: 569px) {
        min-height: rem(64px);
      }

      &:hover:active {
        background-color: var(--color-text-placeholder);
        transition-duration: 0ms;
      }

      &.__accent {
        background-color: var(--color-ui-accent);
        color: var(--color-ui-background);
        &:hover:active {
          background-color: var(--color-text-heading);
        }
      }
      &.__highlight {
        background-color: var(--color-ui-highlight);
        color: var(--color-ui-background);
        &:hover:active {
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
