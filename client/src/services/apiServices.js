import api from "./apiUtility";

export const getRequest = async (url) => {
    try {
        const response = await api.get(url);
        return response;
    } catch (error) {
        throw error
    }

}

export const postMultipartFormRequest = async (url, payload) => {
    try {
        const response = await api.post(url, payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response;
    } catch (error) {
        throw error
    }

}

export const postApplicationJsonRequest = async (url, payload) => {
    try {
        const response = await api.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response;
    } catch (error) {
        throw error
    }
}

export const patchRequest = async (url, payload) => {
    try {
        const response = await api.patch(url, payload);
        return response;
    } catch (error) {
        throw error
    }
}

export const patchMultipartFormRequest = async (url, payload) => {
    try {
        const response = await api.patch(url, payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response;
    } catch (error) {
        throw error
    }
}

export const deleteRequest = async (url) => {
    try {
        const response = await api.delete(url);
        return response;
    } catch (error) {
        throw error
    }

}

