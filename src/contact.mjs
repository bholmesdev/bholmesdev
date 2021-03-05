import { setSectionObserver } from '../utils/client/nav-sections'

export default () => {
  const cleanupSectionObserver = setSectionObserver([])

  return () => {
    cleanupSectionObserver()
  }
}
