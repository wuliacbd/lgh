// components/list/list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    feeds: {
      type: Array,
      value: [],
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    preview: e => {
      wx.previewImage({
        urls: e.currentTarget.dataset.urls,
        current: e.currentTarget.dataset.src
      })
    }
  }
})
