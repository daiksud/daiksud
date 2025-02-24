<template>
  <div class="flex flex-col min-h-screen">
    <header class="border-b">
      <UContainer class="h-16 flex items-center">
        <ULink class="text-2xl font-bold" to="/">daiksud</ULink>
      </UContainer>
    </header>
    <main>
      <slot />
    </main>
  </div>
  <footer class="border-t">
    <UContainer class="h-16 flex items-center">
      <p>&copy; {{ new Date().getFullYear() }} daiksud</p>
    </UContainer>
  </footer>
</template>
