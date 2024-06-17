<template>
  <div>
    <template v-for="item in list">
      <div></div>
      <template
        v-if="!item.children || !item.children.length || item.meta?.single"
      >
        <t-menu-item
          v-if="getHref(item)"
          :key="`href${item.path}`"
          :href="getHref(item)?.[0]"
          :name="item.path"
          :value="item.meta?.single ? item.redirect || item.path : item.path"
        >
          <template #icon>
            <t-icon
              v-if="typeof item.icon === 'string' && item.icon"
              :name="item.icon"
            />
          </template>
          {{ item.title }}
        </t-menu-item>
        <t-menu-item
          v-else
          :key="`${item.path}`"
          :to="item.path"
          :name="item.path"
          :value="item.meta?.single ? item.redirect || item.path : item.path"
        >
          <template #icon>
            <t-icon
              v-if="typeof item.icon === 'string' && item.icon"
              :name="item.icon"
            />
          </template>
          {{ item.title }}
        </t-menu-item>
      </template>
      <t-submenu
        v-else
        :name="item.path"
        :value="item.path"
        :title="item.title"
        :key="item.path"
      >
        <template #icon>
          <t-icon
            v-if="typeof item.icon === 'string' && item.icon"
            :name="item.icon"
          />
        </template>
        <menu-content v-if="item.children" :nav-data="item.children" />
      </t-submenu>
    </template>
  </div>
</template>

<script lang="ts" setup>
interface MenuRoute {
  path: string
  title?: string
  icon?:
    | string
    | {
        render: () => void
      }
  redirect?: string
  children: MenuRoute[]
  meta: any
}
const getMenuList = (list: MenuRoute[], basePath?: string): MenuRoute[] => {
  if (!list) {
    return []
  }
  const ret = list
    .map(item => {
      const path =
        basePath && !item.path.includes(basePath)
          ? `${basePath}/${item.path}`
          : item.path
      return {
        path,
        title: item.meta?.title,
        icon: item.meta?.icon || '',
        children: getMenuList(item.children, path),
        meta: item.meta,
        redirect: item.redirect,
      }
    })
    .filter(item => item.meta && item.meta.hidden !== true)
  console.log('menu', ret)
  return ret
}

const props = defineProps<{
  navData: MenuRoute[]
}>()

const list = computed<MenuRoute[]>(() => {
  return getMenuList(props.navData)
})

function getHref(item: MenuRoute) {
  return item.path.match(/(http|https):\/\/([\w.]+\/?)\S*/)
}
</script>

<style scoped>
:deep(.t-menu__item) {
  margin-bottom: 6px;
  height: 48px;
}
</style>
