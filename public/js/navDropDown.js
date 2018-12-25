const navDropDown = document.querySelector('#navDropDown');

document.querySelector('#mobileNavToggle').addEventListener('click', (e) => {
  const navState = navDropDown.className;

  if (navState === 'closed') {
    navDropDown.className = 'open';
  } else {
    navDropDown.className = 'closed';
  }
});