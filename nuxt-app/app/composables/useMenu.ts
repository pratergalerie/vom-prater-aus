export const useMenu = () => {
  const isOpen = useState('opened', () => false)

  function toggleMenu() {
    isOpen.value = !isOpen.value
  }

  const { t } = useI18n({ useScope: 'global' })

  const router = useRouter()

  const menuExcludedRoutes = [
    'admin-dashboard',
    'admin-login',
    'admin-story-id',
    'editor-id',
    'stories-edit-id',
    'stories-id',
    'stories-slug',
    'draft-stories-submitted',
    'draft-stories-uuid',
  ]
  const menuOrder = [
    'index',
    'prater',
    'stories',
    'stories-create',
    'about',
    'accessibility',
    'privacy',
    'terms',
  ]

  const footerExcludedRoutes = [
    'admin-dashboard',
    'admin-login',
    'admin-story-id',
    'editor-id',
    'index',
    'stories-edit-id',
    'stories-id',
    'stories-slug',
    'draft-stories-submitted',
    'draft-stories-uuid',
  ]

  const footerOrder = [
    'prater',
    'stories-list',
    'stories-create',
    'about',
    'accessibility',
    'privacy',
    'terms',
    'admin-dashboard',
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
