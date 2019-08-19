var   menuBtn = document.querySelector('.hamburger'),
      footer  = document.querySelector('.footer');

      menuBtn.addEventListener('click', function(){
        console.log('yes')
        footer.classList.toggle('active');
      });
