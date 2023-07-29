const buttons = document.querySelector('#buttons');
const username = document.querySelector('#username');

// Usa directamente 'firebase.auth().onAuthStateChanged'
firebase.auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(user)
    buttons.innerHTML = /*html*/ `
    <button class="btn btn-outline-danger mr-2">Logout</button>
    `;
  } else {
    console.log('Does not exist user');
    buttons.innerHTML = /*html*/ `
      <button class="btn btn-outline-success mr-2" id='access'>Access</button>
    `;
  }
});
