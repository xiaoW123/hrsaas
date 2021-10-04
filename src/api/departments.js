import request from '@/utils/request'
// 获取组织架构的数据

export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

// 删除部门业务
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
    // 同样的地址，不同的方法，执行不同的业务
    // delete删除业务
    // get 获取业务
    // post 新增业务
    // put修改业物
  })
}

// 添加部门业务
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data: data
  })
}

// 编辑业务
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 编辑业务
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
} 