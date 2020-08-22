import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { Modal, Button, Input } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import ImageUploader from './ImageUploader';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);


  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
        // if (authUser.displayName) {

        // } else {
        //   return authUser.updateProfile({
        //     displayName: username,
        //   })
        // }

      } else {
        //user logged out
        setUser(null);
      }

    })
    return () => {
      //perform cleanup
      unsubscribe();
    }
  }, [user, username])

  // useEffect(() => {
  //   db.collection('Posts').onSnapshot(snapshot => {
  //     setPosts(snapshot.docs.map(doc => doc.data()));
  //   })
  // }, []);

  useEffect(() => {
    //after posts. orderBy('timestamp','desc')
    db.collection('Posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signup = (event) => {
    event.preventDefault();
    //setopen false
    // setOpen(false)


    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch(error => alert(error.message))
  }

  const signin = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false)
  }

  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app-signup'>

            <img className='app-signup-image' alt="" src="https://logos-world.net/wp-content/uploads/2020/04/Instagram-Logo.png" />
            <br></br>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={e => setEmail(e.target.value)}

            />
            <Input
              type="text"
              placeholder="password"
              value={password}
              onChange={e => setPassword(e.target.value)}

            />
            <Button type='submit' onClick={signup}>SIGN UP</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app-signup'>

            <img className='app-signup-image' alt="" src="https://logos-world.net/wp-content/uploads/2020/04/Instagram-Logo.png" />
            <br></br>

            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={e => setEmail(e.target.value)}

            />
            <Input
              type="text"
              placeholder="password"
              value={password}
              onChange={e => setPassword(e.target.value)}

            />
            <Button type='submit' onClick={signin}>SIGN IN</Button>
          </form>
        </div>
      </Modal>



      <div className='app-header'>
        <img alt="cant display" src="https://logos-world.net/wp-content/uploads/2020/04/Instagram-Logo.png" />
        {user ? (
          <Button onClick={() => auth.signOut()}>Log out</Button>
        ) : (
            <div className="login-container">
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign up</Button>
            </div>
          )}
      </div>


      <div className='app-posts'>

        {posts.map(({ id, post }) => <Post
          key={id}
          user={user}
          postId={id}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />)}
      </div>
      {user?.displayName ? (
        <ImageUploader username={user.displayName} />
      ) : (
          <h3>Sorry you need to log in </h3>
        )}
    </div>
  );
}

export default App;
