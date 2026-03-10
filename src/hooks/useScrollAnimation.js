import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation(scopeRef) {
    useGSAP(
        () => {
            // Check if scopeRef is valid and has current
            const element = scopeRef?.current;
            if (!element) return;

            // Animate elements with .animate-fade-up class
            const fadeUps = element.querySelectorAll(".animate-fade-up");
            fadeUps.forEach((target) => {
                gsap.fromTo(
                    target,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "out",
                        force3D: true,
                        scrollTrigger: {
                            trigger: target,
                            start: "top 85%", // Animation starts when top of element hits 85% of viewport height
                            toggleActions: "play none none none", // Play on enter, stay visible
                        },
                    }
                );
            });

            // Animate elements with .animate-stagger-container class (children .animate-stagger-item)
            const staggerContainers = element.querySelectorAll(".animate-stagger-container");
            staggerContainers.forEach((container) => {
                const items = container.querySelectorAll(".animate-stagger-item");
                if (items.length === 0) return;

                gsap.fromTo(items,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: "out",
                        force3D: true,
                        scrollTrigger: {
                            trigger: container,
                            start: "top 80%",
                            toggleActions: "play none none none"
                        }
                    }
                )
            });

            // Scale in effect
            const scaleIns = element.querySelectorAll(".animate-scale-in");
            scaleIns.forEach((target) => {
                gsap.fromTo(target,
                    { opacity: 0, scale: 0.9 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        ease: "back.out(1.7)",
                        force3D: true,
                        scrollTrigger: {
                            trigger: target,
                            start: "top 85%",
                            toggleActions: "play none none none"
                        }
                    }
                )
            });

        },
        { scope: scopeRef }
    );
}

export default useScrollAnimation;
