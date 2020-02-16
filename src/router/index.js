import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/reg',
    component: Layout,
    redirect: '/reg/table',
    name: 'Reg',
    meta: { title: '法规管理', icon: 'component' },
    children: [
      {
        path: 'org',
        name: 'Org',
        component: () => import('@/views/regulations/Organization'),
        meta: { title: '组织管理', icon: 'data' }
      },
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/regulations/Table'),
        meta: { title: '法规列表', icon: 'table' }
      },
      {
        path: 'addReg',
        name: 'AddRegulations',
        component: () => import('@/views/regulations/AddRegulations'),
        meta: { title: '新增法规', icon: 'form' }
      },
      {
        path: 'dire',
        name: 'Directory',
        component: () => import('@/views/directory/Directory'),
        meta: { title: '法规目录管理', icon: 'table' }
      },
      {
        path: 'addDire',
        name: 'AddDire',
        component: () => import('@/views/directory/AddDirectory'),
        meta: { title: '新增目录', icon: 'form' }
      },
      {
        path: 'terms',
        name: 'Terms',
        component: () => import('@/views/terms/Terms'),
        meta: { title: '条款列表', icon: 'table' }
      },
      {
        path: 'addTerms',
        name: 'addTerms',
        component: () => import('@/views/terms/AddTerms'),
        meta: { title: '新增条款', icon: 'form' }
      },
      {
        path: 'updateReg',
        name: 'UpdateReg',
        component: () => import('@/views/regulations/Update'),
        meta: { title: '修改法规' },
        hidden: true
      },
      {
        path: 'updateTerms',
        name: 'UpdateTerms',
        component: () => import('@/views/terms/Update'),
        meta: { title: '修改条款' },
        hidden: true
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/user',
    name: 'user',
    meta: {
      title: '用户管理',
      icon: 'user'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/users/Users'), // Parent router-view
        name: 'User',
        meta: { title: '用户列表', icon: 'peoples' }
      },
      {
        path: 'menu1'
      }
    ]
  },
  {
    path: '/consulting',
    component: Layout,
    redirect: '/consulting/con',
    name: 'consulting',
    meta: {
      title: '咨询管理',
      icon: 'message'
    },
    children: [
      {
        path: 'con',
        component: () => import('@/views/consulting/Consulting'), // Parent router-view
        name: 'Con',
        meta: { title: '咨询列表', icon: 'phone' }
      },
      {
        path: 'menu2'
      }
    ]
  },
  {
    path: '/settings',
    component: Layout,
    redirect: '/settings/web',
    name: 'settings',
    meta: {
      title: '设置',
      icon: 'list'
    },
    children: [
      {
        path: 'web',
        component: () => import('@/views/settings/WebSettings'), // Parent router-view
        name: 'Web',
        meta: { title: '网站设置', icon: 'international' }
      },
      {
        path: 'intro',
        component: () => import('@/views/settings/Introduction'),
        name: 'Intro',
        meta: { title: '公司介绍', icon: 'instructions' }
      },
      {
        path: 'service',
        component: () => import('@/views/settings/Service'),
        name: 'Service',
        meta: { title: '服务协议', icon: 'documentation' }
      },
      {
        path: 'smtp',
        component: () => import('@/views/settings/Smtp'),
        name: 'Smtp',
        meta: { title: '邮件SMTP设置', icon: 'email' }
      },
      {
        path: 'mess',
        component: () => import('@/views/settings/Message'),
        name: 'Mess',
        meta: { title: '短信设置', icon: 'tongxun' }
      },
      {
        path: 'admin',
        component: () => import('@/views/settings/Admin'),
        name: 'Admin',
        meta: { title: '管理员管理', icon: 'user' }
      },
      {
        path: 'feedback',
        component: () => import('@/views/settings/Feedback'),
        name: 'Feed',
        meta: { title: '意见反馈列表', icon: 'edit' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true } // 404 page must be placed at the end !!!
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
