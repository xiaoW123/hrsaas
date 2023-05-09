import request from '@/utils/request'

// 获取员工表格信息
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}

// 获取公司信息数据
export function getCompanyInfo(id) {
  return request({
    url: `/company/${id}`,
    method: 'GET'
  })
}

// 根据id删除员工
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}

/** *
 * 编辑角色
 * ***/
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}
/**
 * 获取角色详情
 * **/
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

/** *
 * 新增角色
 * ***/
export function addRole(data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}
