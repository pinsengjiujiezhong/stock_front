<template>
  <div class="container">
    <div class="operation">
      <el-input placeholder="请输入内容" v-model="keyword" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="getRoseList"></el-button>
      </el-input>
    </div>
    <el-table
      :data="roseList"
      border
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
        label="名称"
        prop="name">
      </el-table-column>
      <el-table-column
        label="编号"
        prop="code">
      </el-table-column>
      <el-table-column
        label="连涨次数"
        prop="num">
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
export default {
  data() {
    return {
      keyword: '',
      page: 0,
      size: 10,
      roseList: [],
      total: 0
    }
  },
  mounted() {
    this.getRoseList()
  },
  methods: {
    async getRoseList() {
      const params = {
        keyword: this.keyword,
        page: this.page,
        size: this.size
      }
      const { data: res } = await this.$http.get('/api/rose/', { params })
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
            data: item.dates
          },
          yAxis: {
            type: 'value',
            show: true
          },
          series: [
            {
              data: item.prices,
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
