document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelector('#buttons');
  const username = document.querySelector('#username');
  const contentProtected = document.querySelector('#contentProtected');
  const form = document.querySelector('#form');
  const inputChat = document.querySelector('#inputChat');

  const secretKey = '$2a$10$pqkSHAp2b1Tj/SPHN3BoruAxdjRRm9ZPnz4jj7lje5E9Ffu0Ro45S';
  const encryptMessage = (message) => {
    const encryptedMessage = CryptoJS.AES.encrypt(message, secretKey).toString();
    return encryptedMessage;
  };

  const decryptMessage = (encryptedMessage) => {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
    const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedMessage;
  };

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user);
      buttons.innerHTML = /*html*/ `
        <button class="btn btn-outline-danger mr-2" id="btnLogout">Logout</button>
      `;
      username.innerHTML = user.displayName;
      logout();

      form.classList = 'input-group py-3 fixed-bottom container';
      chatContent(user);
    } else {
      console.log('User Does not exist');
      buttons.innerHTML = /*html*/ `
        <button class="btn btn-outline-success mr-2" id="btnAccess">Access</button>
      `;
      startSession();
      username.innerHTML = 'CHAT WEB';
      contentProtected.innerHTML = /*html*/ `
        <p class= "text-center lead mt-5">You Must first log in </p>
      `;
      form.classList = 'input-group py-3 fixed-bottom container d-none';
    }
  });

  const chatContent = (user) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log(inputChat.value);

      if (!inputChat.value.trim()) {
        console.log('Input Empty');
        return;
      }

      const encryptedMessage = encryptMessage(inputChat.value);

      firebase.firestore().collection('WebChat').add({
        texto: encryptedMessage,
        uid: user.uid,
        dateExact: Date.now()
      })
      .then(res => {
      })
      .catch(e => console.log(e));

      inputChat.value = '';
    });

    firebase.firestore().collection('WebChat').orderBy('dateExact').onSnapshot(query => {
      contentProtected.innerHTML = '';
      query.forEach(doc => {
        const decryptedMessage = decryptMessage(doc.data().texto);
        console.log(decryptedMessage);

        if (doc.data().uid === user.uid) {
          contentProtected.innerHTML += `
            <div class="d-flex justify-content-end">
                <span class="badge badge-pill badge-primary">${decryptedMessage}</span>
            </div>
          `;
        } else {
          contentProtected.innerHTML += `
            <div class="d-flex justify-content-start">
                <span class="badge badge-pill badge-secondary">${decryptedMessage}</span>
            </div>
          `;
        }

        contentProtected.scrollTop = contentProtected.scrollHeight;
      });
    });
  };

  const startSession = () => {
    const btnAccess = document.querySelector('#btnAccess');
    btnAccess.addEventListener('click', async () => {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await firebase.auth().signInWithPopup(provider);
      } catch (error) {
        console.log(error);
      }
    });
  };

  const logout = () => {
    const btnLogout = document.querySelector('#btnLogout');
    btnLogout.addEventListener('click', () => {
      firebase.auth().signOut();
    });
  };
});
