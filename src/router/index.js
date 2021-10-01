import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/userLogin',
    name: 'UserLogin',
    component: () => import('../views/UserLogin.vue')
  },
  {
    path: '/userRegister',
    name: 'UserRegister',
    component: () => import('../views/UserRegister.vue')
  },
  {
    path: '/managerLogin',
    name: 'ManagerLogin',
    component: () => import('../views/ManagerLogin.vue')
  },
  {
    path: '/examRankList',
    name: 'ExamRankList',
    component: () => import('@/components/User/ExamRankList.vue')
  },




  {
    path: '/teacherAside',
    name: 'TeacherAside',
    redirect: 'addExam',
    component: () => import('../views/TeacherAside.vue'),
    children: [
      { 
        path: '/addExam',
        name: 'AddExam',
        component: () => import('@/components/TeacherUser/AddExam.vue'),
      },
      {
        path: '/teacherInfo',
        name: 'TeacherInfo',
        component: () => import('@/components/TeacherUser/TeacherInfo.vue')
      },
      {
        path: '/choiceQuestionManage',
        name: 'choiceQuestionManage',
        component: () => import('@/components/TeacherUser/choiceQuestionManage.vue')
      },
      {
        path: '/programmingManage',
        name: 'programmingManage',
        component: () => import('@/components/TeacherUser/programmingManage.vue')
      },
      {
        path: '/programmingAnswerManage',
        name: 'programmingAnswerManage',
        component: () => import('@/components/TeacherUser/programmingAnswerManage.vue')
      },
    ]
  },




  {
    path: '/examDetail',
    name: 'ExamDetail',
    component: () => import('@/components/User/ExamDetail.vue')
  },
  {
    path: '/OnlineJudge',
    name: 'OnlineJudge',
    component: () => import('../views/OnlineJudge')
  },



  {
    path: '/',
    name: 'UserHeader',
    redirect: 'userMainInterface',
    component: () => import('../views/UserHeader'),
    children: [
      {
        path: '/exerciseList',
        name: 'ExerciseList',
        component: () => import('@/components/User/ExerciseList.vue'),
      },
      {
        path: '/userMainInterface',
        name: 'UserMainInterface',
        component: () => import('@/components/User/UserMainInterface.vue')
      },
      {
        path: '/exerciseDetail',
        name: 'ExerciseDetail',
        component: () => import('@/components/User/ExerciseDetail.vue')
      },
      {
        path: '/userRankList',
        name: 'UserRankList',
        component: () => import('@/components/User/UserRankList.vue')
      },
      {
        path: '/userInfo',
        name: 'UserInfo',
        component: () => import('@/components/User/UserInfo.vue')
      },
      {
        path: '/exerciseStatistics',
        name: 'ExerciseStatistics',
        component: () => import('@/components/User/ExerciseStatistics.vue')
      },
      {
        path: '/submitCode',
        name: 'SubmitCode',
        component: () => import('@/components/User/SubmitCode.vue')
      },
      {
        path: '/exerciseRealTimeStatus',
        name: 'ExerciseRealTimeStatus',
        component: () => import('@/components/User/ExerciseRealTimeStatus.vue')
      },
      {
        path: '/faq',
        name: 'FAQ',
        component: () => import('@/components/faq')
      },
      {
        path: '/examList',
        name: 'ExamList',
        component: () => import('../components/User/ExamList.vue')
      }
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
