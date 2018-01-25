//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        openItem: -1, // 展开的问题索引
        questionList: [
            {title: '泡面的客服电话是？', des: '66666'},
            {title: '泡面的客服电话是？', des: '下载泡面短视频。分享你拍的视频即可得到红包机会，啦啦啦啦啦', open: false},
            {title: '泡面的客服电话是？', des: '66666'},
            {title: '泡面的客服电话是？', des: '66666'},
            {title: '泡面的客服电话是？', des: '66666'},
            {title: '泡面的客服电话是？', des: '66666'}
        ]
    },
    openItem: function (e) {
        var _self = this;
        var currentItemId = e.currentTarget.dataset.id;
        if(_self.data.openItem !== currentItemId){ // 如果当前点击打开的item与以展开的不相等，更换openItem值
            _self.setData({
                openItem: currentItemId,
            })
            console.log(_self.data.openItem)
        } else {
            _self.setData({
                openItem: -1,
            })
        }
        /*_self.setData({
            questionList: currentItem,
        })*/
    },
    onLoad: function () {

    }
})
