import React, { useState } from "react";
import { Heart } from "lucide-react";

function PostCard({
    title = "Título do Post",
    date = "20/10/2021 21:04",
    content = "Conteúdo do Post",
    autor = "Levi",
    image = "https://placehold.co/600x600"
}) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="card mb-4 shadow-sm border-0">
            <div className="card-header bg-white d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <img
                        src={`https://ui-avatars.com/api/?name=${autor}&background=random`}
                        alt="avatar"
                        className="rounded-circle me-2"
                        width="40"
                        height="40"
                    />
                    <strong>{autor}</strong>
                </div>
                <small className="text-muted">{date}</small>
            </div>

            <div className="position-relative w-100" style={{ aspectRatio: '1 / 1' }}>
                {!loaded && (
                    <div className="position-absolute top-50 start-50 translate-middle">
                        <div className="spinner-border text-secondary" role="status" />
                    </div>
                )}
                <img
                    src={image}
                    className="img-fluid w-100 h-100"
                    alt={`Imagem do post: ${title}`}
                    style={{
                        objectFit: "cover",
                        opacity: loaded ? 1 : 0,
                        transition: "opacity 0.3s ease-in-out"
                    }}
                    loading="lazy"
                    onLoad={() => setLoaded(true)}
                />
            </div>

            <div className="card-body">
                <p className="mb-1">{content}</p>
                <div className="d-flex justify-content-between align-items-center">
                    <button
                        className="btn border-0 rounded-circle p-2 d-flex align-items-center justify-content-center"
                        style={{ transition: "0.2s ease", color: "#000" }}
                    >
                        <Heart size={28} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PostCard;
