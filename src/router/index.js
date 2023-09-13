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
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
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
      meta: { title: '首页', icon: 'el-icon-menu' }
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example'
    // meta: { title: 'Test', icon: 'el-icon-s-help' },
    // children: [
    //   {
    //     path: 'table',
    //     name: 'Table',
    //     component: () => import('@/views/table/index'),
    //     meta: { title: 'Table', icon: 'table' }
    //   },
    //   {
    //     path: 'tree',
    //     name: 'Tree',
    //     component: () => import('@/views/tree/index'),
    //     meta: { title: 'Tree', icon: 'tree' }
    //   }
    // ]
  },

  {
    path: '/parking',
    component: Layout,
    redirect: '/parking/search',
    name: 'parking',
    meta: { title: '车位', icon: 'el-icon-truck' },
    children: [
      {
        path: 'search',
        name: 'search',
        component: () => import('@/views/parking/search.vue'),
        meta: { title: '查询车位', icon: 'el-icon-search' }
      },
      {
        path: 'order',
        name: 'order',
        component: () => import('@/views/parking/order.vue'),
        meta: { title: '我的订单', icon: 'el-icon-document' }
      },
      {
        path: 'remark',
        name: 'remark',
        component: () => import('@/views/parking/remark.vue'),
        meta: { title: '我的评价', icon: 'el-icon-chat-dot-round' }
      },
      {
        path: 'myParkingLot',
        name: 'myParkingLot',
        component: () => import('@/views/parking/myParkingLot.vue'),
        meta: { title: '我的车位', icon: 'el-icon-upload2' }
      },
      {
        path: 'myFollow',
        name: 'myFollow',
        component: () => import('@/views/parking/myFollow.vue'),
        meta: { title: '我的关注', icon: 'el-icon-star-off' }
      },
      {
        path: 'mapView',
        name: 'mapView',
        component: () => import('@/views/parking/mapView.vue'),
        meta: { title: '查看地图', icon: 'el-icon-map-location' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout
    // children: [
    //   {
    //     path: 'index',
    //     name: 'Form',
    //     component: () => import('@/views/form/index'),
    //     meta: { title: 'Form', icon: 'form' }
    //   }
    // ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested'
    // meta: {
    //   title: 'Nested',
    //   icon: 'nested'
    // },
    // children: [
    //   {
    //     path: 'menu1',
    //     component: () => import('@/views/nested/menu1/index'), // Parent router-view
    //     name: 'Menu1',
    //     meta: { title: 'Menu1' },
    //     children: [
    //       {
    //         path: 'menu1-1',
    //         component: () => import('@/views/nested/menu1/menu1-1'),
    //         name: 'Menu1-1',
    //         meta: { title: 'Menu1-1' }
    //       },
    //       {
    //         path: 'menu1-2',
    //         component: () => import('@/views/nested/menu1/menu1-2'),
    //         name: 'Menu1-2',
    //         meta: { title: 'Menu1-2' },
    //         children: [
    //           {
    //             path: 'menu1-2-1',
    //             component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
    //             name: 'Menu1-2-1',
    //             meta: { title: 'Menu1-2-1' }
    //           },
    //           {
    //             path: 'menu1-2-2',
    //             component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
    //             name: 'Menu1-2-2',
    //             meta: { title: 'Menu1-2-2' }
    //           }
    //         ]
    //       },
    //       {
    //         path: 'menu1-3',
    //         component: () => import('@/views/nested/menu1/menu1-3'),
    //         name: 'Menu1-3',
    //         meta: { title: 'Menu1-3' }
    //       }
    //     ]
    //   },
    //   {
    //     path: 'menu2',
    //     component: () => import('@/views/nested/menu2/index'),
    //     name: 'Menu2',
    //     meta: { title: 'menu2' }
    //   }
    // ]
  },

  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/user',
    name: 'user',
    meta: { title: '系统管理', icon: 'el-icon-s-tools' },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/sys/user.vue'),
        meta: { title: '用户管理', icon: 'el-icon-user' }
      },
      {
        path: 'parking',
        name: 'parking',
        component: () => import('@/views/sys/parking.vue'),
        meta: { title: '车位管理', icon: 'el-icon-document-copy' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://www.cug.edu.cn',
        meta: { title: '链接', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
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
