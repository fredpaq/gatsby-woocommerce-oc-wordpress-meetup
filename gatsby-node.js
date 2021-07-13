exports.createPages = async function ({ actions, graphql, reporter }) {
  const { data } = await graphql(`
    query {
      wp {
       produit:  products(first: 10) {
          nodes {
            slug
          }
        }
      }
    }
  `)

  if (!data || !data.wp || !data.wp.produit) {
    reporter.panic('Error creating pages')
    return
  }

  const products = data.wp.produit.nodes || []

  if (products.length === 0) {
    reporter.info('No products return during page creation process.')
  }

  products.forEach(({ slug }) => {
    actions.createPage({
      path: `/product/${slug}`,
      component: require.resolve(`./src/templates/product.tsx`),
      context: { slug },
    })
  })
}