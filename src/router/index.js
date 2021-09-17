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
    path: '/studentRegister',
    name: 'StudentRegister',
    component: () => import('../views/StudentRegister.vue')
  },
  {
    path: '/managerLogin',
    name: 'ManagerLogin',
    component: () => import('../views/ManagerLogin.vue')
  },
  {
    path: '/examRankList',
    name: 'ExamRankList',
    component: () => import('@/components/student/ExamRankList.vue')
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
        component: () => import('@/components/teacher/AddExam.vue'),
      },
      {
        path: '/teacherInfo',
        name: 'TeacherInfo',
        component: () => import('@/components/teacher/TeacherInfo.vue')
      },
      {
        path: '/choiceQuestionManage',
        name: 'choiceQuestionManage',
        component: () => import('@/components/teacher/choiceQuestionManage.vue')
      },
      {
        path: '/programmingManage',
        name: 'programmingManage',
        component: () => import('@/components/teacher/programmingManage.vue')
      },
      {
        path: '/programmingAnswerManage',
        name: 'programmingAnswerManage',
        component: () => import('@/components/teacher/programmingAnswerManage.vue')
      },
    ]
  },




  {
    path: '/examDetail',
    name: 'ExamDetail',
    component: () => import('@/components/student/ExamDetail.vue')
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
        path: '/exerciseList',
        name: 'ExerciseList',
        component: () => import('@/components/student/ExerciseList.vue')
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
        path: '/studentRankList',
        name: 'StudentRankList',
        component: () => import('@/components/student/StudentRankList.vue')
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
      {
        path: '/faq',
        name: 'FAQ',
        component: () => import('@/components/faq')
      },
      {
        path: '/examList',
        name: 'ExamList',
        component: () => import('../components/student/ExamList.vue')
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
