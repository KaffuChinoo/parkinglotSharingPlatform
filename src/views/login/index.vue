<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">CUG车位平台</h3>
      </div>

      <el-form-item prop="username" class="el-form-item2">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          class="el-input2"
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password" class="el-form-item2">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          class="el-input2"
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-row>
        <el-button type="text" @click="openEditDialog(null)">新用户注册</el-button>
        <el-button type="text" @click="openPwdDialog()" style="margin-left: 260px">忘记密码 ？</el-button>
      </el-row>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登 录</el-button>

      <div class="tips">

      </div>
    </el-form>

    <!--用户信息编辑-->
    <el-dialog @close="clearPwdForm" :title="title" :visible.sync="dialogFormVisible" >
      <el-form :model="userForm" ref="userFormRef" :rules="rules">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="userForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="userForm.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
<!--        <el-form-item label="管理员权限" :label-width="formLabelWidth">-->
<!--          <el-switch v-model="userForm.role" :active-value="1" :inactive-value="0" active-text="开" inactive-text="关" disabled>-->
<!--          </el-switch>-->
<!--        </el-form-item>-->
        <el-form-item label="电子邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="userForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像URL" prop="avatar" :label-width="formLabelWidth">
          <el-input v-model="userForm.avatar" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="头像预览" :label-width="formLabelWidth">
          <el-image
            style="width: 200px; height: 200px"
            :src="userForm.avatar">
          </el-image>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <!--用户信息编辑-->
    <el-dialog @close="clearPwdForm" :title="title" :visible.sync="pwdFormVisible">
      <el-form :model="userForm" ref="pwdFormRef" :rules="rules">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="userForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-row>
          <el-col span="24">
            <el-form-item label="电子邮箱" prop="email" :label-width="formLabelWidth" style="width: 80%; display: inline-block;">
              <el-input v-model="userForm.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-button style="display: inline-block; margin-left: -50px">发送验证码</el-button>
          </el-col>
        </el-row>
        <el-form-item label="邮箱验证码" prop="check" :label-width="formLabelWidth">
          <el-input v-model="check" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新的密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="userForm.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closePwdDialog">取 消</el-button>
        <el-button type="primary" @click="submitPwdForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import userApi from '@/api/userManager'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不少于 6 位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,

      formLabelWidth: '130px',
      userForm: {},
      dialogFormVisible: false,
      title: '',
      pwdFormVisible: false,
      check: '',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 64, message: '长度在 4 到 50 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮件地址', trigger: 'blur' },
          { type: 'email', message: '请输入有效的邮件地址', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitForm() {
      this.$refs.userFormRef.validate((valid) => {
        if (valid) {
          // 提交
          userApi.saveUser(this.userForm).then(response => {
            this.$message({
              message: '新用户注册成功',
              type: 'success'
            })
            // 关闭对话框
            this.dialogFormVisible = false
          })
        } else {
          return false
        }
      })
    },
    clearEditForm() {
      this.userForm = {}
      this.$refs.userFormRef.clearValidate()
    },
    clearPwdForm() {
      this.check = null
      this.$refs.pwdFormRef.clearValidate()
    },
    openEditDialog(id) {
      if (id === null) {
        this.title = '新用户注册'
      }
      this.dialogFormVisible = true
    },
    openPwdDialog() {
      this.pwdFormVisible = true
    },
    closePwdDialog() {
      this.pwdFormVisible = false
    },
    submitPwdForm() {
      this.$refs.pwdFormRef.validate((valid) => {
        if (valid) {
          // 提交
          userApi.resetUserPwd(this.userForm).then(response => {
            this.$message({
              message: response.message,
              type: 'success'
            })
            // 关闭对话框
            delete this.check
            this.pwdFormVisible = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: black;
  }
}
.el-dialog .el-input {
  width: 85%;
}

/* reset element-ui css */
.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background-image: url('../../assets/images/login-bg.png');
  background-size: 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  .el-input2 {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item2 {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.el-dialog .el-input {
  width: 85%;
}

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 35px 55px 15px;
    margin: 0 auto;
    overflow: hidden;
    background-color: #242a34;
    border-radius: 16px;
    opacity: 0.85;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
