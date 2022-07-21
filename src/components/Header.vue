<template>
    <div class="container">
      <h1>路鸡棍赔钱系统</h1>
      <el-menu :default-active="activeIndex" class="menu-body" mode="horizontal" @select="handleSelect" router>
        <el-menu-item class="ment-item" index="/rose">涨幅中心</el-menu-item>
        <el-menu-item  class="ment-item" index="/optional">自选</el-menu-item>
      </el-menu>
    </div>
</template>

<script>
export default {
  data() {
    return {
      menu: [],
      activeIndex: '/test'
    }
  },
  methods: {
    handleSelect() {
      console.log('handleSelect')
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  display: flex;
  background-color: #af2020;
  justify-content: center;
  h1{
    position: absolute;
    left: 10px;
    top: 10px;
    height: 60px;
    font-size: 30px;
    color: #fff;
  }
  .menu-body{
    background-color: #af2020;
    .ment-item{
      font-size: 20px;
      color: #fff;
    }
  }
}
</style>
