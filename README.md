# vue-exchange-depth [![npm](https://img.shields.io/npm/v/vue-exchange-depth.svg)](https://www.npmjs.com/package/vue-exchange-depth) [![npm downloads](https://img.shields.io/npm/dt/vue-exchange-depth.svg)](https://www.npmjs.com/package/vue-exchange-depth)

交易所深度组件/挂单信息组件<br/>
这个目前仅用于vue2.x

### DEMO
https://isluo.com/work/vue-exchange-depth

### 安装
```
npm install vue-exchange-depth -S
```

### 代码示例

```vue
  <template>
    <!-- 需要一个容器来包裹 -->
    <div style="width: 300px; height: 500px">
      <VueExchangeDepth
        :marketInfo="marketInfo"
        :options="options"
        :sourceData="sourceData"
        :lastPrice="lastPrice"
        :lastFormatFial="lastFormatFial"
        @onAccuracyChange="onAccuracyChange"
        @onRowClick="onRowClick"
        @choseChange="choseChange"
      />
    </div>
  </template>
```
```vue
  <script>
    import VueExchangeDepth from 'vue-exchange-depth';
    export default {
      components:{
        VueExchangeDepth
      }
      data(){
        return {
          marketInfo: {
            zi: 'BTC',
            mu; 'USDT',
            ziPoint: 8,
            muPoint: 4,
          },
          options: {
            isFlash: false,
            isHoverInfo: true,
            hoverType: 'left'
          },
          lastPrice: 50000,
          lastFormatFial: '≈ 300000 RMB',
          sourceData: {
            askData:[
              {ticks: '50000.1234', lots: '1.23456789'}
            ],
            bidData:[
              {ticks: '49999.1234', lots: '1.23456789'}
            ]
          }
        }
      },
      methods:{
        onAccuracyChange(p){
          // 深度变化
          // p: {"label":"0.01","value":"100"}
        },
        onRowClick(p, q){
          // 点击了某一行数据
          // p: {"ticks":47900,"lots":3.23456789,"count":29,"total":9.458553034044943}
          // q: {"zi":"BTC","mu":"USDT","ziPoint":8,"muPoint":4}
        },
        choseChange(p){
          // 选择了左上角的按钮
          // p: 'center'/'bid'/'ask'
        }
      }
    }
  </script>
```

### 参数

字段名|类型|默认值|是否必填
--|--|--|--
marketInfo|Object|undefined|是

说明：这个参数用于说明交易对的信息，你应该传入一个类似这样的对象：
```js
{
  zi: 'BTC', // 子币名称
  mu: 'USDT', // 母币名称
  ziPoint: 8, // 子币小数点精度
  muPoint: 4, // 母币小数点精度
}
```

字段名|类型|是否必填
--|--|--
options|Object|否

说明：自定义设置，你应该传入一个类似这样的对象：
```js
{
  isFlash: false, // 当某个价位(ticks)的数量(lots)变化时，是否高亮闪烁一下；默认false
  isHoverInfo: true, // 当鼠标放在价位上时，是否显示均价浮窗；默认true
  hoverType: 'left' // 均价浮窗显示在左边(left)还是右边(right), 默认"left"
}
```

字段名|类型|默认值|是否必填
--|--|--|--
lastPrice|String/Number|''|否

说明：你可以传入一个最终成交的价格，这会显示在组件中间那个位置<br/>
比如这样：50000.1234


字段名|类型|默认值|是否必填
--|--|--|--
lastFormatFial|String|''|否

说明：你可以传入一个字符串，这会显示在组件中间那个位置，跟在lastPrice的后面<br/>
比如这样："≈ 300000 RMB"

字段名|类型|默认值|是否必填
--|--|--|--
sourceData|Object|undefined|是

说明：这是交易挂单的原始数据，通常由websocket不停的推送最新数据，你应该传入这样的对象：<br/>
(不要增量更新，每次有新数据都应该传入一个全新的sourceData对象)
```js
{
  askData: [ // 卖方数据 需要你自行对价格(ticks)进行排序，注意是倒序，从大到小
    {ticks: '50001.2234', lots: '2.23456789'}
    {ticks: '50000.1234', lots: '1.23456789'},
    ...
  ],
  bidData: [ // 买方数据 需要你自行对价格(ticks)进行排序，注意是倒序，从大到小
    {ticks: '49999.1234', lots: '1.23456789'},
    {ticks: '49998.2234', lots: '2.23456789'}
  ]
}
```

### 事件

  **onAccuracyChange(p)**

  当深度发生变化时会触发一次<br/>
  组件会根据当前数据(`sourceData`)计算出所有可能的深度选项，显示在右上角下拉框中<br/>
  首次计算出深度时，组件会自动选中第1个深度选项，则会触发一次该事件<br/>
  之后每次用户选择不同的深度时，才会再触发<br/>

  **返回值：**

  `{"label":"0.01","value":"100"}`<br/>
  会返回一个类似这样的对象<br/>
  label是组件中显示的数字<br/>
  value是实际对应的值，1表示没有合并深度，10表示向前合并一位小数点，100表示合并两位小数点<br/>
  以此类推<br/>



**关于深度合并的解释**

比如有这样的原始数据：
```js
[
  {ticks: 50000.1234, losts:1},
  {ticks: 50000.1235, losts:2},
  {ticks: 50000.1266, losts:3}
]
```
此时组件会计算出所有可能的深度合并选项：0.0001，0.001，0.01，0.1，1，10，100，1000<br/>
当选择0.0001，则什么都不会发生<br/>
当选择0.001, 则小数点向前合并一位，最终展现给用户的数据就变成了：
```js
{
  {ticks: 50000.1230, losts: 3},
  {ticks: 50000.1260, losts: 3}
}
```
因为小数点向前合并一位，就是说最后一位小数全变成0<br/>
然后50000.1234和50000.1235就都变成了50000.1230,这两个数值变成一样了，于是合并到一起，它们的lots相加变成3<br/>
其他选项以此类推

**但是**
本组件仅计算了深度合并的选项，真正对数据进行合并的操作应该交由服务端去做。<br/>
当用户选择了不同的深度后，你应该通知服务端，让服务端返回深度合并后的数据。

---

**onRowClick(p, q)**

当鼠标点击某一行数据时，会触发一次

**返回值**

p: `{"ticks":47900,"lots":3.23456789,"total":9.458553034044943}`<br/>
当前选中的数据：价格(ticks)/数量(lots)/累计(total)<br/>
q: `{"zi":"BTC","mu":"USDT","ziPoint":8,"muPoint":4}`<br/>
当前交易对的信息：就是`marketInfo`参数的数据

---

**choseChange(p)**

当左上角按钮状态改变时触发一次

**返回值**

p: "center" 选择了第1个按钮，上下数据各展示一半/ "ask"选择了仅展示卖方数据/ "bid"选择了仅展示买方数据


### 注意事项

- 组件宽高都是100%， 所以需要一个有大小的容器来装它。
- 如果你需要更多自定义，可以直接`/src`下的内容复制到你自己项目里，自己改，就是个普通vue组件，直接用就行。
- `/src/App.vue`是本体，`/src/components`下是简单封装了个select组件，`/src/utils`是一些数学函数。
- 本组件内部的数学运算使用了`big.js`。
