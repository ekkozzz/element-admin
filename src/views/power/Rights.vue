<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/rights' }"
        >权限管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="rightsList" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="authName" label="权限"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="level" label="权限等级">
        <template #default="scope">
          <el-tag v-if="scope.row.level === '1'">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.level === '2'"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      this.rightsList = res.data
      if (res.meta.msg) {
        this.$message.success(res.meta.msg)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 40px;
}
</style>
