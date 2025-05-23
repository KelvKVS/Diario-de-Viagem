import React from 'react'
import { useEffect } from 'react'
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

    const posts = [
        {
            autor: "João",
            content: "Curtindo o final de semana com os amigos 😎",
            title: "Praia",
            image: "/images/praia.webp",
            date: "13/05/2025"
        },
        {
            autor: "Ana",
            content: "Café e leitura, combinação perfeita ☕📖",
            title: "Domingo",
            image: "/images/cafe.webp",
            date: "13/05/2025"
        },
        {
            autor: "Carlos",
            content: "Primeiro dia na nova empresa 🚀",
            title: "Novo desafio",
            image: "/images/office.webp",
            date: "13/05/2025"
        }
    ]

    return (
        <div className="container">
            <h1>Vite + React + Bootstrap</h1>
            <main className="py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-6">
                            <div className="col-12 text-center mb-4">
                                <h2 className=" fw-bold text-start">Últimos Posts</h2>
                            </div>
                            <div className="d-flex flex-column gap-4">
                                {posts.map((post, idx) => (
                                    <PostCard
                                        key={idx}
                                        title={post.title}
                                        date={post.date}
                                        content={post.content}
                                        autor={post.autor}
                                        image={post.image}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Index
