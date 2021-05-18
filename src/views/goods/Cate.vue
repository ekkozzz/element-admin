<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: $route.path }"
        >商品分类</el-breadcrumb-item
      >
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="table-box">
      <el-button type="primary" size="default" @click="showAddCateDialog"
        >添加分类</el-button
      >
      <el-table
        :data="cateList"
        row-key="cat_id"
        border
        lazy
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column label="是否有效">
          <template #default="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted"></i>
            <i class="el-icon-error" v-else></i>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.cat_level === 0"
              >等级一</el-tag
            >
            <el-tag type="info" v-else-if="scope.row.cat_level === 1"
              >等级二</el-tag
            >
            <el-tag type="warning" v-else>等级三</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="openDditCate(scope.row.cat_id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteCate(scope.row.cat_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <el-dialog
      :title="cid ? '编辑分类' : '添加分类'"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            :disabled="cid"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate" v-show="!cid"
          >确 定</el-button
        >
        <el-button type="primary" @click="editCate" v-show="cid"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      cateList: [],
      total: 0,
      addCateDialogVisible: false,
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0,
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      selectKeys: [],
      cid: null,
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取列表失败')
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newPage) {
      this.queryInfo.pagesize = newPage
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog() {
      this.getParentList()
      this.addCateDialogVisible = true
    },
    async getParentList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      console.log(res)
      if (res.meta.msg) this.$message.success(res.meta.msg)
      this.parentCateList = res.data
    },
    parentCateChange() {
      console.log(this.selectKeys)
      if (this.selectKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.addCateForm.cat_level = this.selectKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate() {
      console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        console.log(res)
        if (res.meta.msg) this.$message.success(res.meta.msg)
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    addDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_name = ''
      this.cid = null
    },
    async deleteCate(id) {
      const confirm = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirm !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`categories/${id}`)
      console.log(res)
      if (res.meta.msg) this.$message.success(res.meta.msg)
      this.getCateList()
    },
    async openDditCate(id) {
      this.cid = id
      const { data: res } = await this.$http.get(`categories/${id}`)
      console.log(res)
      this.addCateForm.cat_name = res.data.cat_name
      this.addCateDialogVisible = true
    },
    async editCate() {
      const { data: res } = await this.$http.put('categories/' + this.cid, {
        cat_name: this.addCateForm.cat_name,
      })
      console.log(res)
      if (res.meta.msg) this.$message.success(res.meta.msg)
      this.addCateDialogVisible = false
      this.getCateList()
    },
  },
}
</script>

<style lang="less" scoped>
.table-box {
  margin-top: 40px;
  & > .el-button {
    margin-bottom: 20px;
  }
  .el-icon-success {
    color: #67c23a;
  }
  .el-icon-error {
    color: #f56c6c;
  }
}
.el-pagination {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
