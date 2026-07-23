import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = (newObject) => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const erase = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`) 
    return request.then(response => response.data)
}

// if find a name => setNumber of that name to newNumber, else return nothing
const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

export default 
{
    getAll,
    create,
    erase,
    update,
}