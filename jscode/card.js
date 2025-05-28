


document.querySelectorAll('.carousel').forEach(carousel => {
  let index = 0;
  const images = carousel.querySelectorAll('img');

  const showImage = (i) => {
    images.forEach((img, idx) => img.style.display = idx === i ? 'block' : 'none');
  };

  carousel.querySelector('.next').addEventListener('click', () => {
    index = (index + 1) % images.length;
    showImage(index);
  });

  carousel.querySelector('.prev').addEventListener('click', () => {
    index = (index - 1 + images.length) % images.length;
    showImage(index);
  });

  showImage(index);
});

