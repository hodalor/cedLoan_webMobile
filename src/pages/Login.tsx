import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const initialValues = {
    phoneNumber: '',
    pin: '',
  };

  const validationSchema = Yup.object({
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .matches(/^\d{9,10}$/, 'Phone number must be 9-10 digits'),
    pin: Yup.string()
      .required('PIN is required')
      .matches(/^\d{4}$/, 'PIN must be 4 digits'),
  });

  const handleSubmit = (values: typeof initialValues) => {
    // In a real app, you would validate credentials with an API
    // For now, we'll simulate a successful login
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('phoneNumber', values.phoneNumber);
    navigate('/home');
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Nguzu Lending</h1>
        <p>Login to your account</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
              <Field
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className="form-input"
                placeholder="Enter your phone number"
              />
              <ErrorMessage name="phoneNumber" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="pin" className="form-label">PIN</label>
              <Field
                type="password"
                id="pin"
                name="pin"
                className="form-input"
                placeholder="Enter your 4-digit PIN"
              />
              <ErrorMessage name="pin" component="div" className="error" />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>

      <div className="mt-4 text-center">
        <p>
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;