document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelector('#buttons');
  const username = document.querySelector('#username');
  const contentProtected = document.querySelector('#contentProtected')

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user);
      buttons.innerHTML = /*html*/ `
        <button class="btn btn-outline-danger mr-2" id="btnLogout">Logout</button>
      `
      username.innerHTML = user.displayName
      logout()
      contentProtected.innerHTML = /*html*/`
      <p class="text-center lead mt-5">Welcome ${user.email}</p>
      `
    } else {
      console.log('Does not exist User');
      buttons.innerHTML = /*html*/ `
        <button class="btn btn-outline-success mr-2" id="btnAccess">Access</button>
      `;
      startSesion()
      username.innerHTML = 'WEB CHAT'
      contentProtected.innerHTML = /*html*/ `
      <p class= "text-center lead mt-5">You Must First Log in</p>
    `
    }
  });

  const startSesion = () => {
    const btnAccess = document.querySelector('#btnAccess');
    btnAccess.addEventListener('click', async () => {
      console.log('you did click');
      try {
        const provider = new firebase.auth.GoogleAuthProvider()
        await firebase.auth().signInWithPopup(provider)
      } catch (error) {
        console.log(error);
      }
    });
  };

  const logout = () => {
    const btnLogout = document.querySelector('#btnLogout')
    btnLogout.addEventListener('click', ()=> {
      firebase.auth().signOut()
    })
  }

});
