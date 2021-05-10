<template>
  <div id="app">
    <div class="title">深度组件DEMO</div>
    <div class="demo-box">
      <div class="d1">
        <VueExchangeDepth
          :marketInfo="marketNowObj"
          :sourceData="sourceData"
          :options="options"
          :lastPrice="lastPrice"
          :lastFormatFial="lastFormatFial"
          @onAccuracyChange="onAccuracyChange"
          @onRowClick="onRowClick"
          @choseChange="choseChange"
        />
      </div>
      <div class="d2">
        <div class="t">参数：</div>
        <div class="form1">
          <div>
            <el-checkbox v-model="isFlash"
              >是否开启闪烁（默认false）</el-checkbox
            >
          </div>
          <div class="info">
            当某一价格(ticks)的数量(lots)有变化时，会闪烁一下
          </div>
        </div>
        <div class="form1">
          <div>
            <el-checkbox v-model="isWindow"
              >是否显示统计浮窗（默认true）</el-checkbox
            >
          </div>
          <div class="info">
            把鼠标放在某一行上会显示一个档位/累计/均价的浮窗
          </div>
        </div>
        <div class="form1">
          <div>
            <el-radio v-model="hoverType" label="left">左边</el-radio>
            <el-radio v-model="hoverType" label="right">右边</el-radio>
          </div>
          <div class="info">统计浮窗显示在左边还是右边</div>
        </div>
        <div class="t mt">事件日志：</div>
        <div class="form1 form2">
          <div v-for="(item, index) in info" :key="index">{{ item }}</div>
        </div>
      </div>
    </div>
    <a
      class="link"
      href="https://github.com/javaLuo/vue-exchange-depth"
      target="_blank"
      rel="noflow"
      >github</a
    >
  </div>
</template>

<script>
// import VueExchangeDepth from "./components/VueExchangeDepth.vue";
import VueExchangeDepth from "vue-exchange-depth";
export default {
  name: "App",
  components: {
    VueExchangeDepth,
  },
  data() {
    return {
      isFlash: true,
      isWindow: true,
      hoverType: "left",
      marketNowObj: {
        zi: "BTC",
        mu: "USDT",
        ziPoint: 8,
        muPoint: 4,
      },
      sourceData: {},
      lastPrice: 0,
      lastFormatFial: "",
      info: [],
    };
  },
  computed: {
    options() {
      return {
        isFlash: this.isFlash,
        hoverType: this.hoverType,
        isHoverInfo: this.isWindow,
      };
    },
  },
  mounted() {
    this.randomData();
  },
  methods: {
    // 深度选择变化
    onAccuracyChange(p) {
      this.info.push(`深度变化：${JSON.stringify(p)}`);
    },
    // 点击某一行
    onRowClick(p, q) {
      this.info.push(`点击了一行：`);
      this.info.push(JSON.stringify(p));
      this.info.push(JSON.stringify(q));
    },
    // 选择了类型
    choseChange(p) {
      this.info.push(`选择了左上角按钮：${JSON.stringify(p)}`);
    },
    random(min, max, isRound) {
      const res = Math.random() * (max - min) + min;
      return isRound ? Math.round(res) : res;
    },
    randomData() {
      const askData = [];
      const bidData = [];
      for (let i = 0; i < 20; i++) {
        askData.push({
          ticks:
            50000 +
            i * 1000 +
            (this.random(1, 10, true) < 9 ? 0 : this.random(10, 100)), // 价格
          lots:
            this.random(1, 10, true) <= 9
              ? i + 1.23456789
              : i + this.random(1, 10), // 数量
          count: this.random(1, 50, true), // 挂单量
        });
        bidData.push({
          ticks:
            49900 -
            i * 1000 -
            (this.random(1, 10, true) < 9 ? 0 : this.random(10, 100)),
          lots:
            this.random(1, 10, true) <= 9
              ? i + 1.23456789
              : i + this.random(1, 10),
          count: this.random(1, 50, true),
        });
      }

      setTimeout(() => {
        this.sourceData = {
          askData,
          bidData,
        };
        this.lastPrice = Math.random() * 100 + 49900;
        this.lastFormatFial = ` ≈ ${(this.lastPrice * 6.4).toFixed(2)} RMB`;
        this.randomData();
      }, 300);
    },
  },
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.title {
  padding: 40px 0 40px 0;
  font-size: 28px;
  font-weight: 600;
}
.demo-box {
  display: flex;
  justify-content: center;

  .d1 {
    flex: none;
    width: 300px;
    height: 500px;
  }

  .d2 {
    text-align: left;
    margin-left: 20px;
    .form1 {
      padding: 10px;
      font-size: 12px;
    }
    .form2{
      max-height: 300px;
      overflow: auto;
    }
    .t {
      font-size: 18px;
      font-weight: 600;
    }
    .mt {
      margin-top: 10px;
    }
  }
}
.link {
  display: block;
  padding: 10px;
  margin-top: 20px;
  color: rgb(32, 102, 252);
  &:active {
    color: rgb(80, 133, 248);
  }
}
</style>
