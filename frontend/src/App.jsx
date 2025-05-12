import React, { useEffect } from 'react'
import axios from 'axios'

function App() {
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

  return (
    <>
      <div className="container">
        <h1>Vite + React + Bootstrap</h1>
        <div className="alert alert-secondary" role="alert">
          <p>"{data}" message from backend</p>
        </div>
      </div>
    </>
  )
}

export default App
