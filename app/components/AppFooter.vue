<template>
  <UFooter :ui="{ root: 'border-t border-(--ui-border)' }">
    <template #left>
      <p class="text-(--ui-text-muted) text-sm">
        Copyright {{ new Date().getFullYear() }} daiksud
      </p>
    </template>

    <template #right>
      <UColorModeButton />
    </template>
  </UFooter>
</template>
