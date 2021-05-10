<template>
  <div class="depth-select" @mouseup.stop @touchend.stop>
    <div class="depth-input" @click="triggerShow">
      <div>{{ (value && value.label) || "深度合并" }}</div>
      <div :class="['depth-arrow', { show }]"></div>
    </div>
    <div :class="['depth-select-body', { show }]">
      <div class="depth-tri"></div>
      <ul class="depth-options" @click="onDepthChose($event)">
        <li
          :class="['depth-list', { chosed: value.value === item.value }]"
          v-for="item in options"
          :key="item.value"
          :data-label="item.label"
          :data-value="item.value"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "depth-select",
  props: {
    options: { type: Array, default: () => [] },
    value: Object,
  },
  data() {
    return {
      show: false,
    };
  },
  model: {
    prop: "value",
    event: "change",
  },
  mounted() {
    document.addEventListener("mouseup", this.closeShow, false);
    document.addEventListener("touchend", this.closeShow, false);
  },
  beforeDestroy() {
    document.removeEventListener("mouseup", this.closeShow, false);
    document.removeEventListener("touchend", this.closeShow, false);
  },
  methods: {
    onDepthChose(e) {
      this.$emit("change", {
        label: e.target.dataset.label,
        value: e.target.dataset.value,
      });
      this.closeShow();
    },
    triggerShow() {
      this.show = !this.show;
    },
    closeShow() {
      this.show = false;
    },
  },
};
</script>
<style lang="less" scoped>
.depth-select {
  --bg-1: #061826;
  --bg0: #0c2336;
  --bg1: #15364c;
  --bg3: #1f4964;
  --word: #c7cce6;
  --border: #546469;
  --highlight: #00a9cb;

  min-width: 120px;
  height: 22px;
  text-align: right;
  position: relative;
  font-size: 12px;
  color: var(--word);
  .depth-input {
    position: relative;
    padding: 0 4px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border: solid 1px transparent;
    background-color: var(--bg0);
    box-sizing: border-box;
    border-radius: 2px;
    cursor: pointer;
    transition: border 256ms;
    .depth-arrow {
      width: 0;
      height: 0;
      border: solid 4px transparent;
      border-bottom: none;
      border-top-color: var(--border);
      flex: none;
      margin-left: 2px;
      transition: all 256ms;
      &.show {
        transform: rotate(180deg);
      }
    }
    &:hover {
      border: solid 1px var(--highlight);
      .depth-arrow {
        border-top-color: var(--highlight);
      }
    }
  }
  .depth-select-body {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 99;
    padding-top: 10px;
    opacity: 0;
    pointer-events: none;
    transform: translateY(-4px);
    transition: all 256ms;
    &.show {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }
    .depth-tri {
      position: absolute;
      width: 8px;
      height: 8px;
      background-color: var(--bg1);
      top: 6px;
      right: 12px;
      transform: rotate(45deg);
      pointer-events: none;
      box-shadow: 0 0 0 1px var(--bg-1);
      z-index: 1;
    }
    .depth-options {
      position: relative;
      background-color: var(--bg1);
      box-shadow: 0 3px 5px var(--bg-1);
      border-radius: 4px;
      cursor: pointer;
      max-height: 176px;
      overflow-y: auto;
      z-index: 2;
      padding: 0;
      margin: 0;
      list-style: none;
      .depth-list {
        position: relative;
        padding: 2px 4px;
        z-index: 2;
        &.chosed {
          background-color: var(--bg3);
        }
        &:hover {
          background-color: var(--highlight);
          color: #fff;
        }
      }
    }
  }
}
</style>
