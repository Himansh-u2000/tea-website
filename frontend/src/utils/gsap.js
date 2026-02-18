import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const fadeIn = (element, options = {}) => {
    return gsap.from(element, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        ...options,
    });
};

export const staggerFadeIn = (elements, options = {}) => {
    return gsap.from(elements, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        ...options,
    });
};

export const scaleIn = (element, options = {}) => {
    return gsap.from(element, {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        ...options,
    });
};

export const slideIn = (element, direction = 'left', options = {}) => {
    const props = {
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        ...options,
    };

    switch (direction) {
        case 'left':
            props.x = -100;
            break;
        case 'right':
            props.x = 100;
            break;
        case 'top':
            props.y = -100;
            break;
        case 'bottom':
            props.y = 100;
            break;
    }

    return gsap.from(element, props);
};

export const createScrollTrigger = (element, animationFn, options = {}) => {
    return ScrollTrigger.create({
        trigger: element,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        ...options,
        onEnter: () => animationFn(element),
    });
};

export const parallax = (element, options = {}) => {
    return gsap.to(element, {
        y: (i, target) => -ScrollTrigger.maxScroll(window) * target.dataset.speed,
        ease: 'none',
        scrollTrigger: {
            start: 0,
            end: 'max',
            invalidateOnRefresh: true,
            scrub: 0,
        },
        ...options,
    });
};

export const magneticButton = (button) => {
    const handleMouseMove = (e) => {
        const { left, top, width, height } = button.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        gsap.to(button, {
            x: deltaX * 0.3,
            y: deltaY * 0.3,
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    const handleMouseLeave = () => {
        gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)',
        });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
        button.removeEventListener('mousemove', handleMouseMove);
        button.removeEventListener('mouseleave', handleMouseLeave);
    };
};

export { gsap, ScrollTrigger };
