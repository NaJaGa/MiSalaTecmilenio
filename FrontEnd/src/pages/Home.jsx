import React, {useState} from "react";


export default function Home() {
  const [username, setUsername] = useState('');
  const [islogggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className="home">
      <h2>Hi, {username}. Thanks for logging in!</h2>
      <h2>Please Log In!</h2>



    </div>
  );
}