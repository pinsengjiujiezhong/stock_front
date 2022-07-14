export default {
  set(key, value) {
    window.localStorage.setItem(key, value)
  },
  get(key) {
    const value = window.localStorage.getItem(key)
    return value || ''
  },
  remove(key) {
    window.localStorage.removeItem(key)
  }
}
