document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelector('#buttons');
  const username = document.querySelector('#username');
  const contentProtected = document.querySelector('#contentProtected')
  const form = document.querySelector('#form')
  const inputChat = document.querySelector('#inputChat')

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user);
      buttons.innerHTML = /*html*/ `
        <button class="btn btn-outline-danger mr-2" id="btnLogout">Logout</button>
      `
      username.innerHTML = user.displayName
      logout()
      
      form.classList = 'input-group py-3 fixed-bottom container'
      chatcontent(user)

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
    form.classList = 'input-group py-3 fixed-bottom container d-none'

  }
  });

  const chatcontent = (user) => {
    
      form.addEventListener('submit', (e) =>{
        e.preventDefault()
        console.log(inputChat.value)

        if(!inputChat.value.trim()){
          console.log('Input Empty')
          return
        }

        firebase.firestore().collection('WebChat').add({
          texto: inputChat.value,
          uid: user.uid,
          dateExact: Date.now()
        })
          .then(res => {console.log('Saved Message')})
          .catch(e => console.log(e))

        inputChat.value= ""

    })

    firebase.firestore().collection('WebChat').orderBy('dateExact').onSnapshot(query=>{

      contentProtected.innerHTML = ""
      query.forEach(doc => {
        console.log(doc.data())
        if(doc.data().uid === user.uid){
          contentProtected.innerHTML += `
            <div class="d-flex justify-content-end">
                <span class="badge badge-pill badge-primary">${doc.data().texto}</span>
            </div>
          `
        }else{
          contentProtected.innerHTML += `
            <div class="d-flex justify-content-start">
                  <span class="badge badge-pill badge-secondary">${doc.data().texto}</span>
            </div>
          `
        }

        contentProtected.scrollTop = contentProtected.scrollHeight

      })
    })

  }

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
