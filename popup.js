document.addEventListener('DOMContentLoaded', () => {
  const minPriceSlider = document.getElementById('minPriceSlider');
  const maxPriceSlider = document.getElementById('maxPriceSlider');
  const minPriceDisplay = document.getElementById('minPriceDisplay');
  const maxPriceDisplay = document.getElementById('maxPriceDisplay');

  // Sliderların değerlerini güncelleme
  minPriceSlider.addEventListener('input', () => {
    minPriceDisplay.textContent = minPriceSlider.value;
  });

  maxPriceSlider.addEventListener('input', () => {
    maxPriceDisplay.textContent = maxPriceSlider.value;
  });

  // Filtreleme butonuna tıklanınca değerleri kullanma
  document.getElementById('filterButton').addEventListener('click', () => {
    const minPrice = parseFloat(minPriceSlider.value);
    const maxPrice = parseFloat(maxPriceSlider.value);

    if (minPrice > maxPrice) {
      alert('Minimum fiyat, maksimum fiyattan büyük olamaz!');
    } else {
      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const currentTab = tabs[0];

          if (currentTab.url.includes("migros.com.tr")) {
            chrome.scripting.executeScript({
              target: { tabId: currentTab.id },
              func: filterMigrosItems,
              args: [minPrice, maxPrice],
            });
          } else if (currentTab.url.includes("yemeksepeti.com")) {
            chrome.scripting.executeScript({
              target: { tabId: currentTab.id },
              func: filterYemeksepetiItems,
              args: [minPrice, maxPrice],
            });
          } else {
            alert("Bu uzantı yalnızca migros.com.tr ve yemeksepeti.com sitelerinde çalışır.");
          }
        });
      } else {
        alert('Lütfen geçerli bir fiyat aralığı giriniz.');
      }
    }
  });
});

// Migros için filtreleme fonksiyonu
function filterMigrosItems(minPrice, maxPrice) {
  const items = document.querySelectorAll('.menu-item');
  items.forEach(item => {
    const priceElement = item.querySelector('.price-wrapper h3');
    if (priceElement) {
      const priceText = priceElement.textContent.match(/^\d+/)?.[0] || '';
      const price = parseFloat(priceText);
      if (isNaN(price) || price < minPrice || price > maxPrice) {
        item.style.display = 'none';
      } else {
        item.style.display = '';
      }
    }
  });
}

// Yemeksepeti için filtreleme fonksiyonu
function filterYemeksepetiItems(minPrice, maxPrice) {
  const items = document.querySelectorAll('li.product-tile');
  items.forEach(item => {
    const priceElement = item.querySelector('[data-testid="menu-product-price"]');
    if (priceElement) {
      const priceText = priceElement.textContent.match(/^\d+/)?.[0] || '';
      const price = parseFloat(priceText);
      if (isNaN(price) || price < minPrice || price > maxPrice) {
        item.style.display = 'none';
      } else {
        item.style.display = '';
      }
    }
  });
}
