import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setConfirmPassword] = useState('');
  const [user_type, setUserType] = useState('Customer');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password_confirmation) {
      alert('Passwords do not match');
      return;
    }
    const actionResult = await dispatch(registerUser({ name, email, password, password_confirmation, user_type }));
    if (registerUser.fulfilled.match(actionResult)) {
        navigate('/login');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Register</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password_confirmation" className="form-label">Confirm Password</label>
                  <input
                    id="password_confirmation"
                    type="password"
                    value={password_confirmation}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="user_type" className="form-label">User Type</label>
                  <select
                    id="user_type"
                    value={user_type}
                    onChange={(e) => setUserType(e.target.value)}
                    className="form-select"
                  >
                    <option value="Seller">Seller</option>
                    <option value="Customer">Customer</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
