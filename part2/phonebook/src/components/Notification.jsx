const Notification = ({ message, successState }) => {
    if (message === null) {
        return null
    }

    return (
        <div className = {successState ? 'successfulMessage' : 'unsuccessfulMessage'}>
            {message}
        </div>
    )
}

export default Notification