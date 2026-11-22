// FAQ Accordian
document.addEventListener("DOMContentLoaded", () => {
    const faqContainer = document.querySelector('.faq-content');

    faqContainer.addEventListener('click', (e) => {
        const groupHeader = e.target.closest('.faq-group-header');

        if(!groupHeader) return;

        const group = groupHeader.parentElement;
        const groupBody = group.querySelector('.faq-group-body');
        const icon = groupHeader.querySelector('i');

        // Toggle icon
        icon.classList.toggle('fa-plus');
        icon.classList.toggle('fa-minus');

        // Toggle visibility of body
        groupBody.classList.toggle('open');

        // Close other open FAQ bodies
        const otherGroups = faqContainer.querySelectorAll('.faq-group');
        
        otherGroups.forEach((otherGroup) => {
            if(otherGroup !== group) {
                const otherGroupBody = otherGroup.querySelector('.faq-group-body');
                const otherIcon = otherGroup.querySelector('.faq-group-header i');

                otherGroupBody.classList.remove('open');
                otherIcon.classList.remove('fa-minus');
                otherIcon.classList.add('fa-plus');
            }
        });
    });
});

// Mobile Menu
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerButton = document.querySelector('.hamburger-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    hamburgerButton.addEventListener('click', () => mobileMenu.classList.toggle('active'));
});

document.addEventListener('DOMContentLoaded', () => {
    const firstHeading = document.querySelector('.hero-heading.focus-in-contract');
    const shadowHeading = document.querySelector('.hero-heading.text-shadow-drop-center');

    firstHeading?.addEventListener('animationend', (event) => {
        if (event.animationName === 'focus-in-contract') {
            firstHeading.classList.add('animation-complete');
        }
    });

    shadowHeading?.addEventListener('animationend', (event) => {
        if (event.animationName === 'text-shadow-drop-center') {
            shadowHeading.classList.add('animation-complete', 'text-shadow-complete');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const marqueeZone = document.querySelector('.marquee-zone');
    const marqueeTrack = marqueeZone?.querySelector('.marquee-track');
    let firstGroup = marqueeTrack?.querySelector('.marquee-group');

    if (!marqueeZone || !marqueeTrack || !firstGroup) return;

    let offset = 0;
    let pointerStartX = 0;
    let dragStartOffset = 0;
    let resumeTimer;
    let previousTime = performance.now();
    let interacting = false;
    const speed = 35;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const loopWidth = () => firstGroup.getBoundingClientRect().width;

    const ensureEnoughGroups = () => {
        const requiredWidth = marqueeZone.getBoundingClientRect().width * 3;
        let groupCount = marqueeTrack.querySelectorAll('.marquee-group').length;

        while (marqueeTrack.scrollWidth < requiredWidth && groupCount < 12) {
            const clone = firstGroup.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            clone.querySelectorAll('.marquee-item').forEach((image) => {
                image.draggable = false;
            });
            marqueeTrack.appendChild(clone);
            groupCount++;
        }
    };

    const normalizeOffset = (value) => {
        const width = loopWidth();
        if (!width) return value;
        let normalized = value % width;
        if (normalized > 0) normalized -= width;
        if (normalized <= -width) normalized += width;
        return normalized;
    };

    const startManualControl = () => {
        interacting = true;
        marqueeZone.classList.add('is-interacting');
        clearTimeout(resumeTimer);
    };

    const scrollManually = (delta) => {
        startManualControl();
        offset = normalizeOffset(offset + delta);
        marqueeTrack.style.transform = `translateX(${offset}px)`;
    };

    const resumeAutoScroll = () => {
        interacting = false;
        marqueeZone.classList.remove('is-interacting');
    };

    marqueeZone.addEventListener('pointerdown', (event) => {
        startManualControl();
        pointerStartX = event.clientX;
        dragStartOffset = offset;
        marqueeZone.setAttribute('draggable', 'false');
        marqueeZone.setPointerCapture(event.pointerId);
    });

    marqueeZone.addEventListener('pointermove', (event) => {
        if (!interacting) return;
        if (!marqueeZone.hasPointerCapture(event.pointerId)) return;

        offset = normalizeOffset(dragStartOffset + event.clientX - pointerStartX);
        marqueeTrack.style.transform = `translateX(${offset}px)`;
    });

    marqueeZone.addEventListener('pointerup', (event) => {
        if (marqueeZone.hasPointerCapture(event.pointerId)) {
            marqueeZone.releasePointerCapture(event.pointerId);
        }
        resumeTimer = setTimeout(resumeAutoScroll, 1200);
    });

    marqueeZone.addEventListener('pointercancel', () => {
        resumeTimer = setTimeout(resumeAutoScroll, 1200);
    });

    marqueeZone.addEventListener('wheel', (event) => {
        if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

        event.preventDefault();
        scrollManually(event.deltaX * 1.15);
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(resumeAutoScroll, 1200);
    }, { passive: false });

    ensureEnoughGroups();
    marqueeTrack.style.transform = 'translateX(0px)';

    window.addEventListener('resize', ensureEnoughGroups);

    const animate = (time) => {
        const elapsed = Math.min((time - previousTime) / 1000, 0.05);
        previousTime = time;

        if (!interacting && !reduceMotion.matches) {
            offset = normalizeOffset(offset + speed * elapsed);
            marqueeTrack.style.transform = `translateX(${offset}px)`;
        }

        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
});

const sections = [...document.querySelectorAll('section')]

let options = {
    threshold: 0.5
}

const handleIntersect = (entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            document.body.style.backgroundColor = entry.target.getAttribute('data-color');
        }
    })
}

const observer = new IntersectionObserver(handleIntersect, options)

sections.forEach(section => {
    observer.observe(section)
})