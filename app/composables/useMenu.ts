export const useMenu = () => {
  const isOpen = useState('opened', () => false)

  function toggleMenu() {
    isOpen.value = !isOpen.value
  }

  const { t } = useI18n({ useScope: 'global' })

  const router = useRouter()
  const excludedRoutes = ['stories-id']
  const order = [
    'index',
    'prater',
    'stories-explorer',
    'create',
    'about',
    'legal',
    'privacy',
  ]

  const menuRoutes = computed(() =>
    router
      .getRoutes()
      .filter(
        (route) =>
          route.name !== undefined &&
          !excludedRoutes.includes(route.name as string)
      )
      .map((route) => {
        return {
          title: t(`components.menu.nav.${route.name as string}`),
          path: route.path,
          order: order.indexOf(route.name as string),
        }
      })
      .sort((a, b) => a.order - b.order)
  )

  return {
    isOpen,
    toggleMenu,
    menuRoutes,
  }
}
