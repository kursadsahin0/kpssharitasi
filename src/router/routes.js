const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'ders/:subjectId',
        name: 'subject-map',
        component: () => import('pages/SubjectMapPage.vue'),
        meta: { title: 'Konu Haritası' },
      },
      {
        path: 'ders/:subjectId/konu/:topicId/quiz',
        name: 'quiz',
        component: () => import('pages/QuizPage.vue'),
        meta: { title: 'Soru Çöz' },
      },
      {
        path: 'ders/:subjectId/konu/:topicId/sonuc',
        name: 'result',
        component: () => import('pages/ResultPage.vue'),
        meta: { title: 'Sonuç' },
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
