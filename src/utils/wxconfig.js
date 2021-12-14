/*
    Android解决方法
  * 页面加入这段代码可以使Android机器页面再也不受到用户字体缩放强制改变大小
  */
function fontSizesetting() {
  console.log('限制微信字体大小')
  if (typeof WeixinJSBridge == 'object' && typeof WeixinJSBridge.invoke == 'function') {
    handleFontSize();
  } else {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', handleFontSize, false)
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', handleFontSize)
      document.attachEvent('onWeixinJSBridgeReady', handleFontSize)
    }
  }

  function handleFontSize() {
    // 设置网页字体为默认大小
    WeixinJSBridge.invoke('setFontSizeCallback', {
      'fontSize': 0
    })
    // 重写设置网页字体大小的事件
    WeixinJSBridge.on('menu:setfont', function() {
      WeixinJSBridge.invoke('setFontSizeCallback', {
        'fontSize': 0
      })
    })
  }
  document.body.addEventListener('touchmove', function(e) {
    e.preventDefault(); // 阻止默认的处理方式(阻止下拉滑动的效果)
  }, {
    passive: false
  });
}

export default fontSizesetting
