// 自定义指令
export const imagerror = {
  // inserted：指令对象，会在当前dom元素插入到节点之后执行
  inserted(dom, options) {
    // 当我们使用指令的元素出现异常是调用
    dom.onerror = function () {
      // 如果src出现异常，设置默认的
      dom.src = options.value
    }
  }
}
