<template>
  <div>
    <el-container class="home-contariner">
      <el-aside class="menu" :class="{ collapse: isCollapse }">
        <div class="logo" :class="{ collapse: isCollapse }">
          <img src="https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png" alt="" />
          <span>后台管理系统</span>
        </div>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#313743"
          text-color="#fff"
          active-text-color="#4fc08d"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <el-submenu :index="item.path" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item :index="`/${subItem.path}`" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <i class="el-icon-s-help"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div @click="toggleCollapse">
            <i class="el-icon-s-fold"></i>
          </div>
          <el-dropdown class="user-avatar" trigger="click" @command="handleCommand">
            <el-avatar icon="el-icon-user-solid"></el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menulist: [],
      iconObj: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-check',
        '102': 'el-icon-s-goods',
        '101': 'el-icon-s-order',
        '145': 'el-icon-s-marketing',
      },
      isCollapse: false,
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    handleCommand(command) {
      if (command === 'logout') sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenuList() {
      const menulist = JSON.parse(sessionStorage.getItem('menulist')) || ''
      if (menulist) return (this.menulist = menulist)
      const { data: res } = await this.$http.get('menus')
      this.menulist = res.data
      sessionStorage.setItem('menulist', JSON.stringify(res.data))
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
  },
}
</script>

<style lang="less" scoped>
.home-contariner {
  height: 100vh;
}

.menu {
  width: 240px !important;
  transition: 0.5s all;
  &.collapse {
    width: 64px !important;
  }
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #363d40;
  color: #333;
  .user-avatar {
    display: flex;
    align-items: center;
  }
  & > div {
    color: #fff;
    font-size: 24px;
    cursor: pointer;
  }
}

.el-aside {
  background-color: #313743;
  color: #fff;
  .logo {
    display: flex;
    align-items: center;
    width: 240px;
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    font-weight: bold;
    overflow: hidden;
    &.collapse {
      width: 64px;
    }
    img {
      width: 24px;
      height: 22px;
      margin: 0 20px;
    }
  }
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #e9edf1;
  color: #333;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
