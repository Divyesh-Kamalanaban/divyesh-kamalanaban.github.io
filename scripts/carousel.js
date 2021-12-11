//Defining few variables.
const carousel = document.querySelector('.carousel-image-list');
const slides = Array.from(carousel.children);
const prevBtn = document.querySelector('.left');
const nextBtn = document.querySelector('.right');

//Geting the width of each image;
const slideWidth = slides[0].getBoundingClientRect().width;
 
//The Concept: We arrange all the image linearly so that when the user requests to show the next slide, we'll move the next image to show the user next image.

//Using simple calculation, we'll move the next image to viewport.


const setSlidePosition = (slide, index) => {
    slide.style.left = slideWidth * index + 'px';
}

slides.forEach(setSlidePosition);

//Defining a quick arrow function to make code less repititive.

const moveImage = (carousel, currentSlide, targetSlide) => {

    if(!targetSlide) return;
    //Calculating the amount ot move using the values of left styling already applied by the slides.forEach loop.
    const moveAmount = targetSlide.style.left;
    //Moving the ul (The whole carousel list) to right side.
    carousel.style.transform ='translateX('+ '-'+ moveAmount + ')'
    //Once the movement is over, we'll remove the class .current slide from the old currentSlide const.
    currentSlide.classList.remove('current-slide');
    //Once the movement is over, we'll transfer the class .current slide to the nextSlide, makes sense right?
    targetSlide.classList.add('current-slide');

}

//Adding functionality for Left Button;
prevBtn.addEventListener('click', e=>{
    //Using the queryselector method to get the current-slide from the carousel. No need to use document, because we know where our target element lies, which is carousel. This increases speed.
    const currentSlide = carousel.querySelector('.current-slide');
    //Using the previousElementSibling property to get the previous slide of the carousel.
    const previousSlide = currentSlide.previousElementSibling;
    //Executing the moveImage function to move the image to right.
    moveImage(carousel, currentSlide, previousSlide); 

});

//The left button is over here. We'll move to right now.

//Adding fucntionality for Right Button;
nextBtn.addEventListener('click', e=>{
    //Using the queryselector method to get the current-slide from the carousel. No need to use document, because we know where our target element lies, which is carousel. This increases speed.
    const currentSlide = carousel.querySelector('.current-slide');
    //Using the nextElementSibling property to get the next slide of the carousel.
    const nextSlide = currentSlide.nextElementSibling;
    //Executing the moveImage function to move the image to right.
    moveImage(carousel, currentSlide, nextSlide); 

});



