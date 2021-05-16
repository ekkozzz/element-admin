<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="tool-bar">
      <el-row :gutter="20">
        <el-col :span="8" :offset="0"
          ><el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button> </el-input
        ></el-col>
        <el-col :span="4" :offset="0"
          ><el-button type="primary" size="default" @click="addDialogVisible = true">添加用户</el-button></el-col
        >
      </el-row>
    </div>
    <el-table :data="userlist" v-if="userlist" stripe>
      <el-table-column prop="username" label="用户名"> </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="mobile" label="手机"> </el-table-column>
      <el-table-column prop="role_name" label="角色"> </el-table-column>
      <el-table-column label="状态">
        <template #default="scope">
          <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"> </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDialogOpen(scope.row.id)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
          <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
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

    <!-- 添加用户dialog -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户dialog -->
    <el-dialog title="编辑用户资料" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    let checkMobile = (rule, value, cb) => {
      const regMobile = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号码'))
    }

    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      userlist: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: ['blur', 'change'] },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      editDialogVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: '',
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: ['blur', 'change'] },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChange(userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('用户状态修改失败')
      }
      this.$message.success(res.meta.msg)
      console.log(res)
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async (vaild) => {
        if (!vaild) return
        const { data: res } = await this.$http.post('users', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('用户添加失败')
        }
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    async editDialogOpen(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`users/${id}`)
      this.editForm = res.data
      console.log(this.editForm)
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    editUser() {
      this.$refs.editFormRef.validate(async (vaild) => {
        if (!vaild) return
        console.log(this.editForm)
        const { data: res } = await this.$http.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile,
        })
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('用户信息更新失败')
        }
        this.$message.success(res.meta.msg)
        this.editDialogVisible = false
        this.getUserList()
      })
    },
    async deleteUser(id) {
      const confirm = await this.$confirm('是否删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirm !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`users/${id}`)
      console.log(res)
      this.$message.success(res.meta.msg)
      this.getUserList()
    },
  },
}
</script>

<style lang="less" scoped>
.tool-bar {
  margin: 40px 0 20px 0;
}
.el-pagination {
  margin-top: 15px;
}
</style>
