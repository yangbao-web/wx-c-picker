// components/c-picker/c-picker.js
const HEIGHT = 48
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: Boolean,
      value: false,
      observer(val) {
        if (val) {
          this.showModal()
        } else {
          this.hideModal()
        }
      }
    },
    title: {
      type: String,
      value: ''
    },
    data: {
      type: Array,
      value: [],
    },
    value: {
      type: [Number, String],
      value: 0,
      observer(val) {
        if (val || val === 0) {
          this.setData({
            actived: this.data.data.indexOf(val)
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    transitionDuration: 0,
    translateY: 0,
    actived: 0,
  },
  lifetimes: {
    attached: function () {
      // 已经滑动的距离
      if (!this.slidingDistanceY) {
        this.slidingDistanceY = 0
      }
      this.handleAnimated(this.data.actived)
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleTouchstart(e) {
      this.startY = e.changedTouches[0].clientY
    },
    handleTouchmove(e) {
      this.moveY = e.changedTouches[0].clientY
      let translateY = this.slidingDistanceY + this.moveY - this.startY
      if (translateY >= 0) {
        this.slidingDistanceY = 0
        this.startY = this.moveY
        translateY = this.slidingDistanceY
      } else if (Math.abs(translateY) >= HEIGHT * (this.data.data.length - 1)) {
        this.slidingDistanceY = -HEIGHT * (this.data.data.length - 1)
        this.startY = this.moveY
        translateY = this.slidingDistanceY
      }
      this.setData({
        translateY
      })
    },
    handleTouchend(e) {
      this.endY = e.changedTouches[0].clientY
      this.slidingDistanceY = this.slidingDistanceY + this.endY - this.startY
      const absSlidingDistanceY = Math.abs(this.slidingDistanceY)
      let actived = this.data.actived
      if (absSlidingDistanceY % HEIGHT > HEIGHT / 2) {
        actived = Math.ceil(absSlidingDistanceY / HEIGHT)
      } else {
        actived = Math.floor(absSlidingDistanceY / HEIGHT)
      }
      this.handleAnimated(actived)
    },
    handleAnimated(actived) {
      // console.log('handleTouchend=>', actived)
      this.slidingDistanceY = -actived * HEIGHT
      this.setData({
        actived,
        translateY: this.slidingDistanceY,
        transitionDuration: 200,
      })
      setTimeout(() => {
        this.setData({
          transitionDuration: 0,
        })
      }, 200)
    },

    handleChooseStart (e) {
      this.chooseStartClient = e.changedTouches[0]
    },
    handleChooseEnd (e) {
      this.chooseEndClient = e.changedTouches[0]
      if (Math.abs(this.chooseStartClient.clientX - this.chooseEndClient.clientX) < 2 && Math.abs(this.chooseStartClient.clientY - this.chooseEndClient.clientY) < 2) {
        this.handleChoose(e)
      }
    },
    handleChoose(e) {
      let actived = e.currentTarget.dataset.index
      this.handleAnimated(actived)
    },
    handleCancel () {
      this.triggerEvent('cancel')
    },
    handleConfirm () {
      this.triggerEvent('confirm', { value: this.data.data[this.data.actived] })
    },

    /** 动画 */
    // 显示遮罩层
    showModal: function () {
      const animation = wx.createAnimation({
        duration: 200, // 动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
        timingFunction: 'linear', // 动画的效果 默认值是linear
      })
      this.animation = animation
      this.setData({
        show: true
      }, () => {
        setTimeout(() => {
          this.fadeIn()// 调用显示动画
        }, 20)
      })
    },
    // 隐藏遮罩层
    hideModal: function () {
      const animation = wx.createAnimation({
        duration: 300, // 动画的持续时间 默认400ms
        timingFunction: 'linear', // 动画的效果 默认值是linear
      })
      this.animation = animation
      this.fadeDown()// 调用隐藏动画
      setTimeout(() => {
        this.setData({
          show: false
        })
      }, 220)// 先执行下滑动画，再隐藏模块
    },
    // 动画集
    fadeIn: function () {
      this.animation.translateY(0).opacity(1).step()
      this.setData({
        animationData: this.animation.export(), // 动画实例的export方法导出动画数据传递给组件的animation属性
      })
    },
    fadeDown: function () {
      this.animation.translateY('100%').opacity(0).step()
      this.setData({
        animationData: this.animation.export(),
      })
    },
  }
})
