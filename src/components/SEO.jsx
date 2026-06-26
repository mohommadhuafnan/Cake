export default function SEO({ title, description, type = 'website', image, product }) {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://maisondouceur.qa'

  const schema = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'QAR',
          availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'Bakery',
        name: 'Maison Douceur',
        description: 'Premium luxury cakes in Qatar',
        address: { '@type': 'PostalAddress', addressCountry: 'QA', addressLocality: 'Doha' },
        url: siteUrl,
      }

  return (
    <>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  )
}
