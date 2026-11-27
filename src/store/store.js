import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const STORAGE_KEY = "cart_list";

let next_id = 1;
let notification_timeout = null;

// Each item gets a stable id so lists can be keyed without re-rendering
// everything when one item changes. Ids are not persisted.
function with_id(item) {
  return {
    id: next_id++,
    name: item.name || "",
    units: item.units || 1,
    price: item.price,
    selected: false
  };
}

function load_cart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved.map(with_id) : [];
  } catch (e) {
    return [];
  }
}

function save_cart(list) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        // Selection is UI state: always stored as unselected
        list.map(({ name, units, price }) => ({
          name,
          units,
          price,
          selected: false
        }))
      )
    );
  } catch (e) {
    // Storage full or blocked (private mode): the app keeps working in memory
  }
}

// Persist the cart after any mutation that changes it
const PERSISTING_MUTATIONS = new Set([
  "cart_add",
  "cart_update_data",
  "cart_remove_item",
  "cart_list_reset",
  "cart_restore"
]);
const persist = store => {
  store.subscribe(({ type }, state) => {
    if (PERSISTING_MUTATIONS.has(type)) save_cart(state.cart_list);
  });
};

export default new Vuex.Store({
  plugins: [persist],
  state: {
    cart_list: load_cart(),
    cart_list_selected: {},
    notification_list: [],
    // What the last remove/clear took out, so it can be undone
    cart_undo: null,
    isMobile: false
  },
  getters: {
    cart_list: ({ cart_list }) => cart_list,
    cart_list_selected: ({ cart_list_selected }) => cart_list_selected,
    cart_units: ({ cart_list }) =>
      cart_list.reduce((sum, item) => sum + item.units, 0),
    cart_total: ({ cart_list }) =>
      cart_list.reduce((sum, item) => sum + item.price * item.units, 0),
    notification_list: ({ notification_list }) => notification_list,
    isMobile: ({ isMobile }) => isMobile
  },
  mutations: {
    cart_unselect_all(state) {
      state.cart_list.forEach(item => {
        if (item.selected) item.selected = false;
      });
      state.cart_list_selected = {};
    },
    cart_set_selected(state, index) {
      const item = state.cart_list[index];
      if (item) item.selected = true;
      state.cart_list_selected = item ? { ...item, index } : {};
    },
    cart_add(state, payload) {
      state.cart_list.push(with_id(payload));
    },
    cart_update_data(state, { index, payload }) {
      const item = state.cart_list[index];
      if (!item) return;
      item.name = payload.name;
      item.units = payload.units;
      item.price = payload.price;
    },
    cart_remove_item(state, index) {
      state.cart_list.splice(index, 1);
    },
    cart_list_reset(state) {
      state.cart_list = [];
    },
    cart_set_undo(state, undo) {
      state.cart_undo = undo;
    },
    cart_restore(state) {
      const undo = state.cart_undo;
      if (!undo) return;
      if (undo.list) {
        state.cart_list = undo.list;
      } else {
        state.cart_list.splice(
          Math.min(undo.index, state.cart_list.length),
          0,
          undo.item
        );
      }
      state.cart_undo = null;
    },
    notify(state, payload) {
      clearTimeout(notification_timeout);
      state.notification_list = [
        {
          type: payload.type || "",
          description: payload.description,
          duration: payload.duration,
          // Optional button, e.g. { label: "Desfazer", action: "cart_undo" }
          button: payload.button || null
        }
      ];
      notification_timeout = setTimeout(() => {
        state.notification_list = [];
      }, payload.duration);
    },
    notification_clear(state) {
      clearTimeout(notification_timeout);
      state.notification_list = [];
    },
    changeMobileView(state, is_mobile) {
      if (state.isMobile !== is_mobile) state.isMobile = is_mobile;
    }
  },
  actions: {
    cart_select({ state, commit }, index) {
      const item = state.cart_list[index];
      if (!item) return false;
      const was_selected = item.selected;
      commit("cart_unselect_all");
      if (!was_selected) commit("cart_set_selected", index);
    },
    cart_update({ commit }, { index, payload }) {
      if (payload.price == "0.00") {
        commit("notify", {
          type: "alert",
          description: "Digite um valor para salvar",
          duration: 3000
        });
      } else {
        commit("cart_update_data", { index, payload });
        commit("cart_unselect_all");
        commit("notify", {
          type: "success",
          description: "Alterações salvas",
          duration: 2000
        });
      }
    },
    cart_remove({ state, commit }, index) {
      const item = state.cart_list[index];
      if (!item) return;
      commit("cart_unselect_all");
      commit("cart_set_undo", { item, index });
      commit("cart_remove_item", index);
      commit("notify", {
        type: "info",
        description: `${item.name || "Item"} removido`,
        duration: 5000,
        button: { label: "Desfazer", action: "cart_undo" }
      });
    },
    cart_clear({ state, commit }) {
      commit("cart_unselect_all");
      commit("cart_set_undo", { list: state.cart_list.slice() });
      commit("cart_list_reset");
      commit("notify", {
        type: "info",
        description: "Carrinho esvaziado",
        duration: 5000,
        button: { label: "Desfazer", action: "cart_undo" }
      });
    },
    cart_undo({ commit }) {
      commit("cart_restore");
      commit("notification_clear");
    }
  }
});
