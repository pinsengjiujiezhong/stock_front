<template>
  <div class="container">
    <div class="tag-code">
      <div class="tag-title">自选股票列表</div>
      <el-tag
        :key="tag"
        v-for="tag in codeList"
        closable
        :disable-transitions="false"
        @close="codeClose(tag)">
        {{tag}}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="codeInputVisible"
        v-model="stockCode"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="$event.target.blur()"
        @blur="codeSubmit">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
    </div>
    <el-table
      :data="optionalList"
      border
      style="width: 100%">
      <el-table-column
        type="index">
      </el-table-column>
      <el-table-column
        label="code"
        width="100"
        prop="code">
      </el-table-column>
      <el-table-column
        label="股票名称">
        <template scope="props">
          <el-popover
            @show="getKline(props.row.code)"
            placement="top-start"
            trigger="hover">
            <div class="charts">
              <v-chart :option="echartOption"></v-chart>
            </div>
            <span slot="reference">{{props.row.name}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="换手"
        prop="change">
      </el-table-column>
      <el-table-column
        label="涨跌幅"
        prop="extent">
      </el-table-column>
      <el-table-column
        label="开盘价"
        prop="opening">
      </el-table-column>
      <el-table-column
        label="当前价格"
        prop="transaction">
      </el-table-column>
      <el-table-column
        label="涨跌百分比"
        prop="percentage">
      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/javascript">
import storage from '../../util/storage'
export default {
  data() {
    return {
      optionalList: [],
      stockCode: '',
      codeInputVisible: false,
      codeList: [],
      timer: '',
      echartOption: {}
    }
  },
  mounted() {
    this.codeList = JSON.parse(storage.get('codes')) || []
    this.getOptionalList()
    this.setCodeInterval()
    this.getKline('000001')
  },
  methods: {
    async getOptionalList() {
      if (!this.codeList.length) return this.$message.info('当前还未添加自选股票代码,请添加代码后刷新页面')
      const params = {
        optionals: this.codeList.join('_')
      }
      const { data: res } = await this.$http.get('/api/optional/', { params })
      this.optionalList = res
    },
    codeClose(tag) {
      this.codeList.splice(this.codeList.indexOf(tag), 1)
      storage.set('codes', JSON.stringify(this.codeList))
    },
    async codeSubmit() {
      console.log('調用了')
      if (this.stockCode.length !== 6) return this.$message.error('请输入6位股票代码')
      const { data: res } = await this.$http('/api/check/', { params: { code: this.stockCode } })
      if (!res.check) return this.$message.error('请输入正确的股票代码')
      if (this.stockCode) {
        this.codeList.push(this.stockCode)
      }
      storage.set('codes', JSON.stringify(this.codeList))
      this.codeInputVisible = false
      this.stockCode = ''
    },
    showInput() {
      this.codeInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    setCodeInterval() {
      if (!this.codeList.length) return
      this.timer = setInterval(() => {
        this.getOptionalList()
      }, 3000)
    },
    async getKline(code) {
      const params = { code }
      const { data: res } = await this.$http.get('/api/kline/', { params })
      this.echartOption = {
        title: {
          show: true,
          text: 'K线图'
        },
        xAxis: {
          type: 'category',
          show: true,
          axisTick: {
            alignWithLabel: true
          },
          data: res.time
        },
        yAxis: {
          type: 'value',
          show: true,
          scale: true,
          min: Math.min.apply(null, res.price)
        },
        series: [
          {
            data: res.price,
            type: 'line',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top',
                  smooth: true,
                  textStyle: {
                    color: 'black',
                    fontSize: 12
                  }
                }
              }
            }
          }
        ]
      }
      console.log('this.echartOption: ', this.echartOption)
    }
  },
  beforeDestroy() {
    console.log('beforeDestroy')
    window.clearTimeout(this.timer)
  }
}
</script>

<style lang="scss" scoped>
.container{
  font-size: 20px;
  .operation{
    width: 500px;
    margin-bottom: 10px;
  }
  .pagination{
    margin-top: 10px;
    display: flex;
    justify-content: right;
  }
  .tag-code{
    margin-bottom: 20px;
    .tag-title{
      font-size: 16px;
      color: red;
      margin-bottom: 5px;
    }
    .el-tag + .el-tag {
      margin-left: 10px;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
  }
}
</style>
