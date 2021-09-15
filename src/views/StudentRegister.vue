<template>
  <div class="register_center">
    <el-form>
      <el-form-item label="账号"
        ><br /><el-input style="width: 300px"> </el-input>
      </el-form-item>
      <el-form-item label="密码"
        ><br /><el-input style="width: 300px"> </el-input>
      </el-form-item>
      <el-form-item label="重复密码"
        ><br /><el-input style="width: 300px"> </el-input>
      </el-form-item>
      <el-form-item label="邮箱"
        ><br /><el-input style="width: 300px"> </el-input>
      </el-form-item>
      <el-form-item><el-button>注册</el-button> </el-form-item>
    </el-form>
  </div>
</template>
<style>
.register_center {
  background-color: rgba(255, 255, 255, 0.7);
  width: 350px;
  height: 280px;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
}
</style>