import config from "../config/config"
import request from "../util/request"

const teamBaseRoute = `${config.serverUrl}/teams`

const addTeamMember = async (eventId, teamId, body) => {
    return await request(
        "POST",
        null,
        `${teamBaseRoute}/${eventId}/${teamId}`,
        {
            body: JSON.stringify(body)
        }
    )
}

const removeTeamMember = async (eventId, teamId, userId) => {
    return await request(
        "DELETE",
        null,
        `${teamBaseRoute}/${eventId}/${teamId}/${userId}`
    )
}

export {
    addTeamMember,
    removeTeamMember
}