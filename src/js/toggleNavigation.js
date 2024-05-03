const onDomContentLoaded = () => {
  const burgerElem = document.querySelector('#burger');
  const navElem = document.querySelector('.header__nav');

  function toggleNav() {
    this.classList.toggle('is-active');
    navElem.classList.toggle('is-open');
  }

  function checkActiveClass() {
    const display = getComputedStyle(burgerElem).getPropertyValue('display');

    if (display === 'none') {
      burgerElem.classList.remove('is-active');
      navElem.classList.remove('is-open');
    }
  }

  burgerElem.addEventListener('click', toggleNav);
  window.addEventListener('resize', checkActiveClass);
};

document.addEventListener('DOMContentLoaded', onDomContentLoaded);
