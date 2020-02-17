// Parallax Solution for images
const plxImages = document.querySelectorAll(".plx-img img");

plxImages.forEach(e => parallaxImageTransform(e));

function parallaxImageTransform(image) {
	if (typeof image != "undefined" && image != null) {
		document.addEventListener("scroll", parallax);
		function parallax() {
			let subtleOffset = window.pageYOffset / 10;
			image.style.transform = `translateY(-${subtleOffset}px)`;
		}
	}
}

// Options docs: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Intersection_observer_options
const options = {
	root: null, // use the document's viewport as the container
	rootMargin: "0px", // % or px - offsets added to each side of the intersection
	threshold: 0.5 // percentage of the target element which is visible
};

// Callback docs: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Targeting_an_element_to_be_observed
let callback = entries => {
	entries.forEach(entry => {
		// If entry (box) is visible - according with the params set in `options`
		// then adds `isVisible` class to box
		// otherwise removes `isVisible` class

		if (entry.isIntersecting) {
			if (entry.target.classList.contains("ani-in:false")) {
				console.log("boom");
				entry.target.classList.add("ani-in:true");
				entry.target.classList.remove("ani-in:false");
			}

			if (entry.target.classList.contains("ani-out:true")) {
				entry.target.classList.add("ani-out:false");
				entry.target.classList.remove("ani-out:true");
			}
		} else {
			if (entry.target.classList.contains("ani-out:false")) {
				entry.target.classList.add("ani-in:false");
				entry.target.classList.remove("ani-in:true");
				entry.target.classList.add("ani-out:true");
				entry.target.classList.remove("ani-out:false");
			}
		}
	});
};

// Create the intersection observer instance by calling its constructor and passing it a
// callback function to be run whenever a threshold is crossed in one direction or the other:
let observer = new IntersectionObserver(callback, options);

// Get all the `.box` from DOM and attach the observer to these
document.querySelectorAll(".ani\\:trigger").forEach(box => {
	observer.observe(box);
});
