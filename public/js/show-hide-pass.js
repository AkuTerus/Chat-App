const passwordField = document.querySelector('.form .field input[type="password"]'),
  toggleBtn = document.querySelector('.form .field i img');
let eye_icon = document.querySelector('form .field i img')
toggleBtn.onclick = () => {
  if (passwordField.type == 'password') {
    passwordField.type = 'text';
    eye_icon.src='/img/eye-slash-solid.svg';
    toggleBtn.classList.add('active');
    
  } else {
    passwordField.type = 'password';
    eye_icon.src='/img/eye-solid.svg';
    toggleBtn.classList.remove('active');
  }
};
