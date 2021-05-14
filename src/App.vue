<template>
  <div :class="['deep-box-com', `type-${chose}`]">
    <div class="head">
      <ul class="type-btns">
        <li @click="onChoseType('center')" />
        <li @click="onChoseType('ask')" />
        <li @click="onChoseType('bid')" />
      </ul>
      <!-- 深度合并下拉选框 -->
      <DepthSelect :options="depthMinMax" v-model="depthChoseState" />
    </div>
    <ul class="data-box-title">
      <li>价格({{ mu }})</li>
      <li>数量({{ zi }})</li>
      <li>累计({{ zi }})</li>
    </ul>
    <div
      ref="askul"
      :class="['data-box ask', { show }]"
      @mouseover="askOver($event)"
      @mouseleave="onLeave"
    >
      <ul>
        <li
          v-for="(item, index) in askDataShow"
          :key="index"
          :data-i="askDataShow.length - index"
          @click="onRowClick(item, marketInfo)"
          :class="{ h: !op.isHoverInfo }"
        >
          <template>
            <span>{{ item.ticks | formatNumber(muPoint) }}</span>
            <span
              :class="{
                flashUp: item.lots > flashData[item.ticks],
                flashDown: item.lots < flashData[item.ticks],
              }"
              >{{ item.lots | formatNumber(ziPoint) }}</span
            >
            <span>{{ item.total | formatNumber(ziPoint) }}</span>
            <div
              class="percent show-sell-percent"
              :style="`width:${(item.total / maxTotal) * 100}%`"
            ></div>
          </template>
        </li>
        <li
          v-if="op.isHoverInfo"
          :class="['hover-li', { show: askOverShow }]"
          :style="`height:${askOverIndex * 22}px`"
        ></li>
      </ul>
      <!-- 浮动牌子 ask -->
      <div
        v-if="op.isHoverInfo"
        :class="[
          'hover-info',
          { right: op.hoverType === 'right' },
          { show: askOverShow },
        ]"
        :style="`transform:translateY(calc(50% - ${askOverIndex * 22}px))`"
      >
        <div>
          <span>档位:</span>
          <span>{{ askOverIndex }}</span>
        </div>
        <div>
          <span>累计({{ zi }}):</span>
          <span>{{ overAskNum[0] }}</span>
        </div>
        <div>
          <span>均价({{ mu }}):</span>
          <span>≈ {{ overAskNum[1] }}</span>
        </div>
      </div>
    </div>
    <div class="middle-box">
      <span :class="[{ green: updownData > 0 }, { red: updownData < 0 }]">{{
        lastPrice | formatNumber(muPoint)
      }}</span>
      <span>{{ lastFormatFial }}</span>
    </div>
    <div
      :class="['data-box bid', { show: show }]"
      @mouseover="bidOver($event)"
      @mouseleave="onLeave"
    >
      <ul>
        <li
          v-for="(item, index) in bidDataShow"
          :key="index"
          :data-i="index + 1"
          @click="onRowClick(item, marketInfo, ziPoint, muPoint)"
          :class="{ h: !op.isHoverInfo }"
        >
          <span>{{ item.ticks | formatNumber(muPoint) }}</span>
          <span
            :class="{
              flashUp: item.lots > flashData[item.ticks],
              flashDown: item.lots < flashData[item.ticks],
            }"
            >{{ item.lots | formatNumber(ziPoint) }}</span
          >
          <span>{{ item.total | formatNumber(ziPoint) }}</span>

          <div
            class="percent show-buy-percent"
            :style="`width:${(item.total / maxTotal) * 100}%`"
          ></div>
        </li>
        <li
          v-if="op.isHoverInfo"
          :class="['hover-li', { show: bidOverShow }]"
          :style="`height:${bidOverIndex * 22}px`"
        ></li>
      </ul>
      <!-- 浮动牌子 bid -->
      <div
        v-if="op.isHoverInfo"
        :class="[
          'hover-info',
          { right: op.hoverType === 'right' },
          { show: bidOverShow },
        ]"
        :style="`transform:translateY(calc(-50% + ${bidOverIndex * 22}px))`"
      >
        <div>
          <span>档位:</span>
          <span>{{ bidOverIndex }}</span>
        </div>
        <div>
          <span>累计({{ zi }}):</span>
          <span>{{ overBidNum[0] }}</span>
        </div>
        <div>
          <span>均价({{ mu }}):</span>
          <span>≈ {{ overBidNum[1] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import big from "./utils/tools.js";
import DepthSelect from "./components/DepthSelect";
export default {
  name: "vue-exchange-depth",
  data() {
    return {
      muchArr: new Array(30).fill(""),
      show: true,
      chose: "center", // 上下收起展开 center / ask / bid
      depthChoseState: undefined, // 深度选的哪一个
      deepHeight: 0,
      flashData: {},
      bidOverShow: false,
      askOverShow: false,
      bidOverIndex: 0,
      askOverIndex: 0,
      optionsDefault: {
        isFlash: false,
        hoverType: "right",
        isHoverInfo: true,
        isFrontDepth: false,
      },
    };
  },
  props: {
    sourceData: { type: Object, default: () => {} }, // 完整的数据，包含了askData和bidData，用于闪烁效果
    lastPrice: { type: [String, Number], default: 0 }, // 中间 最终价格
    marketInfo: { type: Object, default: () => {} }, // 当前选择的交易对信息
    updownData: { type: Number, default: 0 }, // 外部传入上一次价格和这一次价格的大小，为了显示绿色或红色
    lastFormatFial: { type: String, default: "" },
    options: { type: Object, default: () => {} }, // 自定义的参数
  },
  components: {
    DepthSelect,
  },
  filters: {
    // 保留几位小数点
    formatNumber(num, p = 2) {
      return big.toFixedPoint(num, p);
    },
  },
  computed: {
    op() {
      return { ...this.optionsDefault, ...this.options };
    },
    zi() {
      return this.marketInfo.zi || "";
    },
    mu() {
      return this.marketInfo.mu || "";
    },
    ziPoint() {
      return this.marketInfo.ziPoint || 8;
    },
    muPoint() {
      return this.marketInfo.muPoint || 8;
    },
    // 当前选择的交易对名字，用于变更时，旧数据消失的动画
    marketName() {
      return `${this.marketInfo.zi}/${this.marketInfo.mu}`;
    },
    // 卖方数据 （上面）
    askData() {
      let ask = this.sourceData.askData ? [...this.sourceData.askData] : [];
      return ask;
    },
    // 买方数据（下面）
    bidData() {
      return this.sourceData.bidData ? [...this.sourceData.bidData] : [];
    },
    // 根据选择的深度处理数据，就算是默认深度，也需要经过此方法处理
    // 此方法还会格式化小数点位数
    sourceDataDepth() {
      const pointL = this.depthChoseState
        ? this.depthChoseState.value.length - 1
        : 0; // 需要合并的位数

      const ask = this.askData;
      const bid = this.bidData;

      if (!this.sourceData || !this.sourceData.askData) {
        return {
          askData: this.askData,
          bidData: this.bidData,
        };
      }

      const askN = {};
      const bidN = {};

      for (let i = 0; i < ask.length; i++) {
        const num = big.toFixedPoint(ask[i].ticks, this.muPoint);
        const numL = num.indexOf(".") > -1 ? num.length - 1 : num.length;
        const deepNum = big.toStr(big.toPrecision(num, numL - pointL));

        if (!askN[deepNum]) {
          askN[deepNum] = { ...ask[i], ticks: deepNum };
        } else {
          askN[deepNum].lots = big.toStr(
            big.add(askN[deepNum].lots, ask[i].lots)
          );
        }
      }

      for (let i = 0; i < bid.length; i++) {
        const num = big.toFixedPoint(bid[i].ticks, this.muPoint);
        const numL = num.indexOf(".") > -1 ? num.length - 1 : num.length; // 当前数字的个数

        if (numL <= pointL) {
          continue;
        }
        const deepNum = big.toStr(big.toPrecision(num, numL - pointL));

        if (!bidN[deepNum]) {
          bidN[deepNum] = { ...bid[i], ticks: deepNum };
        } else {
          bidN[deepNum].lots = big.toStr(
            big.add(bidN[deepNum].lots, bid[i].lots)
          );
        }
      }

      const askData = Object.values(askN).sort((a, b) =>
        big.isGt(a.ticks, b.ticks) ? -1 : 1
      );
      const bidData = Object.values(bidN).sort((a, b) =>
        big.isGt(a.ticks, b.ticks) ? -1 : 1
      );

      return {
        askData,
        bidData,
      };
    },
    // 原本没有total这一项，前端计算获得，total = 每一项的lots相加
    askDataCom() {
      let ask = this.sourceDataDepth.askData;
      ask.reverse();
      for (let i = 0; i < ask.length; i++) {
        ask[i].total =
          i === 0
            ? Number(ask[i].lots)
            : ask[i - 1].total + Number(ask[i].lots);
      }
      ask.reverse();
      return ask;
    },
    bidDataCom() {
      const bid = this.sourceDataDepth.bidData;
      for (let i = 0; i < bid.length; i++) {
        bid[i].total =
          i === 0
            ? Number(bid[i].lots)
            : bid[i - 1].total + Number(bid[i].lots);
      }
      return bid;
    },
    askDataShow() {
      // 根据高度截取
      return [...this.askDataCom].reverse().slice(0, this.askH).reverse();
    },
    bidDataShow() {
      return this.bidDataCom.slice(0, this.bidH);
    },
    askH() {
      switch (this.chose) {
        case "center":
          return Math.ceil(this.deepHeight / 22);
        case "ask":
          return Math.ceil(this.deepHeight / 22) * 2;
        default:
          return 0;
      }
    },
    bidH() {
      switch (this.chose) {
        case "center":
          return Math.ceil(this.deepHeight / 22);
        case "bid":
          return Math.ceil(this.deepHeight / 22) * 2;
        default:
          return 0;
      }
    },
    // 买：鼠标hover显示浮窗的计算
    overBidNum() {
      const bidDataShow = this.bidDataShow;
      if (!this.bidOverShow) {
        return [0, 0];
      }
      let a = 0; // 累计 子
      let b = 0; // 均价
      for (let i = 0; i < this.bidOverIndex; i++) {
        if (bidDataShow[i]) {
          a += Number(bidDataShow[i].lots);
          b += Number(bidDataShow[i].ticks);
        }
      }
      a = big.toFixedPoint(a, this.ziPoint);
      b = big.toFixedPoint(b / this.bidOverIndex, this.muPoint);
      return [a, b];
    },
    // 卖 鼠标hover显示浮窗的计算
    overAskNum() {
      const askDataShow = this.askDataShow;
      if (!this.askOverShow) {
        return [0, 0];
      }
      let a = 0; // 累计 子
      let b = 0; // 均价
      for (
        let i = askDataShow.length - this.askOverIndex;
        i < this.askDataShow.length;
        i++
      ) {
        if (askDataShow[i]) {
          a += Number(askDataShow[i].lots);
          b += Number(askDataShow[i].ticks);
        }
      }
      a = big.toFixedPoint(a, this.ziPoint);
      b = big.toFixedPoint(b / this.askOverIndex, this.muPoint);
      return [a, b];
    },

    // 计算所有的总数，为了显示进度条百分比
    maxTotal() {
      let bidTotal = 0;
      let askTotal = 0;
      if (this.bidDataCom.length) {
        bidTotal = this.bidDataCom[this.bidDataCom.length - 1].total;
      }
      if (this.askDataCom.length) {
        askTotal = this.askDataCom[0].total;
      }
      return Math.max(bidTotal, askTotal);
    },

    // 第1个值
    firstValue() {
      const theFirstBuy = this.bidData[0] ? this.bidData[0].ticks : "";
      return theFirstBuy || "";
    },

    depthMinMax() {
      let up, foot;
      let foot0than1 = false;

      if (!this.firstValue) {
        up = NaN;
      } else {
        foot = big.toFixedAuto(this.firstValue).split(".");
        foot0than1 = big.isGt(foot[0], 1);
        let u = 0;
        if (big.isLt(this.firstValue, 1)) {
          u = foot[1] ? -foot[1].match(/[1-9]/).index : 0; // 几个0
        }
        up = u;
      }

      if (Number.isNaN(up)) {
        return [];
      }
      const res = [];
      let j = 1;

      // 小数部分拥有的深度合并选项
      let next = 0;
      for (let i = 0; i < this.muPoint; i++) {
        j = 10 ** i;
        next++;
        res.push({
          label: `0.${new Array(this.muPoint - 1 - i).fill("0").join("")}1`,
          value: big.toFixedAuto(j),
        });
      }

      const zlength = foot0than1 ? foot[0].length : 0;
      for (let i = 0; i < zlength; i++) {
        j = 10 ** (next + i);
        res.push({
          label: `1${new Array(i).fill("0").join("")}`,
          value: big.toFixedAuto(j),
        });
      }
      // 减限
      for (let i = 0; i > up; i--) {
        res.pop();
      }
      return res;
    },
  },
  watch: {
    marketName() {
      this.show = false;
    },
    askData(newV) {
      if (newV && newV.length) {
        this.show = true;
      }
    },
    bidData(newV) {
      if (newV && newV.length) {
        this.show = true;
      }
    },
    sourceDataDepth(newV) {
      if (this.op.isFlash) {
        setTimeout(() => {
          this.flashData = {
            ...newV.askData.reduce((res, item) => {
              res[item.ticks] = item.lots;
              return res;
            }, {}),
            ...newV.bidData.reduce((res, item) => {
              res[item.ticks] = item.lots;
              return res;
            }, {}),
          };
        }, 100);
      } else {
        this.flashData = {};
      }
    },
    // 选择深度
    depthChoseState(newV) {
      if (newV) {
        this.$emit("onAccuracyChange", newV);
      }
    },
    depthMinMax(newV, oldV) {
      if (!newV || !newV.length) {
        this.depthChoseState = undefined;
        return;
      }
      if (newV.length < oldV.length) {
        if (!newV.find((item) => item.value === this.depthChoseState)) {
          this.depthChoseState = newV[0];
        }
      } else if (!this.depthChoseState) {
        this.depthChoseState = newV[0];
      }
    },
  },
  mounted() {
    window.addEventListener("resize", this.onResize, false);
    this.onResize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize, false);
  },
  methods: {
    onResize() {
      this.deepHeight = this.$refs.askul.clientHeight;
    },
    // 点击某一行的数据
    onRowClick(item, m) {
      this.$emit("onRowClick", item, m);
    },
    // 选择类型
    onChoseType(v) {
      this.chose = v;
      this.$emit("choseChange", v);
    },
    askOver(e) {
      let li = null;
      if (e.target.tagName === "LI") {
        li = e.target;
      } else if (e.target.offsetParent.tagName === "LI") {
        li = e.target.offsetParent;
      }

      const li_index = li && li.getAttribute("data-i");

      if (li_index) {
        this.askOverIndex = Number(li_index);
        this.askOverShow = true;
      } else {
        this.onLeave();
      }
    },

    bidOver(e) {
      let li = null;
      if (e.target.tagName === "LI") {
        li = e.target;
      } else if (e.target.offsetParent.tagName === "LI") {
        li = e.target.offsetParent;
      }

      const li_index = li && li.getAttribute("data-i");
      if (li_index) {
        this.bidOverIndex = Number(li_index);
        this.bidOverShow = true;
      } else {
        this.onLeave();
      }
    },
    onLeave() {
      this.askOverShow = false;
      this.bidOverShow = false;
    },
  },
};
</script>

<style lang="less">
.deep-box-com {
  --red: #ff52a0;
  --green: #5fc8a0;
  --title: #acacac;
  --border: #546469;
  --bg-1: #061826;
  --bg0: #0c2336;
  --bg1: #15364c;
  --bg2: rgba(21, 54, 76, 0.8);
  --highlight: #00a9cb;
  --highlight2: rgba(0, 169, 203, 0.2);
  --word: #c7cce6;
  --flashup: rgba(95, 200, 160, 0.4);
  --flashdown: rgba(255, 82, 160, 0.4);

  color: var(--title);
  background-color: var(--bg0);
  border-radius: 4px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  &.type-ask {
    .data-box.ask {
      height: calc(100% - 109px);
    }
    .data-box.bid {
      height: 0;
    }
  }
  &.type-bid {
    .data-box.ask {
      height: 0;
    }
    .data-box.bid {
      height: calc(100% - 109px);
    }
  }
  .head {
    height: 40px;
    padding: 0 10px;
    background-color: var(--bg1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    flex: none;
    .type-btns {
      display: flex;
      padding: 0;
      & > li {
        width: 20px;
        height: 20px;
        border-radius: 2px;
        border: solid 1px var(--border);
        background-origin: content-box;
        padding: 2px;
        box-sizing: border-box;
        background-repeat: no-repeat;
        cursor: pointer;
        transition: all 256ms;
        &:hover {
          border: solid 1px var(--highlight);
        }
        & + li {
          margin-left: 4px;
        }
        &:nth-child(1) {
          background-image: linear-gradient(
            var(--red) 17.5%,
            transparent 17.5%,
            transparent 27.5%,
            var(--red) 27.5%,
            var(--red) 45%,
            transparent 45%,
            transparent 55%,
            var(--green) 55%,
            var(--green) 72.5%,
            transparent 72.5%,
            transparent 82.5%,
            var(--green) 82.5%
          );
        }
        &:nth-child(2) {
          background-image: linear-gradient(
            var(--red) 17.5%,
            transparent 17.5%,
            transparent 27.5%,
            var(--red) 27.5%,
            var(--red) 45%,
            transparent 45%,
            transparent 55%,
            var(--red) 55%,
            var(--red) 72.5%,
            transparent 72.5%,
            transparent 82.5%,
            var(--red) 82.5%
          );
        }
        &:nth-child(3) {
          background-image: linear-gradient(
            var(--green) 17.5%,
            transparent 17.5%,
            transparent 27.5%,
            var(--green) 27.5%,
            var(--green) 45%,
            transparent 45%,
            transparent 55%,
            var(--green) 55%,
            var(--green) 72.5%,
            transparent 72.5%,
            transparent 82.5%,
            var(--green) 82.5%
          );
        }
      }
    }
    .title {
      flex: 1;
      font-size: 12px;
      color: var(--title);
    }
  }
  .data-box-title {
    height: 35px;
    line-height: 35px;
    font-size: 12px;
    display: flex;
    & > li {
      flex: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-sizing: border-box;
      &:first-child {
        text-align: left;
        flex: 55%;
        padding-left: 10px;
      }
      &:nth-child(2) {
        text-align: right;
        flex: 45%;
      }
      &:nth-child(3) {
        text-align: right;
        width: 40%;
        padding-right: 10px;
      }
    }
  }
  .data-box {
    height: calc((100% - 109px) / 2);
    font-size: 12px;

    transition: all 256ms;
    opacity: 0;
    transform: translateX(-8px);
    pointer-events: none;
    .h:hover {
      background-color: var(--highlight2);
    }
    .hover-li {
      position: absolute !important;
      left: 0;
      width: 100%;
      z-index: -1;
      background-color: var(--highlight2);
      opacity: 0;
      pointer-events: none;
      transition: opacity 256ms;
      &.show {
        opacity: 1;
      }
    }
    .hover-info {
      position: absolute;
      right: calc(100% + 8px);
      padding: 10px;
      width: auto;
      background-color: var(--bg2);
      border-radius: 6px;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
      opacity: 0;
      pointer-events: none;
      z-index: 99;
      &.right {
        right: auto;
        left: calc(100% + 8px);
        &:after {
          border: solid 8px transparent;
          border-right-color: var(--bg2);
          left: auto;
          right: 100%;
        }
      }
      &.show {
        opacity: 1;
        transform: translateX(0);
      }
      &:after {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border: solid 8px transparent;
        border-left-color: var(--bg2);
        top: 50%;
        left: 100%;
        transform: translateY(-8px);
      }
      & > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        white-space: nowrap;
        & > span {
          flex: none;
          &:nth-child(1) {
            margin-right: 10px;
          }
          &:nth-child(2) {
            color: var(--word);
          }
        }
      }
    }
    .percent {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      transition: width 200ms;
    }
    &.ask {
      &.show {
        opacity: 1;
        transform: translateX(0);
        pointer-events: auto;
      }
      .hover-info {
        bottom: 0;
      }
      & > ul {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        height: 100%;
        overflow: hidden;
        position: relative;
        & > li {
          display: flex;
          height: 22px;
          align-items: center;
          position: relative;
          flex: none;
          cursor: pointer;
          &.hover-li {
            bottom: 0;
            border-top: dashed 1px var(--highlight);
          }
          .percent {
            background-color: var(--red);
            opacity: 0.15;
          }
          & > span {
            flex: none;
            font-size: 12px;
            color: var(--word);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            box-sizing: border-box;
            // flashDemo
            transition: background-color 50ms;
            &.flashUp {
              background-color: var(--flashup);
            }
            &.flashDown {
              background-color: var(--flashdown);
            }
            &:first-child {
              text-align: left;
              color: var(--red);
              flex: 55%;
              padding-left: 10px;
            }
            &:nth-child(2) {
              text-align: right;
              flex: 45%;
            }
            &:nth-child(3) {
              text-align: right;
              width: 40%;
              padding-right: 10px;
            }
          }
        }
      }
    }
    &.bid {
      &.show {
        opacity: 1;
        transform: translateX(0);
        pointer-events: auto;
      }
      .hover-info {
        top: 0;
      }
      & > ul {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
        position: relative;
        & > li {
          display: flex;
          flex: none;
          height: 22px;
          align-items: center;
          position: relative;
          cursor: pointer;
          &.hover-li {
            top: 0;
            border-bottom: dashed 1px var(--highlight);
          }

          .percent {
            background-color: var(--green);
            opacity: 0.15;
          }
          & > span {
            flex: none;
            font-size: 12px;
            color: var(--word);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            box-sizing: border-box;
            transition: background-color 200ms;
            &.flashUp {
              background-color: var(--flashup);
            }
            &.flashDown {
              background-color: var(--flashdown);
            }
            &:first-child {
              text-align: left;
              color: var(--green);
              padding-left: 10px;
              flex: 55%;
            }
            &:nth-child(2) {
              text-align: right;
              flex: 45%;
            }
            &:nth-child(3) {
              text-align: right;
              width: 40%;
              padding-right: 10px;
            }
          }
        }
      }
    }
  }
  .middle-box {
    height: 30px;
    display: flex;
    align-items: center;
    background-color: var(--bg-1);
    padding: 0 10px;
    font-size: 12px;
    font-weight: 600;
    overflow: hidden;
    & > span {
      &:nth-child(1) {
        font-size: 15px;
      }
      &:nth-child(2) {
        overflow: hidden;
        flex: none;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-left: 5px;
      }
    }
    .green {
      color: var(--green);
    }
    .red {
      color: var(--red) !important;
    }
  }
}
</style>
