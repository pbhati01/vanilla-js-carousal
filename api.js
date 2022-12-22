export const fetchProducts = async () => {
  const endpoint = "https://api.nosto.com/v1/graphql";
  const query = `
    query {
      products (limit: 50) {
          products {
              name
              price
              listPrice
              brand
              imageUrl
              alternateImageUrls
              url
              scores {
                  week {
                      views
                      buys
                  }
              }
          }
      }
  }`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " +
        btoa(
          ":" + "N7QnHtiseaaAtartB16sQ7jUcNAm0HgsTxTnwTX08GQ85EYShd90zN3qiYiDjVsq"
        ),
    },
    body: JSON.stringify({
      query,
    }),
  };

  return await fetch(endpoint, options)
    .then((res) => res.json())
    .then((data) => {
      const productsList = data.data.products.products;
      return productsList
    })
    .catch((error) => {
      console.error(error);
      return []
    });
}
