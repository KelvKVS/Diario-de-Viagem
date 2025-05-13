import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function UserProfile() {
    const posts = [
        "/images/post1.webp",
        "/images/post2.webp",
        "/images/post3.webp",
        "/images/post4.webp",
        "/images/post5.webp",
        "/images/post6.webp"
    ];

    return (
        <div className="container py-4">
            <div className="row align-items-center mb-4">
                <div className="col-md-3 text-center mb-3 mb-md-0">
                    <img
                        src="images/perfil-ms.svg"
                        alt="avatar"
                        className="rounded-circle"
                        width="120"
                        height="120"
                    />
                </div>
                <div className="col-md-9">
                    <h3 className="mb-1">maria_silva</h3>
                    <div className="d-flex flex-wrap gap-3 mb-2">
                        <span><strong>120</strong> posts</span>
                        <span><strong>2.300</strong> seguidores</span>
                        <span><strong>180</strong> seguindo</span>
                    </div>
                    <p className="mb-1">🌸 Amante da natureza e boas fotos!</p>
                    <div className="mt-2">
                        <button className="btn btn-light">Seguir</button>
                        <button className="btn btn-light ms-2">Mensagem</button>
                    </div>
                </div>
            </div>

            <hr />

            <div className="row g-2">
                {posts.map((src, idx) => (
                    <ImageCard src={src} idx={idx} key={idx} />
                ))}
            </div>
        </div>
    );
}

function ImageCard({ src, idx }) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="ratio ratio-1x1 position-relative bg-light">
                {!loaded && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-secondary bg-opacity-10 animate-pulse"></div>
                )}
                <img
                    src={src}
                    alt={`Post ${idx}`}
                    className="img-fluid object-fit-cover"
                    style={{
                        objectFit: 'cover',
                        opacity: loaded ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out'
                    }}
                    loading="lazy"
                    onLoad={() => setLoaded(true)}
                />
            </div>
        </div>
    );
}

export default UserProfile;
