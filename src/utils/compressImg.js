export function compressImg(file) {
  var files
  var fileSize = parseFloat(parseInt(file['size']) / 1024 / 1024).toFixed(2)
  var read = new FileReader()
  read.readAsDataURL(file)
  return new Promise(function (resolve, reject) {
    read.onload = function (e) {
      var img = new Image()
      img.src = e.target.result
      img.onload = function () {
        // 默认按比例压缩
        var w = this.width
        var h = this.height
        // 生成canvas
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        var base64
        // 创建属性节点
        canvas.setAttribute('width', w)
        canvas.setAttribute('height', h)
        ctx.drawImage(this, 0, 0, w, h)
        if (fileSize < 1) {
          // 如果图片小于一兆 那么不执行压缩操作
          base64 = canvas.toDataURL(file['type'], 1)
        } else if (fileSize > 1 && fileSize < 2) {
          // 如果图片大于1M并且小于2M 那么压缩0.5
          base64 = canvas.toDataURL(file['type'], 0.5)
        } else {
          // 如果图片超过2m 那么压缩0.2
          base64 = canvas.toDataURL(file['type'], 0.2)
        }
        // 回调函数返回file的值（将base64编码转成file）
        resolve(base64)
      }
    }
  })
}
