<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: $route.path }"
        >商品分类</el-breadcrumb-item
      >
      <el-breadcrumb-item>{{ $route.name }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- elcard -->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="true"
      >
      </el-alert>

      <el-row class="cat_opt">
        <el-col>
          <span>选择商品的分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="many">
          <el-button
            type="primary"
            size="small"
            :disabled="isDisabled"
            @click="dialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="tableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template #default="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="only">
          <el-button
            type="primary"
            size="small"
            :disabled="isDisabled"
            @click="dialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="tableData" border stripe>
            <el-table-column type="expand">
              <el-table-column type="expand">
                <template #default="scope">
                  <el-tag
                    v-for="(item, i) in scope.row.attr_vals"
                    :key="i"
                    closable
                    @close="handleClose(i, scope.row)"
                    >{{ item }}</el-tag
                  >
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                    >+ New Tag</el-button
                  >
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="behavior + titleText"
      :visible.sync="dialogVisible"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addForm"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      selectedCateKeys: [],
      activeName: 'many',
      tableData: [],
      dialogVisible: false,
      addForm: {
        attr_name: '',
      },
      rules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
      attrId: null,
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      console.log(res)
      this.cateList = res.data
    },
    handleChange() {
      this.getParamsData()
    },
    handleClick() {
      this.getParamsData()
    },
    async getParamsData() {
      this.tableData = []
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        return
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      )
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      this.tableData = res.data
      console.log(res.data)
    },
    addDialogClosed() {
      this.$refs.addForm.resetFields()
      this.addForm.attr_name = ''
      this.attrId = null
    },
    addParams() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success(res.meta.msg)
        this.dialogVisible = false
        this.getParamsData()
      })
    },
    async showDialog(id) {
      this.attrId = id
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${this.attrId}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      )
      this.addForm.attr_name = res.data.attr_name
      this.dialogVisible = true
    },
    editParams() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.attrId}`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success(res.meta.msg)
        this.dialogVisible = false
        this.getParamsData()
      })
    },
    handleDialogClick() {
      if (this.attrId) {
        this.editParams()
      } else {
        this.addParams()
      }
    },
    async removeParams(id) {
      const confirm = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
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
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success(res.meta.msg)
      this.getParamsData()
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' '),
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败')
      }
      this.$message.success(res.meta.msg)
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
  },
  computed: {
    isDisabled() {
      return this.selectedCateKeys.length !== 3
    },
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
    behavior() {
      if (this.attrId) {
        return '修改'
      }
      return '添加'
    },
  },
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
.cat_opt {
  margin: 15px 0;
}
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin-right: 15px;
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
</style>
