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
import socket from "./utils/socket.js";

import VueExchangeDepth from "./components/VueExchangeDepth";
export default {
  name: "App",
  components: {
    VueExchangeDepth,
  },
  data() {
    return {
      isFlash: true,
      isWindow: true,
      isFrontDepth: true,
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
      deep: { value: "1" },
    };
  },
  mounted() {
    this.randomData();
    socket.initSocket();
  },
  beforeDestroy() {
    socket.close();
  },
  methods: {
    // 深度选择变化
    onAccuracyChange(p) {
      this.info.push(`深度变化：${JSON.stringify(p)}`);
      this.deep.value = p.value;
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
            50000.123456789 +
            i * 10 + (this.random(1, 10, true) < 8 ? 0 : this.random(10, 100)) +
             '',// 价格
          lots:
            this.random(1, 10, true) <= 8
              ? i + 1.23456789 + ''
              : i + this.random(1, 10) + '', // 数量
          count: this.random(1, 50, true), // 挂单量
        });
        bidData.push({
          ticks:
            49900 -
            i * 10 -
            (this.random(1, 10, true) < 8 ? 0 : this.random(10, 100)),
          lots:
            this.random(1, 10, true) <= 8
              ? i + 1.23456789
              : i + this.random(1, 10),
          count: this.random(1, 50, true),
        });
      }
      askData.reverse();
      setTimeout(() => {
        this.sourceData = {
          askData,
          bidData,
        };

        this.lastPrice = Math.random() * 100 + 49900;
        this.lastFormatFial = ` ≈ ${(this.lastPrice * 6.4).toFixed(2)} RMB`;
        this.randomData();
      }, 200);
      // askData.push({ticks: '50101.99999999', lots: 8});
      // askData.push({ticks: '50100.99999999', lots: 7});
      // askData.push({ticks: '50011.2123567', lots: 6});
      // askData.push({ticks: '50011.2123123', lots: 5});
      // askData.push({ticks: '50010.1002', lots: 4});
      // askData.push({ticks: '50010.1001', lots: 3});
      // askData.push({ticks: '50000.10000889', lots: 2});
      // askData.push({ticks: '50000.10000888', lots: 1});

      // bidData.push({ticks: '45000.99999999', lots: 1});
      // bidData.push({ticks: '45000.99999998', lots: 2});
      // bidData.push({ticks: '45000.22', lots: 3});
      // bidData.push({ticks: '45000.2123123', lots: 4});
      // bidData.push({ticks: '45000', lots: 5});
      // bidData.push({ticks: '45049', lots: 6});
      // bidData.push({ticks: '45048', lots: 7});
      // bidData.push({ticks: '5047', lots: 8});
      // this.sourceData = {
      //   askData,
      //   bidData,
      // };
    },
    initSocket() {
      socket.initSocket();
    },
  },
  computed: {
    options() {
      return {
        isFlash: this.isFlash,
        hoverType: this.hoverType,
        isHoverInfo: this.isWindow,
        isFrontDepth: this.isFrontDepth,
      };
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
    z-index: 2;
  }

  .d2 {
    text-align: left;
    margin-left: 20px;
    .form1 {
      padding: 10px;
      font-size: 12px;
    }
    .form2 {
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
