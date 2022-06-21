<template>
  <open-data type="userAvatarUrl" :default-avatar="defaultAvatarUrl"></open-data>

</template>

<script>
import uniBadge from '@dcloudio/uni-ui/lib/uni-badge/uni-badge.vue' 
export default {
  components: {
          components: {uniBadge}
        },
  data() {
    return {
      defaultAvatarUrl : 'https://qn.tuwei.space/applet/default_avator.png',
      nickName: 'Hello',
      avatarUrl:'',
    }
  },
  onLoad() {},
  methods: {
    //獲取用戶信息
    getUserInfo(){ 
                let that = this
                uni.getUserProfile({
                    desc:"weixin", // 指明用途,这个参数是必须的
                    success:function(res){
                        that.nickName = res.userInfo.nickName
                        that.avatarUrl = res.userInfo.avatarUrl
                        console.log(res.uerInfo)
                    }
                })
            }
  },
}
</script>

<style>

</style>
