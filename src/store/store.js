import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cart_list: JSON.parse(localStorage.getItem("cart_list")) || [],
    cart_list_selected: {},
    cart_list_updates: 0,
    notification_list: [],
    isApp: !!navigator.standalone,
    isMobile: !!/mobile/i.test(navigator.userAgent),
    iOSDevice: !!/iPad|iPhone|iPod/.test(navigator.platform)
  },
  getters: {
    cart_list: ({ cart_list }) => cart_list,
    cart_list_selected: ({ cart_list_selected }) => cart_list_selected,
    cart_list_updates: ({ cart_list_updates }) => cart_list_updates,
    notification_list: ({ notification_list }) => notification_list,
    isApp: ({ isApp }) => isApp,
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
      state.cart_list.push({
        name: payload.name || "",
        units: payload.units || 1,
        price: payload.price,
        selected: false
      });
      localStorage.setItem("cart_list", JSON.stringify(state.cart_list));
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
    cart_list_reset(state) {
      state.cart_list = [];
      localStorage.setItem("cart_list", JSON.stringify(state.cart_list));
      state.cart_list_updates += 1;
    },
    notify(state, payload) {
      clearTimeout(TIMEOUT);
      const DATA = {
        type: payload.type || "",
        description: payload.description,
        duration: payload.duration
      };
      state.notification_list = [DATA];
      const TIMEOUT = setTimeout(() => {
        state.notification_list = [];
      }, payload.duration);
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
    cart_update({ commit, state }, { index, payload }) {
      if (payload.price == "0.00") {
        commit("notify", {
          type: "alert",
          description: "Digite um valor para salvar",
          duration: 3000
        });
      } else {
        commit("cart_update_data", { index, payload });
        setTimeout(() => {
          commit("cart_unselect_all");
          localStorage.setItem("cart_list", JSON.stringify(state.cart_list));
        }, 1);
      }
    },
    cart_remove({ state, commit }, index) {
      state.cart_list.splice(index, 1);
      setTimeout(() => {
        commit("cart_unselect_all");
      }, 1);
      localStorage.setItem("cart_list", JSON.stringify(state.cart_list));
    }
  }
});
