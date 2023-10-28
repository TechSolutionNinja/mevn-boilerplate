import { defineStore } from 'pinia'
import { request } from '@/utils/request'

export const useTodoStore = defineStore('todo', {
  state: () => {
    return { todos: [], statuses: null, priorities: null, selectedStatus: 'null', selecledPriority: null }
  },
  getters: {
    getStatuses() {
      return this.statuses
    },
    getPriorities() {
      return this.priorities
    },
    getTodos() {
      return this.todos
    }
  },
  actions: {
    init() {},
    fetchStatuses() {
      request('get', 'todos/statuses').then(res => {
        if (res) {
          this.statuses = res.sort((a, b) => a.order - b.order)
        }
      })
    },
    fetchPriorities() {
      request('get', 'todos/priorities').then(res => {
        if (res) {
          this.priorities = res.sort((a, b) => b.order - a.order)
        }
      })
    },
    async createTodo(payload) {
      let response

      await request('post', 'todos', payload).then(res => {
        response = !!res
      })

      return response
    },
    async fetchTodos() {
      let params = {}
      let response

      if (Array.isArray(this.todos) && this.todos.length > 0) {
        params.lastUpdatedDate = this.todos[0].lastUpdatedDate // with this, we are only fetching the todos that has been updated after the last todo in the list
      }

      await request('get', 'todos', params).then(res => {
        const ids = res?.map(todo => todo._id)

        this.todos = [...res, ...this.todos.filter(todo => !ids.includes(todo._id))]

        response = !!res
      })

      return response
    }
  }
})
