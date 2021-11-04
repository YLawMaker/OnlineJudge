import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}


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
    path: '/examChoice',
    name: 'ExamChoice',
    component: () => import('@/components/User/ExamChoice.vue')
  },
  {
    path: '/examCompletion',
    name: 'ExamCompletion',
    component: () => import('@/components/User/ExamCompletion.vue')
  },
  {
    path: '/examProgramming',
    name: 'ExamProgramming',
    component: () => import('@/components/User/ExamProgramming.vue')
  },



  {
    path: '/teacherUserAside',
    name: 'TeacherUserAside',
    redirect: 'addExam',
    component: () => import('../views/TeacherUserAside.vue'),
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
        path: '/choiceQuestionList',
        name: 'ChoiceQuestionList',
        component: () => import('@/components/TeacherUser/ChoiceQuestionList.vue')
      },
      {
        path: '/completionQuestionList',
        name: 'CompletionQuestionList',
        component: () => import('@/components/TeacherUser/CompletionQuestionList.vue')
      },
      {
        path: '/testManage',
        name: 'TestManage',
        component: () => import('@/components/TeacherUser/TestManage.vue')
      },
      {
        path: '/groupInfoManage',
        name: 'GroupInfoManage',
        component: () => import('@/components/TeacherUser/GroupInfoManage.vue')
      },
      {
        path: '/groupUserManage',
        name: 'GroupUserManage',
        component: () => import('@/components/TeacherUser/GroupUserManage.vue')
      },

    ]
  },
  {
    path: '/examInfoHeader',
    name: 'ExamInfoHeader',
    redirect: 'candidateScore',
    component: () => import('../views/ExamInfoHeader.vue'),
    children: [
      {
        path: '/candidateScore',
        name: 'CandidateScore',
        component: () => import('@/components/TeacherUser/CandidateScore.vue')
      },
      {
        path: '/examChoiceQuestonManage',
        name: 'ExamChoiceQuestonManage',
        component: () => import('@/components/TeacherUser/ExamChoiceQuestonManage.vue')
      },
      {
        path: '/examCompletionQuestionManage',
        name: 'ExamCompletionQuestionManage',
        component: () => import('@/components/TeacherUser/ExamCompletionQuestionManage.vue')
      },
      {
        path: '/programmingManage',
        name: 'programmingManage',
        component: () => import('@/components/TeacherUser/programmingManage.vue')
      },
      {
        path: '/examAnalyse',
        name: 'ExamAnalyse',
        component: () => import('@/components/TeacherUser/ExamAnalyse.vue')
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
    redirect: 'components/TeacherManage',
    component: () => import('../views/AdminBackground'),
    children: [
      {
        path: '/components/TeacherManage',
        name: 'TeacherManage',
        component: () => import('../components/admin/TeacherManage')
      },

      {
        path: '/components/ExerciseLabelManage',
        name: 'ExerciseLabelManage',
        component: () => import('@/components/admin/ExerciseLabelManage')
      },
      {
        path: '/components/QuestionLabelManage',
        name: 'QuestionLabelManage',
        component: () => import('@/components/admin/QuestionLabelManage')
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
      {
        path: '/components/GroupManage',
        name: 'GroupManage',
        component: () => import('@/components/admin/GroupManage')
      },
    ]
  },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router