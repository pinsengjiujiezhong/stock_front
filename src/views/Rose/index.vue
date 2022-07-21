<template>
  <div class="container">
    <div class="operation">
      <el-input placeholder="请输入内容" v-model="keyword" @keyup.enter.native="getRoseList" class="input-with-select" @clear="getRoseList" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getRoseList"></el-button>
      </el-input>
    </div>
    <el-table
      :data="roseList"
      border
      @sort-change="roseSort"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <v-chart :option="props.row.charts" class="echarts"></v-chart>
        </template>
      </el-table-column>
      <el-table-column
        type="index">
      </el-table-column>
      <el-table-column
        label="名称">
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
        label="现价"
        prop="price">
      </el-table-column>
      <el-table-column
        label="编号"
        prop="code">
      </el-table-column>
      <el-table-column
        label="市场"
        prop="bazaar">
      </el-table-column>
      <el-table-column
        sortable="custom"
        label="连涨次数"
        prop="num">
      </el-table-column>
      <el-table-column
        label="月涨次数"
        sortable="custom"
        prop="monthnum">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="addOptional(scope.row.code)"
            size="small">
            添加自选
          </el-button>
          <el-button
            type="text"
            @click="addOptional(scope.row.code)"
            size="small">
            可以想想还要什么按钮
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="roseSizeChange"
      @current-change="roseCurrentChange"
      :current-page.sync="page"
      :page-size="size"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      :total="total">
    </el-pagination>
  </div>
</template>

<script type="text/javascript">
import storage from '../../util/storage'
export default {
  data() {
    return {
      keyword: '',
      types: 'num',
      order: 'descending',
      page: 0,
      size: 10,
      roseList: [],
      total: 0,
      codeList: [],
      echartOption: {}
    }
  },
  mounted() {
    this.codeList = JSON.parse(storage.get('codes')) || []
    this.getRoseList()
  },
  methods: {
    async getRoseList() {
      console.log('调用了getRoseList')
      const params = {
        keyword: this.keyword,
        page: this.page,
        types: this.types,
        order: this.order,
        size: this.size
      }
      const { data: res } = await this.$http.get('/rose/', { params })
      console.log('result: ', res)
      this.total = res.total
      this.roseList = res.roses.map(item => {
        item.charts = {
          xAxis: {
            type: 'category',
            show: true,
            axisTick: {
              alignWithLabel: true
            },
            data: item.dates.reverse()
          },
          yAxis: {
            type: 'value',
            show: true,
            scale: true
          },
          series: [
            {
              data: item.prices.reverse(),
              type: 'line',
              barWidth: '35%',
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    position: 'top',
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
        item.bazaar = item.ts_code.split('.')[1]
        return item
      })
    },
    roseSizeChange(size) {
      this.page = 1
      this.size = size
      this.getRoseList()
    },
    roseCurrentChange(page) {
      this.page = page
      this.getRoseList()
    },
    addOptional(id) {
      if (this.codeList.indexOf(id) !== -1) return this.$message.info('当前自选已添加')
      this.codeList.push(id)
      storage.set('codes', JSON.stringify(this.codeList))
    },
    roseSort(event) {
      console.log('event: ', event)
      this.types = event.prop
      this.order = event.order
      this.getRoseList()
    },
    async getKline(code) {
      const params = { code }
      const { data: res } = await this.$http.get('/kline/', { params })
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
}

</style>
