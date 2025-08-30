import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';

interface Contact {
  name: string;
  relationship: string;
  phoneNumber: string;
}

interface EmergencyContactsValues {
  contacts: Contact[];
}

const EmergencyContacts: React.FC = () => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initialValues: EmergencyContactsValues = {
    contacts: [
      { name: '', relationship: '', phoneNumber: '' },
      { name: '', relationship: '', phoneNumber: '' },
      { name: '', relationship: '', phoneNumber: '' },
    ],
  };

  const phoneRegExp = /^[0-9]{10}$/;

  const validationSchema = Yup.object({
    contacts: Yup.array()
      .of(
        Yup.object({
          name: Yup.string().required('Name is required'),
          relationship: Yup.string().required('Relationship is required'),
          phoneNumber: Yup.string()
            .required('Phone number is required')
            .matches(phoneRegExp, 'Phone number must be 10 digits'),
        })
      )
      .min(3, 'Three emergency contacts are required'),
  });

  const handleSubmit = (values: EmergencyContactsValues) => {
    try {
      // Check for duplicate phone numbers
      const phoneNumbers = values.contacts.map(contact => contact.phoneNumber);
      const uniquePhoneNumbers = new Set(phoneNumbers);
      
      if (uniquePhoneNumbers.size !== phoneNumbers.length) {
        setSubmitError('Each emergency contact must have a unique phone number');
        return;
      }
      
      // Store emergency contacts in localStorage
      localStorage.setItem('emergencyContacts', JSON.stringify(values.contacts));
      
      // Navigate to next step
      navigate('/register/id-verification');
    } catch (error) {
      setSubmitError('An error occurred. Please try again.');
    }
  };

  const relationshipOptions = [
    'Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 
    'Relative', 'Colleague', 'Neighbor', 'Other'
  ];

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Emergency Contacts</h1>
        <p className="text-sm text-gray-600 mt-1">
          Please provide three emergency contacts who we can reach out to if needed.
        </p>
      </div>

      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {submitError}
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <FieldArray name="contacts">
              {() => (
                <>
                  {values.contacts.map((_, index) => (
                    <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md">
                      <h3 className="font-medium mb-3">Contact {index + 1}</h3>
                      
                      <div className="form-group">
                        <label htmlFor={`contacts.${index}.name`} className="form-label">
                          Full Name
                        </label>
                        <Field
                          type="text"
                          id={`contacts.${index}.name`}
                          name={`contacts.${index}.name`}
                          className="form-input"
                        />
                        <ErrorMessage
                          name={`contacts.${index}.name`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor={`contacts.${index}.relationship`} className="form-label">
                          Relationship
                        </label>
                        <Field
                          as="select"
                          id={`contacts.${index}.relationship`}
                          name={`contacts.${index}.relationship`}
                          className="form-input"
                        >
                          <option value="">Select Relationship</option>
                          {relationshipOptions.map(option => (
                            <option key={option} value={option.toLowerCase()}>
                              {option}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name={`contacts.${index}.relationship`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor={`contacts.${index}.phoneNumber`} className="form-label">
                          Phone Number
                        </label>
                        <Field
                          type="text"
                          id={`contacts.${index}.phoneNumber`}
                          name={`contacts.${index}.phoneNumber`}
                          className="form-input"
                          placeholder="10 digits"
                        />
                        <ErrorMessage
                          name={`contacts.${index}.phoneNumber`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </>
              )}
            </FieldArray>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => navigate('/register/education-info')}
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

export default EmergencyContacts;