var nav = document.querySelector('nav');
 

window.addEventListener('scroll', function(event) { 
    event.preventDefault();

    if (window.scrollY <= 800) { 
        nabbar.style.backgroundColor = 'transparent';
        nabbar.style.color='white';
        
        
    } else {
        nabbar.style.backgroundColor = '#fdfcfc';
        nabbar.style.color='black';
    }
});
