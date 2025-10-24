export const getStrapiImageUrl = (imgUrl: string) => {
  const { url: strapiUrl } = useRuntimeConfig().public.strapi
  return `${strapiUrl}${imgUrl}`
}
