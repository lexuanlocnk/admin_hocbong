import React, { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import { CBadge } from '@coreui/react'
import axios from 'axios'
import config from '../config'

export const AppSidebarNav = ({ items }) => {
  const location = useLocation()
  const [check, setCheck] = useState('')
  const [position, checkPosition] = useState('')
  const [loadData, setLoadData] = useState(false)
  const [adminMenu, setAdminMenu] = useState('')
  const [permissions, setPermissions] = useState('')

  //getDataMenu
  const fetchAdminMenuData = async () => {
    try {
      const res = await axios.get(config.host + '/admin/admin-menu', {
        headers: config.headers,
      })
      const data = res.data.listAdminMenu
      localStorage.setItem('adminMenu', JSON.stringify(data))
      setAdminMenu(data)
    } catch (error) {
      console.error('Lỗi khi lấy thông tin admin:', error)
    }
  }
  useEffect(() => {
    fetchAdminMenuData()
  }, [])

  //getDataAdmin
  const fetchAdminData = async () => {
    try {
      const res = await axios.get(config.host + '/admin/information/show', {
        headers: config.headers,
      })
      const data = res.data.data.depart_id
      setPermissions(res.data.data.permissions)
      setCheck(data)
      localStorage.setItem('check', data)
      checkPosition(res.data.data.status)
      localStorage.setItem('position', res.data.data.status)
      setLoadData(true)
    } catch (error) {
      console.error('Lỗi khi lấy thông tin admin:', error)
    }
  }
  useEffect(() => {
    fetchAdminData()
  }, [])

  localStorage.removeItem('create')
  localStorage.removeItem('delete')
  localStorage.removeItem('edit')
  localStorage.removeItem('view')
  {
    Array.isArray(permissions) && permissions.map((row) => (row.name == 'create' ? localStorage.setItem('create', 'create') : ''))
  }
  {
    Array.isArray(permissions) && permissions.map((row) => (row.name == 'delete' ? localStorage.setItem('delete', 'delete') : ''))
  }
  {
    Array.isArray(permissions) && permissions.map((row) => (row.name == 'edit' ? localStorage.setItem('edit', 'edit') : ''))
  }
  {
    Array.isArray(permissions) && permissions.map((row) => (row.name == 'view' ? localStorage.setItem('view', 'view') : ''))
  }

  // console.log('phòng ban:', check)
  // console.log('chức:', position)

  const navLink = (name, icon, badge) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, index) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component
        {...(rest.to &&
          !rest.items && {
            component: NavLink,
          })}
        key={index}
        {...rest}
      >
        {navLink(name, icon, badge)}
      </Component>
    )
  }
  
  const navGroup = (item, index) => {
    const { component, name, icon, to, ...rest } = item
    const Component = component
    return (
      <Component idx={String(index)} key={index} toggler={navLink(name, icon)} visible={location.pathname.startsWith(to)} {...rest}>
        {item.items
          ?.filter((item) => check1(item.statusAdmin ? item.statusAdmin : [1]) == true)
          .map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
      </Component>
    )
  }
  const check1 = (brand) => {
    const isSubset = brand.indexOf(check) !== -1
    return isSubset
  }
  // return <React.Fragment>{items && items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}</React.Fragment>
  return (
    <React.Fragment>
      {items &&
        loadData &&
        items
          .filter((item) => check1(item.statusAdmin ? item.statusAdmin : [1]) == true)
          .map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </React.Fragment>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
