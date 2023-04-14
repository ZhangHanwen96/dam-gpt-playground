import { useLayoutEffect } from 'react'
import { useLocalStorageState, useMemoizedFn } from 'ahooks'

const useTheme = () => {
  const [theme, setTheme] = useLocalStorageState('theme', {
    defaultValue: 'light'
  })

  useLayoutEffect(() => {
    // setTheme('dark')
    // if (!document.documentElement.classList.contains('dark')) {
    //   document.documentElement.classList.add('dark')
    // }
    // return
    if (
      theme === 'dark' ||
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
      setTheme('dark')
    } else {
      document.documentElement.classList.remove('dark')
      setTheme('light')
    }
  }, [])

  const toggleTheme = useMemoizedFn((type?: 'light' | 'dark') => {
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
