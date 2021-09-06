import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/homePage',
    name: 'HomePage',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/studentLogin',
    name: 'StudentLogin',
    component: () => import('../views/StudentLogin.vue')
  },
  {
    path: '/managerLogin',
    name: 'ManagerLogin',
    component: () => import('../views/ManagerLogin.vue')
  },
  {
    path: '/manage',
    name: 'ManageSystem',
    component: () => import('../views/ManageSystem.vue')
  },
  {
    path: '/bookInfo',
    name: 'BookInfo',
    component: () => import('../views/BookInfo.vue')
  },
  {
    path: '/OnlineJudge',
    name: 'OnlineJudge',
    component: () => import('../views/OnlineJudge')
  },
  {
    path: '/AdminBackground',
    name: 'AdminBackground',
    component: () => import('../views/AdminBackground'),
    children: [
      {
        path: '/components/TeacherManage',
        name: 'TeacherManage',
        component: () => import('../components/TeacherManage')
      },

      {
        path: '/components/ClassManage',
        name: 'ClassManage',
        component: () => import('@/components/ClassManage')
      },

      {
        path: '/components/ExerciseManage',
        name: 'ExerciseManage',
        component: () => import('@/components/ExerciseManage')
      },

      {
        path: '/components/ExerciseAnswerManage',
        name: 'ExerciseAnswerManage',
        component: () => import('@/components/ExerciseAnswerManage')
      },
    ]
  },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
