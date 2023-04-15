import { useLayoutEffect } from 'react'
import { useLocalStorageState, useMemoizedFn } from 'ahooks'

const darkModeOn = () => {
  document.documentElement.classList.add('dark')
}

const darkModeOff = () => {
  document.documentElement.classList.remove('dark')
}

const useTheme = () => {
  const [theme, setTheme] = useLocalStorageState('theme-mode')

  useLayoutEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
    prefersDarkMode.addEventListener('change', (e) => {
      ;(e.matches ? darkModeOn : darkModeOff)()
    })
    if (
      theme === 'dark' ||
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      darkModeOn()
      setTheme('dark')
    } else {
      darkModeOff()
      setTheme('light')
    }
  }, [])

  const toggleTheme = useMemoizedFn((type?: 'light' | 'dark') => {
    const c = type || (theme === 'dark' ? 'light' : 'dark')
    console.log(c)
    setTheme(type || (theme === 'dark' ? 'light' : 'dark'))
    document.documentElement.classList.contains('dark')
      ? document.documentElement.classList.remove('dark')
      : document.documentElement.classList.add('dark')
  })

  return {
    theme,
    toggleTheme
  }
}

export default useTheme
