import React from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'

function Index() {
    const [data, setData] = React.useState(null)

    useEffect(() => {
        axios.get('/api/hello')
            .then(response => {
                setData(response.data)
                console.log('Data fetched:', response.data)
            })
            .catch(error => {
                console.error('Error fetching data:', error)
            })
    }, []);
    return (<div className="container">
        <h1>Vite + React + Bootstrap</h1>
        <div className="alert alert-secondary" role="alert">
            <p>"{data}" message from backend</p>
        </div>
        <nav>
            <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </nav>
    </div>
    )
}

export default Index