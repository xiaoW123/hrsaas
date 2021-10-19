import request from '@/utils/request'
// 员工列表

export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple',
  })
}

// 获取员工的综合列表数据
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}

export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}


export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}