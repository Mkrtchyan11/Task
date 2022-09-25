
import { useEffect, useState } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';

import './App.css';

function App() {
  const [ profile, setProfile ] = useState([]);
  const [postsData, setPostsData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [activePost, setActivePost] = useState('');
  const [commentsData, setCommentsData] = useState();

  const clientId = process.env.REACT_APP_CLIENT_ID;

  const fetchData = async (url, setData) => {
      setIsError(false);
      setIsLoading(true);
      try {
        const response = await fetch(url);
        const data = await response.json();
        setData(data);
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
  };

    useEffect(() => {
    const initClient = () => {
          gapi.client.init({
          clientId: clientId,
          scope: ''
        });
    };
    gapi.load('client:auth2', initClient);
  });

  const onSuccess = (res) => {
      setProfile(res.profileObj);
      fetchData('https://dummyjson.com/posts', setPostsData);
  };

  const onFailure = (err) => {
      console.log('failed', err);
  };

  const logOut = () => {
      setProfile(null);
  };  

  const onPostClick = (postId) => {
    setActivePost(postId);
    fetchData(`https://dummyjson.com/posts/${postId}/comments`, setCommentsData);
  }

  return (
    <div>
        {profile ? (
            <div>
            {
              isError && <p>Something went wrong</p>
            }
            {
              isLoading && <p>Loading data</p>
            }
              <h3 className='all-posts bold'>All Posts</h3>
              <ol>
              {
                postsData && postsData.posts.map((post) => {
                  return (
                      <li key={post.id} onClick={() => onPostClick(post.id)}>{ post.title }</li>
                  )
                })
              }
              { activePost &&  (
                <>
                <h4 className='active-post bold'>Active Post</h4>
                <p>{ postsData.posts[activePost].title }</p>
                <p>{ postsData.posts[activePost].body }</p>
                <h5 className='comments bold'>Comments</h5>
                {
                  commentsData && commentsData.comments.map((comment) => {
                    return (
                        <p key={comment.id}>{ comment.body }</p>
                    )
                  })
                }
                </>
              )
              }
              </ol>
              <GoogleLogout clientId={clientId} buttonText="Log out" onLogoutSuccess={logOut} />
              </div>
          ) : (
              <GoogleLogin
                  clientId={clientId}
                  buttonText="Sign in with Google"
                  onSuccess={onSuccess}
                  onFailure={onFailure}
                  cookiePolicy={'single_host_origin'}
              />
          )}
    </div>
);
}
export default App;