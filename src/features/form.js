import config from "../config/config";
import request from "../util/request";

const participationBaseRoute = `${config.serverUrl}/participation`

const addRegDetails = async (eventId, participationId, body) => {
    return await request(
        "POST",
        {},
        `${participationBaseRoute}/${eventId}/${participationId}/fill-details`,
        {
            body: body
        }
    )
}

export {
    addRegDetails
}
