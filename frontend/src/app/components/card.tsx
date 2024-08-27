import { randomColor } from "./colors";

export default function Card({ title = "", color = "", children }: { title: string, color: string, children: any }) {
    if (color == "") {
        color = randomColor();
    }
    return <div className="card m-4" style={{ background: color, borderColor: color }}>
        <div className="card-body">
            <h5 className="card-title text-center">{title}</h5>
            {children}
        </div>
    </div>;
}