import React, { useState, useEffect } from 'react';
import { Eye, Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import CustomRegistrationForm from '../components/CustomRegistrationForm';
import { addFormField, getEvent, updateFormField, deleteFormField, startEventRegistration } from '../features/events';
import PageLoader from '../components/ui/PageLoader';
import { FORM_FIELD_DATATYPES, FORM_FIELD_DATATYPES_OBJECT } from '../util/constants';
import { useSelector } from 'react-redux';

const initialFields = [
  { id: 'f1', name: 'Full Name', tooltip: '', datatype: FORM_FIELD_DATATYPES.STRING, required: true, options: [] },
  { id: 'f2', name: 'University Email', tooltip: 'Must be a .edu email address', datatype: FORM_FIELD_DATATYPES.EMAIL, required: true, options: [] },
  { id: 'f3', name: 'T-Shirt Size', tooltip: 'For the hackathon swag bag', datatype: FORM_FIELD_DATATYPES.OPTIONS, required: false, options: ['Small', 'Medium', 'Large', 'X-Large'] },
];

const dataTypes = ['String', 'Number', 'Email', 'Contact-number', 'Datetime', 'File', 'Boolean', 'Options'];

const FormBuilder = () => {

  const navigate = useNavigate();
  const user = useSelector(state=>state.auth.user)
  const { eventId } = useParams()
  const [pageLoading, setPageLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState(null)
  const [fields, setFields] = useState(initialFields);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    getEvent(eventId)
      .then((res) => {
        if(user._id!==res.data.owner){
          navigate('/organizer')
          return
        }
        console.log(res.data);
        setEvent(res.data)
        setFields(res.data.registrationform)
        setIsPublished(res.data.isRegistrationStarted)
        // setSelectedField(res.data.registrationform[0])
        setPageLoading(false)
      })
      .catch((err) => {
        console.log(err)
        navigate('/organizer')
      })
  }, [])

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage("")
      }, 3000)
    }
  }, [message])

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("")
      }, 3000)
    }
  }, [error])

  useEffect(() => {
    setSelectedField(fields.find(f => f._id === selectedFieldId))
  }, [selectedFieldId])

  const handleAddField = (type) => {
    if (isPublished) return;
    const newId = `f${Date.now()}_new`;
    const newField = {
      _id: newId,
      name: `New ${type} Field`,
      tooltip: '',
      datatype: type,
      required: false,
      options: type === 'Options' ? ['Option 1', 'Option 2'] : [],
    };
    setFields([...fields, newField]);
    setSelectedFieldId(newId);
  };

  const handleUpdateField = (key, value) => {
    if (isPublished || !selectedFieldId) return;

    setSelectedField(prev => ({ ...prev, [key]: value }))
  };

  const handleRemoveField = () => {
    if (isPublished || !selectedFieldId) return;
    const newFields = fields.filter(f => f.id !== selectedFieldId);
    setFields(newFields);
    setSelectedFieldId(newFields.length > 0 ? newFields[newFields.length - 1].id : null);
  };

  const handleStartRegistrations = async () => {
    if (window.confirm("WARNING: Starting event registrations will lock this form. You will not be able to modify the form fields once registrations are open. Do you wish to proceed?")) {
      try {
        setLoading(true)
        const res = await startEventRegistration(eventId)
        console.log(res.data)
        // setMessage(res.message)
        setIsPublished(true)
        setLoading(false)
        alert("Registrations are now open. The form is locked.");
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }
  };

  const handleAddFieldRequest = async () => {
    try {
      setLoading(true)
      const res = await addFormField(eventId, selectedField)
      console.log(res.data)
      setMessage(res.message)
      setFields(prev => prev.map(f => f._id === selectedField._id ? res.data : f))
      setSelectedFieldId(null)
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleUpdateFieldRequest = async () => {
    try {
      setLoading(true)
      const res = await updateFormField(eventId, selectedField._id, selectedField)
      console.log(res.data)
      setMessage(res.message)
      setSelectedFieldId(null)
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleDeleteFieldRequest = async () => {
    if (selectedField._id.includes("new")) {
      setFields(prev => prev.filter(f => f._id !== selectedField._id))
      setSelectedFieldId(null)
      return
    }
    try {
      setLoading(true)
      const res = await deleteFormField(eventId, selectedField._id)
      console.log(res.data)
      setMessage(res.message)
      setFields(prev => prev.filter(f => f._id !== selectedField._id))
      setSelectedFieldId(null)
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return pageLoading ? <PageLoader /> : (
    <DashboardLayout role="organizer" userName="Curator">
      <div className="flex flex-col h-full bg-[#f8f8fc]">
        {/* Header Bar */}
        <div className="bg-white border-b border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Form Builder</h1>
              <p className="text-sm text-gray-500">Create a custom registration form for your event.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isPublished ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 font-semibold text-sm rounded-lg border border-green-200">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Registrations Active
              </span>
            ) : (
              <>
                <Button onClick={handleStartRegistrations} variant="primary">
                  Start Event Registrations
                </Button>
              </>
            )}
          </div>
        </div>

        {isPublished && (
          <div className="bg-amber-50 border-b border-amber-100 text-amber-800 px-6 py-3 text-sm flex items-center gap-2 font-medium shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            This form is locked because registrations have started. Fields cannot be modified.
          </div>
        )}

        {message && (
          <div className="bg-green-50 border-b border-green-100 text-green-800 px-6 py-3 text-sm flex items-center justify-center gap-2 font-medium shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-b border-red-100 text-red-800 px-6 py-3 text-sm flex items-center justify-center gap-2 font-medium shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            {error}
          </div>
        )}

        <div className="flex-1 flex flex-col xl:flex-row overflow-hidden p-6 gap-6 min-h-0">

          {/* Left Panel: Preview */}
          <div className="xl:w-2/3 flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Live Preview</span>
              <div className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                <Eye size={14} /> Organizers View
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <CustomRegistrationForm
                fields={fields}
                eventDetails={event}
                isPreview={true}
                selectedFieldId={selectedFieldId}
                onSelectField={(id) => {
                  if (!isPublished) {
                    setSelectedFieldId(id)
                  }
                }}
              />
            </div>
          </div>

          {/* Right Panel: Configuration */}
          <div className="xl:w-1/3 flex flex-col gap-6 overflow-y-auto pr-2 pb-6">

            {/* Quick Add Block */}
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-5">
              <h3 className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-4">Quick Add</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" size="sm" onClick={() => handleAddField('String')} disabled={isPublished} className="font-semibold text-xs py-2 bg-gray-50 border border-gray-200">
                  <div className="w-4 h-4 flex items-center justify-center mr-1"><span className="text-gray-400">T</span></div> Text Input
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleAddField('Options')} disabled={isPublished} className="font-semibold text-xs py-2 bg-gray-50 border border-gray-200">
                  <div className="w-4 h-4 flex items-center justify-center mr-1"><span className="text-gray-400">=</span></div> Dropdown
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleAddField('Boolean')} disabled={isPublished} className="font-semibold text-xs py-2 bg-gray-50 border border-gray-200">
                  <div className="w-4 h-4 flex items-center justify-center mr-1"><span className="text-gray-400">☑</span></div> Checkbox
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleAddField('Datetime')} disabled={isPublished} className="font-semibold text-xs py-2 bg-gray-50 border border-gray-200">
                  <div className="w-4 h-4 flex items-center justify-center mr-1"><span className="text-gray-400">📅</span></div> Date/Time
                </Button>
                <Button variant="primary" size="md" onClick={() => handleAddField('')} disabled={isPublished} className="self-start md:self-auto">
                  + Add new
                </Button>
              </div>
            </div>

            {/* Edit Field Block */}
            {selectedField ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden relative">
                {isPublished && <div className="absolute inset-0 bg-white/50 z-10" />}

                <div className="flex flex-col gap-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                        <Edit2 size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Edit Field</h3>
                        <p className="text-xs text-gray-500">Currently editing "{selectedField.name}"</p>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        await handleDeleteFieldRequest();
                      }}
                      disabled={isPublished} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <hr className="-mx-6 border-gray-50" />

                  <div>
                    <label className="text-xs font-semibold tracking-widest text-gray-800 uppercase block mb-2">Field Name</label>
                    <input
                      value={selectedField.name}
                      onChange={(e) => handleUpdateField('name', e.target.value)}
                      disabled={isPublished}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold tracking-widest text-gray-800 uppercase block mb-2">Tooltip / Hint Text</label>
                    <input
                      value={selectedField.tooltip}
                      onChange={(e) => handleUpdateField('tooltip', e.target.value)}
                      disabled={isPublished}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 outline-none"
                      placeholder="Optional helper text..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold tracking-widest text-gray-800 uppercase block mb-2">Data Type</label>
                    <select
                      value={selectedField.datatype}
                      onChange={(e) => handleUpdateField('datatype', e.target.value)}
                      disabled={isPublished}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 outline-none bg-white cursor-pointer"
                    >
                      {dataTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {selectedField.datatype === 'Options' && (
                    <div>
                      <label className="text-xs font-semibold tracking-widest text-gray-800 uppercase block mb-2">Options (comma separated)</label>
                      <input
                        value={selectedField.options.join(', ')}
                        onChange={(e) => handleUpdateField('options', e.target.value.split(',').map(s => s.trim()))}
                        disabled={isPublished}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 outline-none"
                        placeholder="Option 1, Option 2, Option 3"
                      />
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-xl p-4 flex flex-row items-center justify-between border border-gray-100">
                    <div>
                      <p className="font-semibold text-sm text-gray-800">Required Field</p>
                      <p className="text-xs text-gray-500">Make this field mandatory</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={selectedField.required}
                        onChange={(e) => handleUpdateField('required', e.target.checked)}
                        disabled={isPublished}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <Button variant="outline" disabled={loading} onClick={async () => {
                    console.log("selectedFieldId", selectedFieldId);
                    if (!selectedFieldId) return
                    if (selectedFieldId.includes("new")) {
                      await handleAddFieldRequest()
                    } else {
                      await handleUpdateFieldRequest()
                    }
                  }}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center text-gray-400 flex flex-col items-center justify-center">
                <Edit2 size={24} className="mb-2 opacity-50" />
                <p className="text-sm">Select a field in the preview to edit its properties or add new fields.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default FormBuilder;
