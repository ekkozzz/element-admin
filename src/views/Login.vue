<template>
  <div class="login">
    <el-card class="box-card">
      <div slot="header">
        <span class="title">欢迎使用后台管理系统</span>
      </div>
      <el-form :model="model" :rules="rules" ref="formref" label-position="left" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="model.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="model.password" prefix-icon="el-icon-umbrella"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button @click="$refs.formref.resetFields()">重置</el-button>
          <el-button type="primary" @click="login">立即登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: {
        username: 'admin',
        password: '123456',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            required: true,
            min: 3,
            max: 8,
            message: '长度在 3 到 8 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            required: true,
            min: 6,
            max: 18,
            message: '长度在 6 到 18 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    login() {
      this.$refs.formref.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.model)
        console.log(res)
        if (res.meta.status !== 200) return this.$message({ message: res.meta.msg, type: 'error' })
        this.$message.success(res.meta.msg)
        sessionStorage.setItem('token', res.data.token)
        this.$router.push({ path: '/home' })
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: #264a6b;
  .box-card {
    width: 400px;
    .title {
      font-size: 18px;
      font-weight: bold;
    }
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
