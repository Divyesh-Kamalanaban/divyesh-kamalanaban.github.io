//Initiatilization for GSAP.
gsap.registerPlugin(ScrollTrigger);

//GSAP Animations
gsap.to('.dev-card', { scrollTrigger: '.dev-card', opacity: 1, x: -10, ease: Power0.ease });
gsap.to('.skill-title', {
  scrollTrigger: {
    trigger: '.skill-title',
    start: 'center center',
  },
  transform: 'translateY(0px)',
  opacity: 1,
})
var tl = new TimelineMax();

// tl
// gsap.to('.m1', {
//   scrollTrigger: {
//     trigger: '.timeline-circle',
//     start: 'center center',
//   },
//   height: '100%'
// })
		ScrollReveal().reveal('.m1')
		ScrollReveal().reveal('.tc1', { delay: 500 })
    ScrollReveal().reveal('.m2')
		ScrollReveal().reveal('.tc2', { delay: 500 })
    ScrollReveal().reveal('.m3')
		ScrollReveal().reveal('.tc3', { delay: 500 })
// gsap.to('.m2', {
//   scrollTrigger: '.timeline-circle',
//   height: '100%'
// })

// gsap.to('.m2', {
//   scrollTrigger: '.m3',
//   height: '100%'
// })


