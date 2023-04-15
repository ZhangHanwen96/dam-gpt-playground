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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleTheme = useMemoizedFn((type?: 'light' | 'dark') => {
    setTheme(type || (theme === 'dark' ? 'light' : 'dark'))
    document.documentElement.classList.contains('dark')
      ? darkModeOff()
      : darkModeOn()
  })

  return {
    theme,
    toggleTheme
  }
}

export default useTheme
