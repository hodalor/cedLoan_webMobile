import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface RegisterValues {
  phoneNumber: string;
  acceptTerms: boolean;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const initialValues: RegisterValues = {
    phoneNumber: '',
    acceptTerms: false,
  };

  const phoneRegExp = /^[0-9]{10}$/;

  const validationSchema = Yup.object({
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .matches(phoneRegExp, 'Phone number must be 10 digits'),
    acceptTerms: Yup.boolean()
      .required('Required')
      .oneOf([true], 'You must accept the terms and conditions'),
  });

  const handleSubmit = (values: RegisterValues) => {
    try {
      // Store phone number in localStorage (in a real app, this would be sent to an API)
      localStorage.setItem('phoneNumber', values.phoneNumber);
      
      // Navigate to OTP verification
      navigate('/register/verify-otp');
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Create Account</h1>
        <p className="text-sm text-gray-600 mt-1">
          Enter your phone number to get started
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

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
                placeholder="Enter 10 digit phone number"
              />
              <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="form-group">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Field
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="acceptTerms" className="text-gray-700">
                    I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                  </label>
                  <ErrorMessage name="acceptTerms" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              Continue
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a
                  href="/login"
                  className="text-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/login');
                  }}
                >
                  Login
                </a>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;