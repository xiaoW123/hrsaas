// 负责管理所有的自定义指令
export const imagerror = {
  // 指令对象 会将当前的dom/el元素插入到节点之后执行
  // dom/el表示当前指令作用的dom对象
  // 当图片有地址，但是没有加载成功时，会报错，触发时间 => onerror
  // binding是 指令中的变量的解释
  inserted(el, binding) {
    el.onerror = function() {
      //图片异常时，设置默认图片
      el.src = binding.value //默认图片
    }
  }
}