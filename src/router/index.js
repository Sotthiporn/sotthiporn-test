import { createRouter, createWebHistory } from 'vue-router'

// Dynamic routes
const routesList = []
const views = import.meta.glob('../views/**/*.vue')
const totalViews = Object.keys(views).length
for (const path in views) {
  const name = path.replace('../views/', '').replace('.vue', '').toLowerCase()

  if (totalViews === 1) {
    routesList.push({
      path: '/',
      name: `${name}-alias`,
      component: views[path],
    })
  }

  routesList.push({
    path: `/${name}`,
    name,
    component: views[path],
  })
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routesList,
})

export default router
