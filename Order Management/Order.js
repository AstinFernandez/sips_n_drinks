const MenuToggle = document.getElementById('menuToggle');
const overlay = document.getElementById('overlay');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');

function toggleMenu(){
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('blurred');
    menuToggle.classList.toggle('active');
    overlay.classList.toggle('active');
}

menuToggle.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

document.addEventListener('keydown', (e) =>{
    if(e.key === 'Escape' && sidebar.classList.includes('active')){
        toggleMenu();
    }
});

document.addEventListener('click', (e) =>{
    if(sidebar.classList.inlcudes('active') &&
        !sidebar.contains(e.target)&&
        !menuToggle.contains(e.target)){
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

setActiveMenuItem();