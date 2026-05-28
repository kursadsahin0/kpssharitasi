import { defineStore } from 'pinia'
import { scoreToStars } from 'src/utils/stars'

const STORAGE_KEY = 'kpss-progress-v1'

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveProgress(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

export const useProgressStore = defineStore('progress', {
  state: () => ({
    byTopic: loadProgress(),
    lastTopicId: localStorage.getItem('kpss-last-topic') || null,
  }),

  getters: {
    getTopicProgress: (state) => (topicId) =>
      state.byTopic[topicId] || {
        completed: false,
        stars: 0,
        bestScore: 0,
        attempts: 0,
        lastAttemptAt: null,
      },

    isTopicUnlocked: (state) => (topicId, orderedTopicIds) => {
      const index = orderedTopicIds.indexOf(topicId)
      if (index <= 0) return true
      const prevId = orderedTopicIds[index - 1]
      const prev = state.byTopic[prevId]
      return prev?.completed === true
    },

    subjectStats: (state) => (topicIds, questionCounts) => {
      let totalQuestions = 0
      let completedTopics = 0
      let totalStars = 0

      topicIds.forEach((id, i) => {
        totalQuestions += questionCounts[i] || 0
        const p = state.byTopic[id]
        if (p?.completed) completedTopics += 1
        if (p?.stars) totalStars += p.stars
      })

      return { totalQuestions, completedTopics, totalStars, topicCount: topicIds.length }
    },
  },

  actions: {
    persist() {
      saveProgress(this.byTopic)
    },

    recordAttempt(topicId, correct, total) {
      const percent = total > 0 ? Math.round((correct / total) * 100) : 0
      const stars = scoreToStars(percent)
      const existing = this.byTopic[topicId] || {
        completed: false,
        stars: 0,
        bestScore: 0,
        attempts: 0,
        lastAttemptAt: null,
      }

      this.byTopic[topicId] = {
        completed: percent >= 60,
        stars: Math.max(existing.stars, stars),
        bestScore: Math.max(existing.bestScore, percent),
        attempts: existing.attempts + 1,
        lastAttemptAt: new Date().toISOString(),
      }

      this.lastTopicId = topicId
      localStorage.setItem('kpss-last-topic', topicId)
      this.persist()
    },

    resetAll() {
      this.byTopic = {}
      this.lastTopicId = null
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem('kpss-last-topic')
    },
  },
})
