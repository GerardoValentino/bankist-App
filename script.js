'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
//...
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('operations__tab'); // buttons
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');



const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => {
  btn.addEventListener('click', openModal)
})

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Button scrolling
btnScrollTo.addEventListener('click', function(e) {
  // getBoundingClientRect() --> ??
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());

  // scrollX, scrollY --> Register how many pixels we've scrolled horizontally (X) or vertically (Y) from the top and left (viewport)
  console.log('Current scroll (X/Y)', window.scrollX, scrollY);

  // If we want to get the height and width
  console.log('height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);
  
  // Scrolling
  // Three ways of doing the scrolling

  // 1.
  // scrollTo(<start>,<end>)
  // window.scrollTo(s1coords.left + window.scrollX, s1coords.top + window.scrollY);

  /*
  // 2.
  window.scrollTo({
    left: s1coords.left + window.scrollX, 
    top: s1coords.top + window.scrollY,
    behavior: 'smooth'
  }); */

  // 3.
  section1.scrollIntoView({behavior: 'smooth'});
  
});

/////////////////////////////////////////
// Page navigation

/*
// This works but is not efficient
document.querySelectorAll('.nav__link').forEach(function(element) {
  element.addEventListener('click', function(e) {
    e.preventDefault();
    //console.log('LINK');
    const id = this.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  });
}); */

// Using event delegation
/*In event delegation we basically need two steps:
1. Add the event listener to one common parent element of all the elements that we're interested in. 

2. Determine what element originated the event*/

// 1.
document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();
  // 2.
  console.log(e.target); // We can see where the event happens with e.target!!!

  // We only want to work with the clicks which happen in one of the links, nowhere else

  // Matching strategy
  if(e.target.classList.contains('nav__link')) {
    console.log('LINK');
    e.preventDefault();
    const id = e.target.getAttribute('href');
    //console.log(id);
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});

///////////////////// Tabbed component /////////////////////
tabsContainer.addEventListener('click', function(e) {
  const clicked = e.target.closest('.operations__tab'); // El método closest() busca el ancestro más cercano (o el propio elemento) que coincida con el selector .operations__tab. Si el e.target o algún ancestro de e.target tiene la clase .operations__tab, closest() devolverá ese elemento. Si no encuentra ningún elemento coincidente, devolverá null.

  //console.log(clicked);
  // Ignore clicks which not happen in the buttons
  // Guard clause
  if(!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Active content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active'); // clicked.dataset.tab --> 
  /* dataset: Es una propiedad del DOM que contiene todos los atributos de datos personalizados (data-*) de un elemento.
  tab: Es el nombre de un atributo de datos personalizado, es decir, data-tab. clicked.dataset.tab accederá al valor de este atributo. 
  
  Por ejemplo, si el HTML del tab clicado es <div class="operations__tab" data-tab="1">Tab 1</div>, entonces clicked.dataset.tab devolverá el valor "1".
  */
});

///////////////////// Menu fade animation /////////////////////
const handleHover = function(e) {
  //console.log(this, e.currentTarget);
  if(e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    // Change the opacity
    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

// We can use the bind() method to pass arguments into a handler function
nav.addEventListener('mouseover', handleHover.bind(0.5));

// Undo what we did before; We use the event "mouseuot"
nav.addEventListener('mouseout', handleHover.bind(1));


// Sticky navigation
/*
const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords);

window.addEventListener('scroll', function() {
  console.log(window.scrollY);

  if(window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');

}) */

///////////////////// Sticky navigation: Intersection Observer API /////////////////////


/*This API allows our code to basically observe changes through the way a certain target element intesrsects another element or the way intersects the viewport */


// This callback function will get called each time that the observed element (our target element) is intersecting the root element at the threshold that we defined
/*
const obsCallBack = function(entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  })
}

const obsOptions = {
  root: null, // The element that we want the target to intersect
  threshold: [0, 0.2] // The percentage of intersection at which the observer callBack will be called
}

const observer = new IntersectionObserver(obsCallBack, obsOptions);
observer.observe(section1); */

// We want to display the navigation (sticky) when the header is completely out of the viewport
const header = document.querySelector('header');
const navHeight = nav.getBoundingClientRect().height; // Getting the height of the header
// console.log(navHeight);

const stickyNav = function(entries) {
  const [entry] = entries;
  //console.log(entry);

  if(!entry.isIntersecting) {
    nav.classList.add('sticky');
  } 
  else {
    nav.classList.remove('sticky');
  }
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////// Reveal sections /////////////////////
const allSections = document.querySelectorAll('.section')

const revealSection = function(entries, observer) {
  const [entry] = entries;
  //console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); // We stop observing the sections once we've already observed them.
}


const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
});

allSections.forEach(function(section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})

///////////////////// Lazy loading images /////////////////////
const imgTargets = document.querySelectorAll('img[data-src]'); // We only select the images which contains the property "data-src"

const loadImg = function(entries, observer) {
  const [entry] = entries;
  //console.log(entry);

  if(!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');  
  });

  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

imgTargets.forEach(img => imgObserver.observe(img));


///////////////////// SLIDER /////////////////////
const slider = function() {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  // const slider = document.querySelector('.slider');
  let currentSlide = 0;
  const maxSlide = slides.length; 

  // Functions
  const createDots = function() {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function(slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
    
  };

  const goToSlide = function(slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  }
  // currentSlide = 1: -100%, 0%, 100%, 200%

  // Next slide
  const nextSlide = function() {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  }

  const prevSlide = function() {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  }

  const init = function() {
    goToSlide(0);
    createDots();
    activateDot(0);
  }

  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide); 
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function(e) {
    //console.log(e);
    if(e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function(e) {
    if(e.target.classList.contains('dots__dot')) {
      const {slide} = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

slider();

////////////////////////////////////// LECTURES
//////////////////////////////////////

/*
// ************** Selecting elements **************
// Selecting the entire HTML
console.log(document.documentElement);

// Selecting the head and body
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

console.log(allSections);


document.getElementById('section--1');

// Note: Collections are updated as soon as a change occurs... Nodelists aren't

// Getting all the elements with the name of button (returns an HTML collection)
const allButtons = document.getElementsByTagName('button');

console.log(allButtons);

// getting all elements with the name class (It returns a collection)
console.log(document.getElementsByClassName('btn'));

// Creating and inserting elements
// .insertAdjacentHTML

// This creates a DOM element
const message = document.createElement('div');
// Adding classes to an element
message.classList.add('cookie-message');

// Reading and setting content
//message.textContent = 'We use cookies for improved functionallity and analytics.';

message.innerHTML = 'We use cookies for improved functionallity and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// prepend() adds an element as the first child of the parent element. In this particular case, header.
header.prepend(message);

// Adding an element as the last child of the parent element
head.append((message))

*/

/*We can use prepend() and append() not just to insert elements, we can use them to move them too. This is because a DOM element is UNIQUE, so it can always only exists at one place at a time.*/

/* 

// What if we wanted to insert multiple copies of the same element?

//head.append(message.cloneNode(true))

// Inserting the element before and after the element (header)

header.before(message);
//header.after(message);

// Delete elements
document.querySelector('.btn--close-cookie').addEventListener('click', function() {
  message.remove();

  // Another way to remove an element is moving up the DOM tree, select the parent element and from there, select the child element that we want to remove...
  // message.parentElement.removeChild(message);
});

// Styles
// This styles are in-line styles
// Background color
message.style.backgroundColor = '#37383d';

// Width
message.style.width = '120%';

console.log(message.style.color);
console.log(message.style.backgroundColor);

// If we want to get an specific style from an element
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height, 10)  + 30 + 'px';

// If we can't change a value directly from css from a variable (:root{ ... }), we can use the following:
document.documentElement.style.setProperty('--color-primary', 'orangered');

*/

/*
The CSS variables are defined on :root{} as we know, in javascript this is equivalent to "document".

document.documentElement --> This is the root

We use setProperty() to add a value to a variable:

setProperty('--CSSvariable', 'value')

It's easier to do this like we did before

message.style.backgroundColor = '#37383d';

*/

/*

// Attributes
// In HTML the attributes are the following: src, alt, class, id, href, etc...

const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className); // Getting the name of the class

logo.alt = 'Beautiful minimalist logo';

// Non.standard
console.log(logo.designer);

// Getting an attribute
console.log(logo.getAttribute('designer'));

// Setting an attribute
logo.setAttribute('company', 'Bankist');

console.log(logo.src); // This gets the complete route
console.log(logo.getAttribute('src')); // This is cuter XD

//...
const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data attributes
console.log(logo.dataset.versionNumber);

// Classes
// We can add or remove multiple classes if we want.
logo.classList.add('c', 'j'); 
logo.classList.remove('c', 'j'); // If some of the specyfied classes don't exists, nothing happens
logo.classList.toggle('c'); // If the class exists, it removes it, if not, it adds the class 
logo.classList.contains('c'); // Returns true or false depending if the class exists or not...

// Don't use
//logo.className = 'hola'; 

*/

////////// EVENTS ///////////
/*
const h1 = document.querySelector('h1');

// mouseenter --> Similar to a hover in CSS
// Three ways of doing this

const alertH1 = function(e) {
  alert('addEventListener: Great! You are reading the heading :D');
}


h1.addEventListener('mouseenter', alertH1);

// After 3 sec remove the event listener
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);


// using "onmouseenter"
//h1.onmouseenter = function(e) {
  //alert('addEventListener: Great! You are reading the heading :D');
//}; */

///////////// EVENT PROPAGATION IN PRACTICE /////////////////////
/*
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function(e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);
  
  // STOP PROPAGATION
  //e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function(e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function(e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
}, false);

*/

// =============== DOM TRAVERSING ===============
/*
const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children); // We get the children elements of h1

// Only the first child gets modified
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';


// Going upwards: parents
console.log(h1.parentNode); // Getting the parent element of h1
console.log(h1.parentElement); // This is more specific

// closest() -->
// closest() method could be the opposite of querySelector()
h1.closest('.header').style.background = 'var(--gradient-secondary)';

h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going sideways: siblings
console.log(h1.previousElementSibling); // The previous element of h1
console.log(h1.nextElementSibling); // The next element of h1

console.log(h1.previousSibling);
console.log(h1.nextSibling);

// If we need all the siblings, then, we move up to the parent element and get all the siblings from there

console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(function(el) {
  if(el !== h1) el.style.transform = 'scale(0.5)';
});
*/


//////////// LIFECYCLE DOM EVENTS ////////////
document.addEventListener('DOMContentLoaded', function(e) {
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function(e) {
  console.log('Page fully loaded', e);
});

// This event is created immediately before a user is about to leave a page; we can use this event to ask users if they're 100% sure of leaving the page
window.addEventListener('beforeunload', function(e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = ''; // No matter what we right between '', we will always get the same pop-up
})