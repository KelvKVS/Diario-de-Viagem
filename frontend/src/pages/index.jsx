import React from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import PostCard from '../assets/components/postcard'

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

    return (
        <div className="container">
            <h1>Vite + React + Bootstrap</h1>
            <div className="alert alert-secondary" role="alert">
                <p>"{data}" message from backend</p>
            </div>
            <main className="py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-6">
                            <div className="col-12 text-center mb-4">
                                <h2 className="fw-bold text-start">Últimos Posts</h2>
                            </div>
                            <div className="d-flex flex-column gap-4">
                                <PostCard
                                    autor="João"
                                    content="Curtindo o final de semana com os amigos 😎"
                                    title="Praia"
                                    image="/images/praia.jpg"
                                    date="13/05/2025"
                                />
                                <PostCard
                                    autor="Ana"
                                    content="Café e leitura, combinação perfeita ☕📖"
                                    title="Domingo"
                                    image="/images/cafe.jpg"
                                    date="13/05/2025"
                                />
                                <PostCard
                                    autor="Carlos"
                                    content="Primeiro dia na nova empresa 🚀"
                                    title="Novo desafio"
                                    image="/images/office.jpg"
                                    date="13/05/2025"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Index
