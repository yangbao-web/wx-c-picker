//获取应用实例
const app = getApp()

Page({
  data: {
    visible: false,
    list: [1, 2, 3, 4, 5, 6, 7, 8],
    value: 2,
  },
  onLoad: function () {
  },
  handleClick() {
    this.setData({
      visible: true
    })
  },
  handleCancel() {
    this.setData({
      visible: false
    })
  },
  handleConfirm(e) {
    this.setData({
      value: e.detail.value,
      visible: false
    })
  },
})
