import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface PersonalInfoValues {
  firstName: string;
  lastName: string;
  email: string;
  nationalId: string;
  dateOfBirth: string;
  gender: string;
  address: string;
}

const PersonalInfo: React.FC = () => {
  const navigate = useNavigate();

  const initialValues: PersonalInfoValues = {
    firstName: '',
    lastName: '',
    email: '',
    nationalId: '',
    dateOfBirth: '',
    gender: '',
    address: '',
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    nationalId: Yup.string().required('National ID is required'),
    dateOfBirth: Yup.date().required('Date of birth is required')
      .max(new Date(), 'Date of birth cannot be in the future'),
    gender: Yup.string().required('Gender is required'),
    address: Yup.string().required('Address is required'),
  });

  const handleSubmit = (values: PersonalInfoValues) => {
    // Store personal info in localStorage
    localStorage.setItem('personalInfo', JSON.stringify(values));
    
    // Navigate to next step
    navigate('/register/work-info');
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Personal Information</h1>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <Field
                type="text"
                id="firstName"
                name="firstName"
                className="form-input"
              />
              <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <Field
                type="text"
                id="lastName"
                name="lastName"
                className="form-input"
              />
              <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <Field
                type="email"
                id="email"
                name="email"
                className="form-input"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="form-group">
              <label htmlFor="nationalId" className="form-label">National ID</label>
              <Field
                type="text"
                id="nationalId"
                name="nationalId"
                className="form-input"
              />
              <ErrorMessage name="nationalId" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
              <Field
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                className="form-input"
              />
              <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="form-group">
              <label htmlFor="gender" className="form-label">Gender</label>
              <Field
                as="select"
                id="gender"
                name="gender"
                className="form-input"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Field>
              <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">Address</label>
              <Field
                as="textarea"
                id="address"
                name="address"
                className="form-input"
                rows={3}
              />
              <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => navigate('/register/set-pin')}
                className="px-4 py-2 border border-gray-300 rounded"
              >
                Back
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                style={{ width: 'auto' }}
              >
                Next
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PersonalInfo;