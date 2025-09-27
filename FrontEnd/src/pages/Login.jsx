import React,{useState} from "react";
import axios from "axios";


export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
        if (isLoading) {
          return;
        }

      setIsLoading(true);

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/login/', formData);
        console.log("Success:", response.data);
        setSuccessMessage("Login successful!");
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);

      }catch (error) {
        console.log("Error:", error.response?.data);
        if (error.response && error.response.data) {
          Object.keys(error.response.data).forEach(field => {
            const errorMessages = error.response.data[field];
            if (errorMessages && errorMessages.length > 0) {
              setError(errorMessages[0]);
            }
          })
        }
      }


      finally {
          setIsLoading(false); 
        }
    }

  return ( 
   <div className="login">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <h2>login:</h2>
        <form>
            
            <label>Email:</label><br/>
            <input type="email" name="email" value={formData.email} onChange={handleChange} /><br/>

            <label>Password:</label><br/>
            <input type="password" name="password" value={formData.password} onChange={handleChange} /><br/>

            <button type="submit" disabled={isLoading} onClick={handleSubmit}>Login</button>

        </form>
    </div>

  );
}