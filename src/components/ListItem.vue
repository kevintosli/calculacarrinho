<template>
  <li class="flex-row">
    <div class="item-name">{{ item.name || "Sem nome" }}</div>
    <div class="item-un">{{ item.units }}</div>
    <div class="item-price">
      {{
        item.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        })
      }}
    </div>
  </li>
</template>

<script>
export default {
  name: "ListItem",
  props: {
    item: {
      title: {
        type: String,
        required: false
      },
      units: {
        type: Number,
        default: 1
      },
      price: {
        type: Number,
        required: true
      }
    }
  }
};
</script>
