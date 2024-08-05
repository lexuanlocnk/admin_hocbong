import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CContainer, CHeader, CHeaderBrand, CHeaderDivider, CHeaderNav, CHeaderToggler, CNavLink, CNavItem } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons'
import { AppHeaderDropdown } from './header/index'
import axios from 'axios'
import config from 'src/config'

const AppHeader = () => {
  const [username, setUsername] = useState('')
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  //getDataAdmin
  const fetchAdminData = async () => {
    try {
      const res = await axios.get(config.host + '/admin/information/show', {
        headers: config.headers,
      })
      const data = res.data.data
      localStorage.setItem('rules', data.adminid)
      setUsername(data.display_name)
    } catch (error) {
      console.error('Lỗi khi lấy thông tin admin:', error)
    }
  }
  useEffect(() => {
    fetchAdminData()
  }, [])

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler className="ps-1" onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}>
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          {/* <CIcon icon={logo} height={48} alt="Logo" /> */}
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            {/* <CNavLink href="/" component={NavLink}> */}
            {/* <CNavLink href="/">Bảng điều khiển</CNavLink> */}
          </CNavItem>
          <CNavItem>{/* <CNavLink href="/product">Sản phẩm</CNavLink> */}</CNavItem>
          <CNavItem>{/* <CNavLink href="/order">Đơn hàng</CNavLink> */}</CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          <CNavItem>
            <CNavLink href="/order">Chào {username}</CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
    </CHeader>
  )
}

export default AppHeader
