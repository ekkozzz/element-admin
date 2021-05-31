<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/roles' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="table-box">
      <el-button type="primary" @click="dialogVisible = true"
        >添加角色</el-button
      >
      <el-table :data="rolesList" border stripe v-loading="isLoading">
        <el-table-column type="expand">
          <template #default="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <el-col :span="5">
                <el-tag
                  @close="removeRightById(scope.row, item3.id)"
                  closable
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      @close="removeRightById(scope.row, item3.id)"
                      closable
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row, item3.id)"
                      closable
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template #default="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showDialogVisible(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="提示" :visible.sync="setRightDialogVisible" width="50%">
      <el-tree
        :data="rightList"
        :props="treeProps"
        node-key="id"
        show-checkbox
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRigths()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="roleId ? '编辑用户' : '添加用户'"
      :visible.sync="dialogVisible"
      @close="dialogClosed"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="ruleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="ruleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole" v-show="!roleId"
          >确 定</el-button
        >
        <el-button type="primary" @click="editRole" v-show="roleId"
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
      rolesList: [],
      setRightDialogVisible: false,
      rightList: [],
      treeProps: {
        children: 'children',
        label: 'authName',
      },
      defKeys: [],
      roleId: '',
      dialogVisible: false,
      ruleForm: {
        roleName: '',
        roleDesc: '',
      },
      rules: {
        roleName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ],
      },
      isLoading: true,
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      this.rolesList = res.data
      this.isLoading = false
    },
    async removeRightById(role, rightId) {
      const confirm = await this.$confirm('是否删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      console.log(confirm)
      if (confirm !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      console.log(res)
      if (res.meta.msg) this.$message.success(res.meta.msg)
      role.children = res.data
    },
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      this.rightList = res.data
      console.log(res)
      if (res.meta.msg) this.$message.success(res.meta.msg)
      this.defKeys = []
      this.getLeafKey(role, this.defKeys)
      console.log(this.defKeys)
      this.setRightDialogVisible = true
    },
    getLeafKey(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKey(item, arr)
      })
    },
    async allotRigths() {
      const key = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = key.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.msg) this.$message.success(res.meta.msg)
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    async showDialogVisible(id) {
      if (id) {
        this.roleId = id
        const { data: res } = await this.$http.get('roles/' + this.roleId)
        console.log(res)
        this.ruleForm.roleName = res.data.roleName
        this.ruleForm.roleDesc = res.data.roleDesc
      }
      this.dialogVisible = true
    },
    editRole() {
      this.$refs.ruleForm.validate(async (vaild) => {
        if (!vaild) return
        const { data: res } = await this.$http.put('roles/' + this.roleId, {
          ...this.ruleForm,
        })
        if (res.meta.msg) this.$message.success(res.meta.msg)
        this.roleId = ''
        this.ruleForm.roleName = ''
        this.ruleForm.roleDesc = ''
        this.dialogVisible = false
        this.getRolesList()
      })
    },
    dialogClosed() {
      this.$refs.ruleForm.resetFields()
      this.roleId = ''
      this.ruleForm.roleName = ''
      this.ruleForm.roleDesc = ''
    },
    addRole() {
      this.$refs.ruleForm.validate(async (vaild) => {
        if (!vaild) return
        const { data: res } = await this.$http.post('roles', {
          ...this.ruleForm,
        })
        console.log(res)
        if (res.meta.msg) this.$message.success(res.meta.msg)
        this.dialogVisible = false
        this.getRolesList()
      })
    },
    async deleteRole(id) {
      const confirm = await this.$confirm('是否删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirm !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      console.log(res)
      this.$message.success(res.meta.msg)
      this.getRolesList()
    },
  },
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 40px;
}
.table-box {
  & > .el-table {
    margin-top: 20px;
  }
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}

.el-tag {
  margin: 7px;
}
</style>
