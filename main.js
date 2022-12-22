import './style.css'
import { fetchProducts } from './api.js'

const isImageExists = (image_url) => {
  var http = new XMLHttpRequest();
  http.open('HEAD', image_url, false);
  http.send();
  return http.status != 404;
}

const checkImage = async (imageSrc) => {
  try {
    const response = await fetch(imageSrc, { method: 'HEAD' });
    return response.status !== 404 && !response.url.includes('undefined');
  } catch (error) {
    return false;
  }
}

const renderCarousel = async (productsList) => {
  const slidesContainer = document.getElementById("slides-container");
  const bestSellerContainer = document.getElementById("best-seller-container");
  const prevButton = document.getElementById("slide-arrow-prev");
  const nextButton = document.getElementById("slide-arrow-next");

  nextButton.addEventListener("click", () => {
    const slideWidth = 200;
    slidesContainer.scrollLeft += slideWidth;
  });

  prevButton.addEventListener("click", () => {
    const slideWidth = 200;
    slidesContainer.scrollLeft -= slideWidth;
  });

  const highestWeekBuysIdx = 0;
  productsList.reduce((max, product, key) => {
    if(product.scores.week.buys > max) {
      max = product.scores.week.buys;
      highestWeekBuysIdx = key;
    }
    return max;
  }, productsList[0].scores.week.buys);

  const bestSellerImgContainer = document.createElement("div");
  bestSellerImgContainer.classList.add("slide");

  const carouselCellImage = document.createElement("img");
  carouselCellImage.classList.add("slide-image");
  const isImageExists = await checkImage(productsList[highestWeekBuysIdx].imageUrl);
  carouselCellImage.src = isImageExists 
                            ? productsList[highestWeekBuysIdx].imageUrl : './no-image-icon-6.png';
  carouselCellImage.setAttribute("alt", productsList[highestWeekBuysIdx].name);

  const bestSellerLabel = document.createElement("div");
  bestSellerLabel.classList.add("best-seller-label");
  bestSellerLabel.innerHTML = 'Best Seller This Week!';
  
  bestSellerContainer.appendChild(bestSellerImgContainer);
  bestSellerImgContainer.appendChild(carouselCellImage);
  bestSellerImgContainer.appendChild(bestSellerLabel);

  const highestWeekViews = productsList.reduce((max, product) => 
  product.scores.week.views > max ? product.scores.week.views : max, productsList[0].scores.week.views);

  return productsList.forEach(async (product, key) => {
    if (key !== highestWeekBuysIdx) {
      const carouselCell = document.createElement("div");
      carouselCell.classList.add("slide");

      const carouselCellImage = document.createElement("img");
      carouselCellImage.classList.add("slide-image");
      const isImageExists = await checkImage(product.imageUrl);
      carouselCellImage.src = isImageExists 
        ? product.imageUrl : './no-image-icon-6.png';
      carouselCellImage.setAttribute("alt", product.name);

      const mostViewedLabel = document.createElement("div");
      mostViewedLabel.classList.add("most-viewed-label");
      mostViewedLabel.innerHTML = 'MOST VIEWED!';

      const carouselProductDetails = document.createElement("div");
      carouselProductDetails.classList.add("slide-product-details");

      const productDetails1 = document.createElement("label");
      productDetails1.classList.add("product-brand");
      productDetails1.innerHTML = product.brand;

      const productDetails2 = document.createElement("label");
      productDetails2.classList.add("product-name");
      productDetails2.innerHTML = product.name;

      const productDetails3 = document.createElement("label");
      productDetails3.classList.add("product-price");
      productDetails3.innerHTML = '€' + product.price;

      slidesContainer.appendChild(carouselCell);
      carouselCell.appendChild(carouselCellImage);
      if(product.scores.week.views === highestWeekViews)
      carouselCell.appendChild(mostViewedLabel);
      carouselCell.appendChild(carouselProductDetails);
      carouselProductDetails.appendChild(productDetails1);
      carouselProductDetails.appendChild(productDetails2);
      carouselProductDetails.appendChild(productDetails3);
    }
  });
};

const products = await fetchProducts();
renderCarousel(products);