import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cart_list: [
      {
        name: "Leite",
        units: 12,
        price: "2.99",
        selected: false
      },
      {
        name: "Pão",
        units: 3,
        price: "4.70",
        selected: false
      },
      {
        name: "Creme dental",
        units: 2,
        price: "12.80",
        selected: false
      },
      {
        name: "Rosquinhas",
        units: 5,
        price: "0.54",
        selected: false
      }
    ],
    cart_list_selected: {},
    cart_list_updates: 0,
    isMobile: false,
    iOSDevice: !!/iPad|iPhone|iPod/.test(navigator.platform)
  },
  getters: {
    cart_list: ({ cart_list }) => cart_list,
    cart_list_selected: ({ cart_list_selected }) => cart_list_selected,
    cart_list_updates: ({ cart_list_updates }) => cart_list_updates,
    isMobile: ({ isMobile }) => isMobile,
    iOSDevice: ({ iOSDevice }) => iOSDevice
  },
  mutations: {
    cart_unselect_all(state) {
      state.cart_list.forEach(item => {
        item.selected = false;
      });
      state.cart_list_selected = {};
      state.cart_list_updates += 1;
    },
    cart_set_selected(state, INDEX) {
      if (state.cart_list[INDEX].selected) {
        state.cart_list_selected = {
          ...state.cart_list[INDEX],
          index: INDEX
        };
      } else {
        state.cart_list_selected = {};
      }
    },
    cart_add(state, payload) {
      if (payload.price == "0.00") {
        window.console.warn("Digite um valor para adicionar");
        return false;
      } else {
        state.cart_list.push({
          name: payload.name || "",
          units: payload.units || 1,
          price: payload.price,
          selected: false
        });
        return true;
      }
    },
    cart_update_data(state, { index, payload }) {
      state.cart_list[index] = {
        name: payload.name,
        units: payload.units,
        price: payload.price,
        selected: state.cart_list_selected.selected
      };
      state.cart_list_updates += 1;
    },
    changeMobileView(state, boolean) {
      state.isMobile = boolean;
    }
  },
  actions: {
    cart_select({ state, commit }, index) {
      if (!state.cart_list[index]) return false;
      const NEW_STATE = !state.cart_list[index].selected;
      commit("cart_unselect_all");
      state.cart_list[index].selected = NEW_STATE;
      commit("cart_set_selected", index);
      state.cart_list_updates += 1;
    },
    cart_update({ commit }, { index, payload }) {
      commit("cart_update_data", { index, payload });
      setTimeout(() => {
        commit("cart_unselect_all");
      }, 1);
    },
    cart_remove({ state, commit }, index) {
      state.cart_list.splice(index, 1);
      setTimeout(() => {
        commit("cart_unselect_all");
      }, 1);
    }
  }
});
