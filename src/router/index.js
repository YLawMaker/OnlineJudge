import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
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
    path: '/teacherAside',
    name: 'TeacherAside',
    component: () => import('../views/TeacherAside.vue'),
    children: [
      {
        path: '/addExam',
        name: 'AddExam',
        component: () => import('@/components/teacher/AddExam.vue')
      },
      {
        path: '/teacherInfo',
        name: 'TeacherInfo',
        component: () => import('@/components/teacher/TeacherInfo.vue')
      },
    ]
  },
  {
    path: '/OnlineJudge',
    name: 'OnlineJudge',
    component: () => import('../views/OnlineJudge')
  },
  {
    path: '/',
    name: 'StudentHeader',
    redirect: 'userMainInterface',
    component: () => import('../views/StudentHeader'),
    children: [
      {
        path: '/problemArchive',
        name: 'ProblemArchive',
        component: () => import('@/components/student/ProblemArchive.vue')
      },
      {
        path: '/userMainInterface',
        name: 'UserMainInterface',
        component: () => import('@/components/student/UserMainInterface.vue')
      },
      {
        path: '/exerciseDetail',
        name: 'ExerciseDetail',
        component: () => import('@/components/student/ExerciseDetail.vue')
      },
      {
        path: '/userRankList',
        name: 'UserRankList',
        component: () => import('@/components/student/UserRankList.vue')
      },
      {
        path: '/studentInfo',
        name: 'StudentInfo',
        component: () => import('@/components/student/StudentInfo.vue')
      },
      {
        path: '/exerciseStatistics',
        name: 'ExerciseStatistics',
        component: () => import('@/components/student/ExerciseStatistics.vue')
      },
      {
        path: '/submitCode',
        name: 'SubmitCode',
        component: () => import('@/components/student/SubmitCode.vue')
      },
      {
        path: '/exerciseRealTimeStatus',
        name: 'ExerciseRealTimeStatus',
        component: () => import('@/components/student/ExerciseRealTimeStatus.vue')
      },
    ]
  },
  {
    path: '/AdminBackground',
    name: 'AdminBackground',
    component: () => import('../views/AdminBackground'),
    children: [
      {
        path: '/components/TeacherManage',
        name: 'TeacherManage',
        component: () => import('../components/admin/TeacherManage')
      },

      {
        path: '/components/ClassManage',
        name: 'ClassManage',
        component: () => import('@/components/admin/ClassManage')
      },

      {
        path: '/components/ExerciseManage',
        name: 'ExerciseManage',
        component: () => import('@/components/admin/ExerciseManage')
      },

      {
        path: '/components/ExerciseAnswerManage',
        name: 'ExerciseAnswerManage',
        component: () => import('@/components/admin/ExerciseAnswerManage')
      },
    ]
  },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
