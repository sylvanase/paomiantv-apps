//index.js
//获取应用实例
const app = getApp()

Page({
    data: {

    },
    linkToAccount: function () { // 跳转至收支明细
        wx.navigateTo({
            url: 'account/account'
        })
    },
    onLoad: function () {

    }
})
