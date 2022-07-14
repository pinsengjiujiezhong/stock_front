<template>
  <div class="home">
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Header from '../components/Header'
export default {
  components: {
    Header
  }
}
</script>

<style lang="scss" scoped>
.el-header{
  padding: 0;
}
.el-aside{
  width: 200px;
  background-color: #373d41;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
.el-main{
  background-color: #fff;
}
</style>
