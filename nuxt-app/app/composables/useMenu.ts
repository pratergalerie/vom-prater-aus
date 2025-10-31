export const useMenu = () => {
  const isOpen = useState('opened', () => false)

  function toggleMenu() {
    isOpen.value = !isOpen.value
  }

  const { t } = useI18n({ useScope: 'global' })

  const router = useRouter()

  const menuExcludedRoutes = [
    'accessibility',
    'draft-stories-submitted',
    'draft-stories-uuid',
    'stories-id',
    'stories-slug',
  ]
  const menuOrder = [
    'index',
    'prater',
    'stories',
    'stories-create',
    'about',
    'privacy',
    'terms',
  ]

  const footerExcludedRoutes = [
    'accessibility',
    'draft-stories-submitted',
    'draft-stories-uuid',
    'stories-id',
    'stories-slug',
  ]

  const footerOrder = [
    'index',
    'prater',
    'stories',
    'stories-create',
    'about',
    'accessibility',
    'privacy',
    'terms',
  ]

  const menuRoutes = computed(() =>
    router
      .getRoutes()
      .filter(
        (route) =>
          route.name !== undefined &&
          !menuExcludedRoutes.includes(route.name as string)
      )
      .map((route) => {
        return {
          title: t(`components.menu.nav.${route.name as string}`),
          path: route.path,
          order: menuOrder.indexOf(route.name as string),
        }
      })
      .sort((a, b) => a.order - b.order)
  )

  const footerRoutes = computed(() =>
    router
      .getRoutes()
      .filter(
        (route) =>
          route.name !== undefined &&
          !footerExcludedRoutes.includes(route.name as string)
      )
      .map((route) => {
        return {
          title: t(`components.menu.nav.${route.name as string}`),
          path: route.path,
          order: footerOrder.indexOf(route.name as string),
        }
      })
      .sort((a, b) => a.order - b.order)
  )

  return {
    isOpen,
    toggleMenu,
    menuRoutes,
    footerRoutes,
  }
}
