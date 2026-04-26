import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ClosedCaption, Cross, Image as ImageIcon, X } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import { getEvent, updateEventDetails, eventFormBody } from '../features/events';
import PageLoader from '../components/ui/PageLoader';
import { useSelector } from 'react-redux';

const UpdateEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const user = useSelector(state => state.auth.user)
    const [event, setEvent] = useState(null)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [pageLoading, setPageLoading] = useState(true)
    const [loading, setLoading] = useState(false)
    const [fileName, setFileName] = useState("")

    const { register, handleSubmit, setValue, watch, getValues } = useForm()
    const isTeamEvent = watch("isteamevent")
    const thimg = watch("themeimage")


    useEffect(() => {
        getEvent(id)
            .then((res) => {
                if (user._id !== res.data.owner) {
                    navigate('/organizer')
                    return
                }
                setEvent(res.data)
                setValue("name", res.data.name)
                setValue("description", res.data.description)
                setValue("domain", res.data.domain)
                setValue("date", new Date(res.data.date).toISOString().substring(0, 16))
                setValue("lastregistrationdate", new Date(res.data.lastregistrationdate).toISOString().substring(0, 16))
                setValue("location", res.data.location)
                setValue("city", res.data.city)
                setValue("registrationfees", res.data.registrationfees)
                setValue("isteamevent", res.data.isteamevent)
                setValue("minteamsize", res.data.minteamsize)
                setValue("maxteamsize", res.data.maxteamsize)
                setValue("maxparticipants", res.data.maxparticipants)
                setValue("duration", res.data.duration)
                setTimeout(() => {
                    setPageLoading(false)
                }, 500)
            })
            .catch((err) => {
                setError(err.message)
                setTimeout(() => {
                    setPageLoading(false)
                }, 500)
            })
    }, [])

    const onSubmit = async (data) => {
        console.log(data);

        data.date = new Date(data.date).getTime()
        data.lastregistrationdate = new Date(data.lastregistrationdate).getTime()

        try {
            setLoading(true)
            const formData = new FormData()

            if (data.themeimage[0]) formData.append("themeimage", data.themeimage[0])

            delete data.themeimage

            for (const key in data) {
                if (data[key] !== event[key]) formData.append(key, data[key])
            }

            console.log(formData);


            const res = await updateEventDetails(id, formData)

            if (res) {
                setMessage("Event details updated successfully")
                setTimeout(() => {
                    setLoading(false)
                    navigate('/organizer');
                }, 1000)
            }
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }
    };

    return pageLoading ? <PageLoader /> : (
        <DashboardLayout role="organizer" userName="Curator">
            <div className="p-6 max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Upload Event</h1>
                    {/* <p className="text-sm text-gray-500 mt-1">Curate a new experience for the campus community.</p> */}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Main Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-5">
                            <div>
                                <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase block mb-2">Event Name</label>
                                <input
                                    disabled={loading}
                                    {...register('name', { required: true })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                                    placeholder="e.g. Annual Tech Symposium"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase block mb-2">Description</label>
                                <textarea
                                    disabled={loading}
                                    {...register('description', { required: true })}
                                    rows={5}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                                    placeholder="Share the vision and details of your event..."
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase block mb-2">Category</label>
                                <select
                                    disabled={loading}
                                    {...register('domain', { required: true })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
                                >
                                    <option value="Workshop">Workshop</option>
                                    <option value="Seminar">Seminar</option>
                                    <option value="Social">Social</option>
                                    <option value="Hackathon">Hackathon</option>
                                    <option value="Cultural">Cultural</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Technical">Technical</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase block mb-2">Theme Image</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                                        <ImageIcon size={20} />
                                    </div>
                                    {/* <p className="font-semibold text-sm text-gray-900 mb-1">Drag and drop your poster</p> */}
                                    <p className="text-xs text-gray-500 mb-4">PNG, JPG up to 10MB (16:9 ratio)</p>
                                    {thimg?.[0] && <p className="text-sm text-gray-900 mb-4">{thimg[0].name}</p>}
                                    <label htmlFor="ti" className='p-2 inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-200 cursor-pointer border border-indigo-600 text-indigo-600 hover:bg-indigo-50 bg-transparent'>
                                        Browse Files
                                    </label>
                                    <input disabled={loading} id='ti' type="file" className='invisible' {...register('themeimage', { required: true })}
                                    // onChange={(e) => {
                                    //   setValue("themeimage", e.target.files[0])
                                    //   setFileName(e.target.files[0]?.name || "")
                                    // }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase block mb-2">Date</label>
                                    <input
                                        disabled={loading}
                                        type="datetime-local"
                                        {...register('date', { required: true })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase block mb-2">Duration</label>
                                    <input
                                        disabled={loading}
                                        {...register('duration')}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                                        placeholder="e.g. 3 Hours"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase block mb-2">Location</label>
                                <input
                                    disabled={loading}
                                    {...register('location', { required: true })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                                    placeholder="Campus Auditorium, Hall A"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase block mb-2">City</label>
                                <input
                                    disabled={loading}
                                    {...register('city')}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                                    placeholder="New York, NY"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase block mb-2">Last Registration Date</label>
                                <input
                                    disabled={loading}
                                    type="datetime-local"
                                    {...register('lastregistrationdate', { required: true })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase block mb-2">Max Participants</label>
                                <input
                                    disabled={loading}
                                    type="number"
                                    {...register('maxparticipants')}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                                    placeholder="500"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Registration Fees & Teams Section */}
                    <div className="bg-gray-50 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border border-gray-100">
                        <div>
                            <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase block mb-2">Registration Fees</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">₹</span>
                                <input
                                    disabled={loading}
                                    type="number"
                                    // step="0.01"
                                    {...register('registrationfees')}
                                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
                                    placeholder="0"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2 italic">Leave at 0 for free events.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Is Team Event</p>
                                    <p className="text-xs text-gray-500">Allow group registrations</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input disabled={loading} type="checkbox" className="sr-only peer" {...register('isteamevent')} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            {isTeamEvent && (
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase block mb-2">Min Team Size</label>
                                        <input
                                            disabled={loading}
                                            type="number"
                                            {...register('minteamsize')}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 outline-none bg-white"
                                            placeholder="2"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase block mb-2">Max Team Size</label>
                                        <input
                                            disabled={loading}
                                            type="number"
                                            {...register('maxteamsize')}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 outline-none bg-white"
                                            placeholder="4"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && <p className='w-full flex justify-end items-center gap-2 text-red-500 text-right'>{error} <button className='text-blue-500 underline' onClick={() => setError("")}><X size={15} /></button></p>}

                    {message && <p className='w-full flex justify-end items-center gap-2 text-green-500 text-right'>{message} <button className='text-blue-500 underline' onClick={() => setMessage("")}><X size={15} /></button></p>}
                    <div className="flex justify-end pt-4">
                        <Button disabled={loading} type="submit" variant="primary" size="lg" className="px-8">
                            {loading ? "Saving changes..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default UpdateEvent;
