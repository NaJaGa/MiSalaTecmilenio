import React, {useState, useEffect} from "react";
import axios from "axios";

export default function Home() {

  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoggedInUser = async () => { 
    try{
      const token = localStorage.getItem('access_token');
      if(token){
        const config = {
          headers: { 
            'Authorization': `Bearer ${token}`
           }
        };
        const response = await axios.get('http://127.0.0.1:8000/api/user/', config);
        setIsLoggedIn(true);
        setUsername(response.data.username);
        console.log("Se Encontraron Datos");
      }
      else{
        setIsLoggedIn(false);
        setUsername('');
        console.log("No Se Encontraron Datos");
      }
    }catch(error){
      setIsLoggedIn(false);
      setUsername('');
      console.log('Error fetching user data:', error);

    }
  };
  checkLoggedInUser();
  },[])

  const handleLogout = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    const accessToken = localStorage.getItem('access_token');

    if (refreshToken && accessToken) {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      await axios.post(
        'http://3.20.76.36:8000/api/logout/',
        { refresh: refreshToken },
        config // ✅ Aquí pasamos el token de acceso
      );

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsLoggedIn(false);
      setUsername('');
      console.log("Logged out successfully");
    }
  } catch (e) {
    console.log('Error during logout:', e);
  }
};




  return (
    <div className="home">
      {isLoggedIn ? (
        <>
          <h2>Hi, {username}. Thanks for logging in!</h2>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <h2>Please Log In!</h2>
      )}
    </div>
  );
}