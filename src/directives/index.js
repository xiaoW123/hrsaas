// 自定义指令
export const imagerror = {
  // inserted：指令对象，会在当前dom元素插入到节点之后执行
  inserted(dom, options) {
    // console.log(options)
    // 判断如果src为空
    dom.src = dom.src || options.value
    // 当我们使用指令的元素出现异常是调用
    dom.onerror = function () {
      // 如果src出现异常，设置默认的
      dom.src = options.value
    }
  },
  // 与inserted一样，是一个钩子函数
  // 该钩子函数会在 当前指令作用的 组件更新数据完毕之后 执行
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}
