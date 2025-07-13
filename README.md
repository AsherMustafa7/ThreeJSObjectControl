# ThreeJSObjectControl
Built a responsive and intuitive frontend using Threejs, GSAP Scroll-Triggers.
For Preview : https://ashermustafa7.github.io/ThreeJSObjectControl/

Key Learnings and Features (Scroll-Based 3D + UI Interaction)
Integrated Lenis for buttery-smooth scroll behavior and synced it with GSAP's ScrollTrigger and gsap.ticker for animation control.
Used GSAP’s SplitText plugin to break text into lines and characters, then animated them independently for smooth entrance effects.
Understood and applied GSAP’s scroll-based triggers like onEnter, onLeaveBack, and scrub, which sync animation progress with scroll depth.
Wrapped each header character in <span> using SplitText to apply staggered animations for a dynamic reveal.
Implemented multiple scroll breakpoints using tooltipSelectors to animate different groups of elements based on scroll position.
Built and rendered a 3D model using THREE.js (GLTFLoader), positioned and scaled it dynamically using Box3 and getCenter.
Learned to center models, detect device size (isMobile), and apply responsive positioning and rotation logic accordingly.
Applied lighting setups using AmbientLight, DirectionalLight, and HemisphereLight for realistic 3D shading.
Built a flexible setupModel() function that adjusts model position and camera framing on window resize.
Controlled scroll-driven horizontal page transitions (xPercent) with gsap.to() and interpolated progress values.
Used clip-path: circle() to animate circular reveal masks on scroll, based on calculated linear scroll percentages.
Rotated the 3D model smoothly on the Y-axis with rotateOnAxis() during scroll, calculating rotation delta on every frame.
Made use of ScrollTrigger's scrub: true to keep animations tightly synced to the user’s scroll velocity and direction.
Scaled UI dividers (scaleX) and text blocks into view only when their scroll progress hit specified thresholds.
Understood ScrollTrigger's start/end logic like "top top" and '+=' + scrollLength to pin and control the viewport's scroll timeline precisely.
