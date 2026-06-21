import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye } from 'lucide-react';
import Button from './ui/Button';
import { FORM_FIELD_DATATYPES_OBJECT } from '../util/constants';
import { addRegDetails } from '../features/form';

// Datatype mapping to HTML input types
const typeMap = {
  String: 'text',
  Number: 'number',
  Email: 'email',
  'Contact-number': 'tel',
  Datetime: 'datetime-local',
  File: 'file',
  Boolean: 'checkbox',
};

const CustomRegistrationForm = ({
  fields = [],
  filledDetails = {},
  updateState = null,
  isPreview = false,
  eventDetails = null,
  onSelectField = () => { },
  selectedFieldId = null,
}) => {
  const { register, handleSubmit, getValues } = useForm({
    defaultValues: filledDetails
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    console.log("data :", data);

    if (isPreview) {
      alert("Preview Mode: Form submission simulated.");
      return;
    }

    const formData = new FormData();

    fields.forEach(field => {
      if (field.datatype === FORM_FIELD_DATATYPES_OBJECT["File"].name) {
        formData.append(field.name, data[field.name][0]);
      } else {
        formData.append(field.name, data[field.name]);
      }
    })

    try {
      setLoading(true);
      const res = await addRegDetails(eventDetails._id, eventDetails.participation._id, formData);
      console.log(res.data);
      updateState(res.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full max-h-[800px]">
      {/* Banner */}
      {eventDetails.themeimage && (
        <div className="w-full h-40 bg-gray-200">
          <img src={eventDetails.themeimage} alt="Event Banner" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Form Content (scrollable) */}
      <div className="p-8 flex-1 overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{eventDetails.name}</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">{eventDetails.description}</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ul className="space-y-6">

            {fields.map((field) => {
              const isSelected = isPreview && selectedFieldId === field._id;

              return (
                <li key={field._id}>
                  <div
                    onClick={() => isPreview && onSelectField(field._id)}
                    className={`
                    relative transition-all duration-200
                    ${isPreview ? 'cursor-pointer rounded-xl p-3 -mx-3 border-2 border-transparent hover:border-indigo-100 hover:bg-indigo-50/50' : ''}
                    ${isSelected ? '!border-indigo-500 !bg-indigo-50/50' : ''}
                  `}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-xs font-semibold tracking-widest text-gray-800 uppercase">
                        {field.name}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {field.tooltip && (
                        <span className="text-gray-400 group relative inline-flex cursor-help">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
                            {field.tooltip}
                          </span>
                        </span>
                      )}
                    </div>

                    {field.datatype === 'Options' ? (
                      <select
                        {...register(field.name, { required: field.required })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white cursor-pointer"
                      >
                        <option value="">Select your option...</option>
                        {field.options?.map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.datatype === 'Boolean' ? (
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50/50 w-max cursor-pointer">
                        <input
                          type="checkbox"
                          {...register(field.name, { required: field.required })}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 accent-indigo-600"
                        />
                        <span className="text-sm text-gray-700">{field.name}</span>
                      </label>
                    ) : (
                      <input
                        type={FORM_FIELD_DATATYPES_OBJECT[field.datatype]?.inputtype || 'text'}
                        {...register(field.name, { required: field.required })}
                        placeholder={`Enter ${field.name.toLowerCase()}...`}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-shadow"
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {fields.length === 0 && isPreview && (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center text-gray-400 min-h-[200px]">
              <span className="text-2xl mb-2">+</span>
              <p className="text-sm">Add fields from the right panel</p>
            </div>
          )}

          {!isPreview && fields.length > 0 && (
            <div className="pt-6">
              <Button disabled={loading || eventDetails.participation.registrationdetail || isPreview} type="submit" variant="primary" size="lg" fullWidth>
                Submit details
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CustomRegistrationForm;
