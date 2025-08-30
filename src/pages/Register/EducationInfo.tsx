import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface EducationInfoValues {
  educationLevel: string;
  institutionName: string;
  fieldOfStudy: string;
  graduationYear: string;
}

const EducationInfo: React.FC = () => {
  const navigate = useNavigate();

  const initialValues: EducationInfoValues = {
    educationLevel: '',
    institutionName: '',
    fieldOfStudy: '',
    graduationYear: '',
  };

  const validationSchema = Yup.object({
    educationLevel: Yup.string().required('Education level is required'),
    institutionName: Yup.string().when('educationLevel', {
      is: (val: string) => val !== 'none',
      then: () => Yup.string().required('Institution name is required'),
      otherwise: () => Yup.string(),
    }),
    fieldOfStudy: Yup.string().when('educationLevel', {
      is: (val: string) => val !== 'none' && val !== 'primary' && val !== 'secondary',
      then: () => Yup.string().required('Field of study is required'),
      otherwise: () => Yup.string(),
    }),
    graduationYear: Yup.string().when('educationLevel', {
      is: (val: string) => val !== 'none',
      then: () => Yup.string()
        .required('Graduation year is required')
        .matches(/^(19|20)\d{2}$/, 'Must be a valid year (e.g., 2020)'),
      otherwise: () => Yup.string(),
    }),
  });

  const handleSubmit = (values: EducationInfoValues) => {
    // Store education info in localStorage
    localStorage.setItem('educationInfo', JSON.stringify(values));
    
    // Navigate to next step
    navigate('/register/emergency-contacts');
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Education Information</h1>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="educationLevel" className="form-label">Highest Education Level</label>
              <Field
                as="select"
                id="educationLevel"
                name="educationLevel"
                className="form-input"
              >
                <option value="">Select Level</option>
                <option value="none">No Formal Education</option>
                <option value="primary">Primary School</option>
                <option value="secondary">Secondary School</option>
                <option value="certificate">Certificate</option>
                <option value="diploma">Diploma</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="doctorate">Doctorate</option>
              </Field>
              <ErrorMessage name="educationLevel" component="div" className="text-red-500 text-sm" />
            </div>

            {values.educationLevel && values.educationLevel !== 'none' && (
              <>
                <div className="form-group">
                  <label htmlFor="institutionName" className="form-label">Institution Name</label>
                  <Field
                    type="text"
                    id="institutionName"
                    name="institutionName"
                    className="form-input"
                  />
                  <ErrorMessage name="institutionName" component="div" className="text-red-500 text-sm" />
                </div>

                {values.educationLevel !== 'primary' && values.educationLevel !== 'secondary' && (
                  <div className="form-group">
                    <label htmlFor="fieldOfStudy" className="form-label">Field of Study</label>
                    <Field
                      type="text"
                      id="fieldOfStudy"
                      name="fieldOfStudy"
                      className="form-input"
                    />
                    <ErrorMessage name="fieldOfStudy" component="div" className="text-red-500 text-sm" />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="graduationYear" className="form-label">Graduation Year</label>
                  <Field
                    type="text"
                    id="graduationYear"
                    name="graduationYear"
                    className="form-input"
                    placeholder="e.g., 2020"
                  />
                  <ErrorMessage name="graduationYear" component="div" className="text-red-500 text-sm" />
                </div>
              </>
            )}

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => navigate('/register/work-info')}
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

export default EducationInfo;