<template>
  <div
    :class="[
      'calc-controls-wrapper',
      { _editing: editing, _typing: input_name.focus }
    ]"
    @dblclick="no_return"
  >
    <!-- Cancel / product field / confirm -->
    <div class="calc-actions">
      <button
        type="button"
        class="tq-round-button"
        :aria-label="editing ? 'Cancelar edição' : 'Limpar valores digitados'"
        :title="editing ? 'Cancelar edição' : 'Limpar'"
        @click="close_action"
      >
        <span class="ms" aria-hidden="true">close</span>
      </button>

      <div class="calc-field">
        <button
          type="button"
          class="_keyboard"
          aria-label="Digitar o nome do produto"
          title="Digitar o nome do produto"
          @click="focus_name"
        >
          <span class="ms" aria-hidden="true">keyboard</span>
        </button>
        <form
          class="_name"
          autocomplete="off"
          action="#"
          @submit.prevent="input_get_blur"
        >
          <input
            id="calc-item-name"
            ref="item_name"
            class="_name-input"
            type="text"
            name="product"
            v-model="input_name.value"
            aria-label="Nome do produto (opcional)"
            enterkeyhint="done"
            autocomplete="off"
            @focus="input_focus"
            @blur="input_blur"
          />
        </form>
        <div
          :class="['_price', { _empty: is_initial_input_price }]"
          aria-live="polite"
        >
          <span>R$</span>
          <span>{{ input_amount_label }}</span>
        </div>
      </div>

      <button
        type="button"
        class="tq-round-button"
        :aria-label="editing ? 'Salvar alterações' : 'Adicionar ao carrinho'"
        :title="editing ? 'Salvar alterações' : 'Adicionar ao carrinho'"
        @click="confirm_action"
      >
        <span class="ms" aria-hidden="true">check</span>
      </button>
    </div>

    <!-- Hidden while the phone keyboard is open for the product name -->
    <transition
      :css="false"
      @before-enter="keypad_before_enter"
      @enter="keypad_enter"
      @after-enter="keypad_after"
      @before-leave="keypad_before_leave"
      @leave="keypad_leave"
      @after-leave="keypad_after"
    >
      <div v-show="!input_name.focus" class="calc-keypad">
        <div class="calc-pad" ontouchstart="">
          <div class="calc-grid">
            <!-- Quantity: right column, all four rows -->
            <div class="calc-stepper" role="group" aria-label="Quantidade">
              <button
                type="button"
                class="calc-key _step"
                aria-label="Aumentar quantidade"
                title="Aumentar quantidade"
                @click="input_units.add(1)"
              >
                <span class="ms" aria-hidden="true">keyboard_arrow_up</span>
              </button>
              <span class="_units" aria-live="polite">
                {{ input_units.value }}
              </span>
              <button
                type="button"
                :class="['calc-key _step', { _muted: is_initial_input_units }]"
                aria-label="Diminuir quantidade"
                title="Diminuir quantidade"
                @click="input_units.remove(1)"
              >
                <span class="ms" aria-hidden="true">keyboard_arrow_down</span>
              </button>
            </div>

            <button
              v-for="digit in [7, 8, 9, 4, 5, 6, 1, 2, 3]"
              :key="digit"
              type="button"
              class="calc-key _digit"
              @click="input_price.update(digit)"
            >
              {{ digit }}
            </button>

            <button
              v-if="editing"
              type="button"
              class="calc-key _delete"
              aria-label="Remover produto do carrinho"
              title="Remover produto do carrinho"
              @click="remove_from_list"
            >
              <span class="ms" aria-hidden="true">delete</span>
            </button>
            <span v-else class="calc-key _digit _muted" aria-hidden="true">
              ·
            </span>
            <button
              type="button"
              class="calc-key _digit"
              @click="input_price.update(0)"
            >
              0
            </button>
            <button
              type="button"
              :class="['calc-key', { _muted: is_initial_input_price }]"
              aria-label="Apagar último dígito"
              title="Apagar último dígito"
              @click="input_price.backspace"
            >
              <span class="ms" aria-hidden="true">backspace</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { no_return } from "@js/utils";
import { mapMutations, mapGetters, mapActions } from "vuex";
import { format_amount } from "@js/currency";

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
    ...mapGetters(["cart_list_selected"]),
    input_amount_label() {
      return format_amount(this.input_price.value);
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
    // Keypad show/hide: animate the height of the outer box (the keys keep
    // their size) together with a fade
    keypad_animate(el, from, to, done) {
      const reduce =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return done();
      el.style.overflow = "hidden";
      el.style.height = `${from.height}px`;
      el.style.opacity = from.opacity;
      el.style.transform = `translateY(${from.y}px)`;
      void el.offsetHeight; // apply the start values before transitioning
      el.style.transition =
        "height 260ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 200ms ease, transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1)";
      el.style.height = `${to.height}px`;
      el.style.opacity = to.opacity;
      el.style.transform = `translateY(${to.y}px)`;
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        el.removeEventListener("transitionend", on_end);
        done();
      };
      const on_end = event => {
        if (event.target === el && event.propertyName === "height") finish();
      };
      el.addEventListener("transitionend", on_end);
      setTimeout(finish, 400); // in case transitionend never fires
    },
    keypad_before_enter(el) {
      el.style.height = "0px";
      el.style.opacity = 0;
    },
    keypad_enter(el, done) {
      el.style.height = "";
      const height = el.scrollHeight;
      this.keypad_animate(
        el,
        { height: 0, opacity: 0, y: 12 },
        { height, opacity: 1, y: 0 },
        done
      );
    },
    keypad_before_leave(el) {
      el.style.height = `${el.offsetHeight}px`;
    },
    keypad_leave(el, done) {
      this.keypad_animate(
        el,
        { height: el.offsetHeight, opacity: 1, y: 0 },
        { height: 0, opacity: 0, y: 12 },
        done
      );
    },
    keypad_after(el) {
      el.style.height = "";
      el.style.opacity = "";
      el.style.overflow = "";
      el.style.transform = "";
      el.style.transition = "";
    },
    no_return,
    ...mapMutations(["cart_add", "cart_unselect_all", "notify"]),
    ...mapActions(["cart_update", "cart_remove"]),
    // ✕: cancel the edit, or clear what was typed
    close_action() {
      if (this.editing) {
        this.cart_unselect_all();
      } else {
        this.reset_controls();
      }
    },
    // ✓: save the edit, or add a new product
    confirm_action() {
      if (this.editing) {
        this.update_to_list();
      } else {
        this.add_to_list();
      }
    },
    focus_name() {
      this.$refs.item_name.focus();
    },
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
          description: `${name || "Produto"} adicionado ao carrinho`,
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
      this.input_name.value = this.input_name.value.trim();
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
  display: flex;
  flex-direction: column;
  gap: rem(16px);
  padding: rem(8px) rem(24px) rem(24px);
  position: relative;
  z-index: 100;

  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    padding-bottom: calc(#{rem(16px)} + env(safe-area-inset-bottom));
  }

  // Soft dimming towards the bottom of the screen, as in the design
  &::before {
    background: linear-gradient(to bottom, transparent, var(--tq-dim));
    bottom: 0;
    content: "";
    height: rem(371px);
    left: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    z-index: -1;
  }

  button {
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
    background: none;
    border: 0;
    color: inherit;
    cursor: pointer;
    font: inherit;
    padding: 0;
    touch-action: manipulation;
  }
  button:focus-visible {
    outline: rem(2px) solid var(--tq-fg);
    outline-offset: rem(2px);
  }
}

.calc-actions {
  align-items: center;
  display: flex;
  gap: rem(12px);
  padding: 0 rem(8px);

  .tq-round-button {
    align-items: center;
    background-color: var(--tq-card);
    border-radius: 50%;
    box-shadow: var(--tq-shadow);
    color: var(--tq-fg);
    display: flex;
    flex-shrink: 0;
    height: rem(56px);
    justify-content: center;
    transition: transform 120ms ease;
    width: rem(56px);

    .ms {
      font-variation-settings: "FILL" 0, "wght" 280, "GRAD" 150, "opsz" 28;
    }
    &:active {
      transform: scale(0.94);
    }
  }
}

.calc-field {
  align-items: center;
  background-color: var(--tq-card);
  border-radius: var(--tq-radius-panel);
  box-shadow: var(--tq-shadow);
  display: flex;
  flex: 1 1 0;
  gap: rem(4px);
  min-width: 0;
  padding: rem(4px);

  ._keyboard {
    align-items: center;
    border-radius: 50%;
    color: var(--tq-fg);
    display: flex;
    flex-shrink: 0;
    height: rem(48px);
    justify-content: center;
    width: rem(48px);

    .ms {
      font-variation-settings: "FILL" 0, "wght" 280, "GRAD" -50, "opsz" 28;
    }
    &:active {
      background-color: var(--tq-holo);
    }
  }
  ._name {
    flex: 1 1 0;
    min-width: 0;
  }
  ._name-input {
    -webkit-appearance: none;
    background: transparent;
    border: 0;
    color: var(--tq-fg);
    font: inherit;
    font-size: rem(16px);
    line-height: 1.6;
    outline: none;
    padding: 0;
    text-overflow: ellipsis;
    width: 100%;

    &::placeholder {
      color: var(--tq-fg-disabled);
    }
  }
  ._price {
    color: var(--tq-fg);
    display: flex;
    flex-shrink: 0;
    font-size: rem(16px);
    font-variant-numeric: tabular-nums;
    gap: rem(4px);
    line-height: 1.6;
    padding: 0 rem(8px);
    white-space: nowrap;

    &._empty {
      color: var(--tq-fg-disabled);
    }
  }
}

.calc-pad {
  background-color: var(--tq-card);
  border-radius: var(--tq-radius-panel);
  box-shadow: var(--tq-shadow);
  margin: rem(1px);
  padding: rem(12px);
}

.calc-grid {
  --key-height: #{rem(48px)};
  display: grid;
  gap: rem(8px);
  grid-template-columns: repeat(3, minmax(0, 1fr)) rem(48px);
  grid-template-rows: repeat(4, var(--key-height));

  @media (max-height: 640px) {
    --key-height: #{rem(40px)};
  }
}

.calc-key {
  align-items: center;
  border-radius: rem(9999px);
  color: var(--tq-fg);
  display: flex;
  justify-content: center;
  transition: background-color 120ms ease;

  &:active {
    background-color: var(--tq-holo);
  }
  &._digit {
    font-family: "Roboto Flex", $graphene-font-family;
    font-size: rem(20px);
    font-variant-numeric: tabular-nums;
  }
  &._muted {
    color: var(--tq-fg-disabled);
  }
  &._delete {
    color: var(--tq-destructive);
  }
  .ms {
    font-variation-settings: "FILL" 0, "wght" 280, "GRAD" 0, "opsz" 28;
  }
}

.calc-stepper {
  align-items: center;
  background-color: var(--tq-holo);
  border-radius: rem(9999px);
  display: flex;
  flex-direction: column;
  grid-column: 4;
  grid-row: 1 / span 4;
  justify-content: space-between;
  padding: 0 rem(4px);

  ._step {
    height: rem(44px);
    width: 100%;
  }
  ._units {
    color: var(--tq-fg);
    font-family: "Roboto Flex", $graphene-font-family;
    font-size: rem(16px);
    font-variant-numeric: tabular-nums;
  }
}

@media (max-height: 640px) {
  .calc-controls-wrapper {
    gap: rem(12px);
    padding-left: rem(16px);
    padding-right: rem(16px);
  }
  .calc-actions .tq-round-button {
    height: rem(48px);
    width: rem(48px);
  }
  .calc-field ._keyboard {
    height: rem(40px);
    width: rem(40px);
  }
  .calc-stepper ._step {
    height: rem(36px);
  }
}
</style>
