var nav = document.querySelector('nabbar');
 // Identify target

window.addEventListener('scroll', function(event) { // To listen for event
    event.preventDefault();

    if (window.scrollY <= 800) { // Just an example
        nabbar.style.backgroundColor = 'transparent';
        nabbar.style.color='white';
        
        // or default color
    } else {
        nabbar.style.backgroundColor = '#fdfcfc';
        nabbar.style.color='black';
    }
});