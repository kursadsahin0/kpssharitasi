import { defineStore } from 'pinia'
import { subjects } from 'src/assets/data/subjects'
import { topics } from 'src/assets/data/topics'
import { questions } from 'src/assets/data/questions/index'
import { getQuestionsForLevel } from 'src/utils/topicLevels'

export const useContentStore = defineStore('content', {
  state: () => ({
    subjects,
    topics,
    questions,
  }),

  getters: {
    getSubject: (state) => (id) => state.subjects.find((s) => s.id === id),

    topicsBySubject: (state) => (subjectId) =>
      state.topics
        .filter((t) => t.subjectId === subjectId)
        .sort((a, b) => a.order - b.order),

    questionsByTopic: (state) => (topicId) => {
      const topic = state.topics.find((t) => t.id === topicId)
      return getQuestionsForLevel(state.questions, topic)
    },

    questionCountByTopic: (state) => (topicId) => {
      const topic = state.topics.find((t) => t.id === topicId)
      return getQuestionsForLevel(state.questions, topic).length
    },

    getTopic: (state) => (id) => state.topics.find((t) => t.id === id),

    questionsBySubject: (state) => (subjectId) => {
      const sourceIds = new Set(
        state.topics
          .filter((t) => t.subjectId === subjectId)
          .map((t) => t.sourceTopicId ?? t.id),
      )
      return state.questions.filter((q) => sourceIds.has(q.topicId))
    },

    /** Şıksız ham soru listesi; şıklar QuizPage'de üretilir */
    quizQuestionsForTopic: (state) => (topicId) => {
      const topic = state.topics.find((t) => t.id === topicId)
      if (!topic) return []
      return getQuestionsForLevel(state.questions, topic)
    },
  },
})
