const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const overlay = document.getElementById('overlay');

function toggleMenu(){
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    mainContent.classList.toggle('blurred');
    menuToggle.classList.toggle('active');
}

menuToggle.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && sidebar.classList.contains('active')){
        toggleMenu();
    }
});

document.addEventListener('click', (e) =>{
    if(sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) &&
        !menuToggle.contains(e.target)
    ){
        toggleMenu();
    }
});

function setActiveMenuItem(){
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll('.menu-item');

    menuLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = link.getAttribute('href');
        if(currentPath.includes(linkPath.replace('/',''))){
            link.classList.add('active');
        }
        if(currentPath === '/' && currentPath.includes('dashboard')){
            link.classList.add('active');
        }
    });
}

sidebar.addEventListener('click', (e) =>{
    const menuItem = e.target.closest('.menu-item');
    if(menuItem){
        const linkPath = menuItem.getAttribute('href');
        const currentPath = window.location.pathname;

        const isCurrentPage = (linkPath === currentPath);
        if(isCurrentPage){
            e.preventDefault();
            mainContent.classList.remove('blurred');
            setTimeout(() =>{
                if(sidebar.classList.contains('active')){
                    mainContent.classList.add('blurred');
                }
            }, 300);
        }
    }
});

setActiveMenuItem();