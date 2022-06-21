<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
  </view>
  <uni-badge size="small" :text="100" absolute="rightBottom" type="primary">
    <button type="default">右上</button>
</uni-badge>
<uni-badge text="1"></uni-badge>
<uni-badge text="3" type="primary" :inverted="true"></uni-badge>
</template>

<script>
import uniBadge from '@dcloudio/uni-ui/lib/uni-badge/uni-badge.vue' 
export default {
  components: {
          components: {uniBadge}
        },
  data() {
    return {
      title: 'Hello',
    }
  },
  onLoad() {},
  methods: {},
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
