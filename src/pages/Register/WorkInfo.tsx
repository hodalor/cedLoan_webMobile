import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface WorkInfoValues {
  employmentStatus: string;
  employer: string;
  jobTitle: string;
  monthlyIncome: string;
  workAddress: string;
  workPhone: string;
  employmentDuration: string;
}

const WorkInfo: React.FC = () => {
  const navigate = useNavigate();

  const initialValues: WorkInfoValues = {
    employmentStatus: '',
    employer: '',
    jobTitle: '',
    monthlyIncome: '',
    workAddress: '',
    workPhone: '',
    employmentDuration: '',
  };

  const validationSchema = Yup.object({
    employmentStatus: Yup.string().required('Employment status is required'),
    employer: Yup.string().when('employmentStatus', {
      is: (val: string) => val === 'employed' || val === 'self-employed',
      then: () => Yup.string().required('Employer name is required'),
      otherwise: () => Yup.string(),
    }),
    jobTitle: Yup.string().when('employmentStatus', {
      is: (val: string) => val === 'employed' || val === 'self-employed',
      then: () => Yup.string().required('Job title is required'),
      otherwise: () => Yup.string(),
    }),
    monthlyIncome: Yup.string().required('Monthly income is required'),
    workAddress: Yup.string().when('employmentStatus', {
      is: (val: string) => val === 'employed' || val === 'self-employed',
      then: () => Yup.string().required('Work address is required'),
      otherwise: () => Yup.string(),
    }),
    workPhone: Yup.string().when('employmentStatus', {
      is: (val: string) => val === 'employed' || val === 'self-employed',
      then: () => Yup.string().required('Work phone is required'),
      otherwise: () => Yup.string(),
    }),
    employmentDuration: Yup.string().when('employmentStatus', {
      is: (val: string) => val === 'employed' || val === 'self-employed',
      then: () => Yup.string().required('Employment duration is required'),
      otherwise: () => Yup.string(),
    }),
  });

  const handleSubmit = (values: WorkInfoValues) => {
    // Store work info in localStorage
    localStorage.setItem('workInfo', JSON.stringify(values));
    
    // Navigate to next step
    navigate('/register/education-info');
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Work Information</h1>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="employmentStatus" className="form-label">Employment Status</label>
              <Field
                as="select"
                id="employmentStatus"
                name="employmentStatus"
                className="form-input"
              >
                <option value="">Select Status</option>
                <option value="employed">Employed</option>
                <option value="self-employed">Self-Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="student">Student</option>
                <option value="retired">Retired</option>
              </Field>
              <ErrorMessage name="employmentStatus" component="div" className="text-red-500 text-sm" />
            </div>

            {(values.employmentStatus === 'employed' || values.employmentStatus === 'self-employed') && (
              <>
                <div className="form-group">
                  <label htmlFor="employer" className="form-label">Employer/Business Name</label>
                  <Field
                    type="text"
                    id="employer"
                    name="employer"
                    className="form-input"
                  />
                  <ErrorMessage name="employer" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="form-group">
                  <label htmlFor="jobTitle" className="form-label">Job Title/Position</label>
                  <Field
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    className="form-input"
                  />
                  <ErrorMessage name="jobTitle" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="form-group">
                  <label htmlFor="workAddress" className="form-label">Work Address</label>
                  <Field
                    type="text"
                    id="workAddress"
                    name="workAddress"
                    className="form-input"
                  />
                  <ErrorMessage name="workAddress" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="form-group">
                  <label htmlFor="workPhone" className="form-label">Work Phone</label>
                  <Field
                    type="text"
                    id="workPhone"
                    name="workPhone"
                    className="form-input"
                  />
                  <ErrorMessage name="workPhone" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="form-group">
                  <label htmlFor="employmentDuration" className="form-label">Employment Duration</label>
                  <Field
                    type="text"
                    id="employmentDuration"
                    name="employmentDuration"
                    className="form-input"
                    placeholder="e.g., 2 years"
                  />
                  <ErrorMessage name="employmentDuration" component="div" className="text-red-500 text-sm" />
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="monthlyIncome" className="form-label">Monthly Income (ZMW)</label>
              <Field
                type="text"
                id="monthlyIncome"
                name="monthlyIncome"
                className="form-input"
              />
              <ErrorMessage name="monthlyIncome" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => navigate('/register/personal-info')}
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

export default WorkInfo;