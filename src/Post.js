import React, { useState, useEffect } from 'react';
import "./Post.css";
import { Avatar } from '@material-ui/core';
import { db } from './firebase';
import firebase from 'firebase';

function Post({ postId, user, username, caption, imageUrl }) {
    const [comments, setComments] = useState([]);
    const [comment, setcomment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection('Posts')
                .doc(postId)
                .collection('comments')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                })

        }


        return () => {
            unsubscribe();
        }
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();

        db
            .collection('Posts')
            .doc(postId)
            .collection('comments')
            .add({
                text: comment,
                username: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })

    }
    return (
        <div className="post">
            <div className="post-heading">
                <Avatar className="post-avatar" src="" alt="Adi" >{user ? username?.toUpperCase() : null}</Avatar>
                <h4 className="post-heading-username">{username}</h4>
            </div>
            <img className='post-img' alt="" src={imageUrl} />

            <p className='post-bottom'> <strong>{username}</strong> {caption}</p>

            <div className='post-comments'>
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>
            {/* user was added by me down below */}
            {user && <form className='post-commentBox'>
                <input
                    className='post-input'
                    type='text'
                    placeholder='Add a comment...'
                    value={comment}
                    onChange={e => setcomment(e.target.value)}
                />
                <button
                    disabled={!comment}
                    className='post-button'
                    type='submit'
                    onClick={postComment}>Post</button>
            </form>}
        </div>
    )
}

export default Post
