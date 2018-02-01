//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    amount: 0
  },
  linkToAccount: function () { // 跳转至收支明细
    wx.navigateTo({
      url: 'account/account'
    })
  },
  onLoad: function () {
    this.getAccount()

  },
  getAccount: function () {
    var sessionid = app.globalData.jsessionid;
    wx.request({
      url: app.globalData.baseUrl + '/api/packet/account?jsessionid=' + sessionid,
      success: result => {
        console.log("getAccount=" + JSON.stringify(result.data));
        if (result.data && result.data.status == 0 && result.data.data) {
          this.setData({
            amount: result.data.data.amount
          })
        }
      }
    })
  },
})
