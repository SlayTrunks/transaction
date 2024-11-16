import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState(null);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem("token");

 
    if (!token) {
      setError('No token found');
      setLoading(false);
      return;
    }


    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/user/profile", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        // console.log(data)
        setProfile(data); 
       
      } catch (error) {
        setError(error.message);  // Set error state if the request fails
      } finally {
        setLoading(false);  // Set loading to false once the request is done
      }
    };

    fetchData();  // Call fetch function
  }, []);  // Empty dependency array to run only once when component mounts

  // Show loading spinner while waiting for data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message if there's any
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render profile data
  return (
    <div>
      <h1>Profile</h1>
      <p>{profile ? `Welcome, ${profile.message.firstname} ${profile.message.lastname} ` : 'No profile data found.'}</p>
      <p>Email: {profile ? profile.message.email : 'N/A'}</p>
    </div>
  );
};

export default Profile;
