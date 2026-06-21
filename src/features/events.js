import config from "../config/config"
import request from "../util/request"

const eventBaseRoute = `${config.serverUrl}/events`

const stdFutureEventsRoute = `${eventBaseRoute}/fetch/std`
const stdHistoryRoute = `${eventBaseRoute}/fetch/std-history`

const futureEventsRoute = `${eventBaseRoute}/fetch`
const orgFutureEventsRoute = `${eventBaseRoute}/fetch/org`
const orgHistoryRoute = `${eventBaseRoute}/fetch/org-history`

const uploadEventRoute = `${eventBaseRoute}`

const startEventRegistrationRoute = (eventId) => (`${eventBaseRoute}/update/${eventId}/start-registration`)

const formBaseRoute = `${config.serverUrl}/forms`

const addFieldOrGetFormRoute = (eventId) => (`${formBaseRoute}/${eventId}`)

const updateOrDeleteFieldRoute = (eventId, formfieldId) => (`${formBaseRoute}/${eventId}/${formfieldId}`)

const participationBaseRoute = `${config.serverUrl}/participation`


const eventFormBody = (event) => {
    return {
        "name": event?.name || "",
        "description": event?.description || "",
        "organizer": event?.organizer || "",
        "domain": event?.domain || "",
        "location": event?.location || "",
        "city": event?.city || "",
        "date": event ? `${new Date(event.date).toISOString().slice(0, 16)}` : "",
        "duration": event?.duration || null,
        "registrationfees": event?.registrationfees || "",
        "lastregistrationdate": event ? `${new Date(event.lastregistrationdate).toISOString().slice(0, 16)}` : "",
        "isteamevent": event?.isteamevent ? true : false || false,
        "minteamsize": event?.minteamsize || null,
        "maxteamsize": event?.maxteamsize || null,
        "themeimage": event?.themeimage || "",
    }
}

const getEvent = async (eventId) => {
    return await request(
        "GET",
        null,
        `${eventBaseRoute}/access/${eventId}`,
        {}
    )
}

const fetchAllFutureEvents = async () => {
    return await request(
        "GET",
        null,
        futureEventsRoute,
        {}
    )
}

const fetchStdFutureEvents = async () => {
    return await request(
        "GET",
        null,
        stdFutureEventsRoute,
        {}
    )
}

const fetchStdHistory = async () => {
    return await request(
        "GET",
        null,
        stdHistoryRoute,
        {}
    )
}

const fetchOrgFutureEvents = async () => {
    return await request(
        "GET",
        null,
        orgFutureEventsRoute,
        {}
    )
}

const fetchOrgHistory = async () => {
    return await request(
        "GET",
        null,
        orgHistoryRoute,
        {}
    )
}

const uploadEvent = async (body) => {
    return await request(
        "POST",
        {},
        uploadEventRoute,
        {
            body: body
        }
    )
}

const updateEventDetails = async (eventId, body) => {
    return await request(
        "PUT",
        {},
        `${eventBaseRoute}/update/${eventId}`,
        {
            body: body
        }
    )
}

const startEventRegistration = async (eventId) => {
    return await request(
        "PUT",
        null,
        startEventRegistrationRoute(eventId),
        {}
    )
}

const addFormField = async (eventId, body) => {
    return await request(
        "POST",
        null,
        addFieldOrGetFormRoute(eventId),
        {
            body: JSON.stringify(body)
        }
    )
}

const deleteFormField = async (eventId, formfieldId) => {
    return await request(
        "DELETE",
        null,
        updateOrDeleteFieldRoute(eventId, formfieldId),
        {}
    )
}

const updateFormField = async (eventId, formfieldId, body) => {
    return await request(
        "PUT",
        null,
        updateOrDeleteFieldRoute(eventId, formfieldId),
        {
            body: JSON.stringify(body)
        }
    )
}

const createParticipation = async (eventId) => {
    return await request(
        "POST",
        null,
        `${participationBaseRoute}/${eventId}`,
        {}
    )
}

const completeParticipation = async (participationId, body) => {
    return await request(
        "POST",
        null,
        `${participationBaseRoute}/${participationId}`,
        {
            body: JSON.stringify(body)
        }
    )
}

export {
    eventFormBody,
    getEvent,
    fetchAllFutureEvents,
    fetchStdFutureEvents,
    fetchStdHistory,
    fetchOrgFutureEvents,
    fetchOrgHistory,
    uploadEvent,
    updateEventDetails,
    startEventRegistration,
    addFormField,
    updateFormField,
    deleteFormField,
    createParticipation,
    completeParticipation
}