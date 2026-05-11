export default defineAppConfig({
  ui: {
    input: {
      slots: {
        base: 'rounded-sm',
      },
      variants: {
        size: {
          lg: {
            base: 'py-4 px-5',
          },
        },
        variant: {
          outline: 'bg-[#1c1f2e]',
        },
      },
    },
  },
})
