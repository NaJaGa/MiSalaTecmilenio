import React,{useState} from "react";
import axios from "axios";

export default function Register() {
    
    const [formData, setFormData] = React.useState({
        username: '',
        email: '',
        password1: '',
        password2: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

    }

    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (isLoading){
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/register/', formData);
        console.log("Success:", response.data);
        setSuccessMessage("Registration successful!");

      }catch (error) {
        console.error("Error:", error.response?.data);
        if (error.response && error.response.data) {
          Object.keys(error.response.data).forEach(field => {
            const errorMessages = error.response.data[field];
            if (errorMessages && errorMessages.length > 0) {
              setError(errorMessages[0]);
            }
          })
        }
        setIsLoading(false);
      }


      finally {
          setIsLoading(false); 
        }
    }
    
  return (
    <div className="register">
      {error && <p styl e={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <h2>Register</h2>
        <form>
            <label>username:</label><br/>
            <input type="text" name="username" value={formData.username} onChange={handleChange} /><br/>

            <label>Email:</label><br/>
            <input type="email" name="email" value={formData.email} onChange={handleChange} /><br/>

            <label>Password:</label><br/>
            <input type="password" name="password1" value={formData.password1} onChange={handleChange} /><br/>

            <label>Confirm Password:</label><br/>
            <input type="password" name="password2" value={formData.password2} onChange={handleChange} /><br/>
            <button type="submit" disabled={isLoading} onClick={handleSubmit}>Register</button>


        </form>
    </div>
  );
}