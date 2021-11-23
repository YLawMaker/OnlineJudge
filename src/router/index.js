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
    component: () => import('@/components/Exam/ExamRankList.vue')
  },
  {
    path: '/examChoice',
    name: 'ExamChoice',
    component: () => import('@/components/Exam/ExamChoice.vue')
  },
  {
    path: '/examCompletion',
    name: 'ExamCompletion',
    component: () => import('@/components/Exam/ExamCompletion.vue')
  },
  {
    path: '/examProgramming',
    name: 'ExamProgramming',
    component: () => import('@/components/Exam/ExamProgramming.vue')
  },


  {
    path: '/teacherUserAside',
    name: 'TeacherUserAside',
    redirect: 'examInfoList',
    component: () => import('../views/TeacherUserAside.vue'),
    children: [
      {
        path: '/examInfoList',
        name: 'ExamInfoList',
        component: () => import('@/components/ExamManage/ExamInfoList.vue'),
      },

      {
        path: '/teacherInfo',
        name: 'TeacherInfo',
        component: () => import('@/components/TeacherUser/TeacherInfo.vue')
      },
      {
        path: '/choiceQuestionList',
        name: 'ChoiceQuestionList',
        component: () => import('@/components/Question/ChoiceQuestionList.vue')
      },
      {
        path: '/completionQuestionList',
        name: 'CompletionQuestionList',
        component: () => import('@/components/Question/CompletionQuestionList.vue')
      },
      {
        path: '/testInfoList',
        name: 'TestInfoList',
        component: () => import('@/components/Test/TestInfoList.vue')
      },
      {
        path: '/testProblemList',
        name: 'TestProblemList',
        component: () => import('@/components/Test/TestProblemList.vue')
      },
      {
        path: '/groupInfoList',
        name: 'GroupInfoList',
        component: () => import('@/components/Group/GroupInfoList.vue')
      },
      {
        path: '/groupUserList',
        name: 'GroupUserList',
        component: () => import('@/components/Group/GroupUserList.vue')
      },

    ]
  },
  {
    path: '/examInfoHeader',
    name: 'ExamInfoHeader',
    redirect: 'examInfo',
    component: () => import('../views/ExamInfoHeader.vue'),
    children: [
      {
        path: '/candidateScore',
        name: 'CandidateScore',
        component: () => import('@/components/ExamManage/CandidateScore.vue')
      },
      {
        path: '/examChoiceQuestonList',
        name: 'ExamChoiceQuestonList',
        component: () => import('@/components/ExamManage/ExamChoiceQuestonList.vue')
      },
      {
        path: '/examCompletionQuestionList',
        name: 'ExamCompletionQuestionList',
        component: () => import('@/components/ExamManage/ExamCompletionQuestionList.vue')
      },
      {
        path: '/programmingList',
        name: 'programmingList',
        component: () => import('@/components/ExamManage/programmingList.vue')
      },
      {
        path: '/examAnalyse',
        name: 'ExamAnalyse',
        component: () => import('@/components/ExamManage/ExamAnalyse.vue')
      },
      {
        path: '/examInfo',
        name: 'ExamInfo',
        component: () => import('@/components/ExamManage/ExamInfo.vue'),
      },
    ]
  },



  {
    path: '/examDetail',
    name: 'ExamDetail',
    component: () => import('@/components/Exam/ExamDetail.vue')
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
        component: () => import('@/components/Exercise/ExerciseList.vue'),
      },
      {
        path: '/userMainInterface',
        name: 'UserMainInterface',
        component: () => import('@/components/User/UserMainInterface.vue')
      },
      {
        path: '/exerciseDetail',
        name: 'ExerciseDetail',
        component: () => import('@/components/Exercise/ExerciseDetail.vue')
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
        component: () => import('@/components/Exercise/ExerciseStatistics.vue')
      },
      {
        path: '/submitCode',
        name: 'SubmitCode',
        component: () => import('@/components/Exercise/SubmitCode.vue')
      },
      {
        path: '/exerciseRealTimeStatus',
        name: 'ExerciseRealTimeStatus',
        component: () => import('@/components/Exercise/ExerciseRealTimeStatus.vue')
      },
      {
        path: '/faq',
        name: 'FAQ',
        component: () => import('@/components/faq')
      },
      {
        path: '/examList',
        name: 'ExamList',
        component: () => import('../components/Exam/ExamList.vue')
      },
      {
        path: '/testList',
        name: 'TestList',
        component: () => import('../components/Test/TestList.vue')
      },
      {
        path: '/testDetail',
        name: 'TestDetail',
        component: () => import('../components/Test/TestDetail.vue')
      },
      {
        path: '/testStandings',
        name: 'TestStandings',
        component: () => import('../components/Test/TestStandings.vue')
      },
      {
        path: '/testExerciseDetail',
        name: 'TestExerciseDetail',
        component: () => import('../components/Test/TestExerciseDetail.vue')
      },
      {
        path: '/testCodeSubmit',
        name: 'TestCodeSubmit',
        component: () => import('../components/Test/TestCodeSubmit.vue')
      },
      {
        path: '/testProgrammingRealTimeStatus',
        name: 'TestProgrammingRealTimeStatus',
        component: () => import('../components/Test/TestProgrammingRealTimeStatus.vue')
      },
      {
        path: '/personalExamHistory',
        name: 'PersonalExamHistory',
        component: () => import('@/components/Exam/PersonalExamHistory.vue')
      },
    ]
  },



  {
    path: '/AdminBackground',
    name: 'AdminBackground',
    redirect: 'components/TeacherList',
    component: () => import('../views/AdminBackground'),
    children: [
      {
        path: '/components/TeacherList',
        name: 'TeacherList',
        component: () => import('../components/TeacherUser/TeacherList')
      },
      {
        path: '/components/QuestionLabelList',
        name: 'QuestionLabelList',
        component: () => import('@/components/Label/QuestionLabelList')
      },

      {
        path: '/components/ExerciseInfoList',
        name: 'ExerciseInfoList',
        component: () => import('@/components/Exercise/ExerciseInfoList')
      },

      {
        path: '/components/ExerciseAnswerList',
        name: 'ExerciseAnswerList',
        component: () => import('@/components/Exercise/ExerciseAnswerList')
      },
      {
        path: '/components/GroupList',
        name: 'GroupList',
        component: () => import('@/components/Group/GroupList')
      },
    ]
  },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router