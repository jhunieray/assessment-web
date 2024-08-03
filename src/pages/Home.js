import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, getUser } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [location, setLocation] = useState([51.505, -0.09]); // Default location
  const [mapZoom, setMapZoom] = useState(13);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          dispatch(getUser(token));
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get('https://api.ipgeolocation.io/ipgeo?apiKey=YOUR_API_KEY');
        if (response.data) {
          setLocation([response.data.latitude, response.data.longitude]);
        }
      } catch (error) {
        console.error('Failed to fetch location:', error);
      }
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    if (window.L) {
      const map = window.L.map('map').setView(location, mapZoom);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      window.L.marker(location).addTo(map).bindPopup('Your current location');
    }
  }, [location, mapZoom]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleEdit = () => {
    setEditing(!editing);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/auth/user', { name, email }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditing(false);
      dispatch(getUser(token)); // Refresh user data
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Profile Information</h2>
              <div className="mb-3">
                <label className="form-label">Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                  />
                ) : (
                  <p>{name}</p>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                {editing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                  />
                ) : (
                  <p>{email}</p>
                )}
              </div>
              <button
                className="btn btn-primary"
                onClick={editing ? handleSave : handleEdit}
              >
                {editing ? 'Save' : 'Edit'}
              </button>
              <button
                className="btn btn-danger ms-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Your Location</h2>
              <div id="map" style={{ height: '400px', width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
