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
      //console.log(`Min Price: ${minPrice}, Max Price: ${maxPrice}`);
      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		  chrome.scripting.executeScript({
			target: { tabId: tabs[0].id },
			func: filterItems,
			args: [minPrice, maxPrice]
		  });
		});
	  } else {
		alert('Lütfen geçerli bir fiyat aralığı giriniz.');
	  }
    }
  });
});



function filterItems(minPrice, maxPrice) {
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

