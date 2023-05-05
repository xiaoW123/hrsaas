import request from '@/utils/request'
// 查询部门
export function getDepartments() {
  return request({
    url: '/company/department',
    method: 'GET'
  })
}
// 删除部门
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    methods: 'DELETE'
  })
}
// 新增部门
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}
// 新增部门-获取员工的简单列表
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple',
    method: 'GET'
  })
}
// 根据id获取部门详细
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'GET'
  })
}

// 根据ID修改部门详情
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}
