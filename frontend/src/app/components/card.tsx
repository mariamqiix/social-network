import { randomColor } from "./colors";

export default function Card({ className = "m-4", title = "", color = "", children }: { className: string, title: string, color: string, children: any }) {
    if (color == "") {
        color = randomColor();
    }
    return <div className={"card " + className} style={{ background: color, borderColor: color }}>
        <div className="card-body">
            <h5 className="card-title text-center">{title}</h5>
            {children}
        </div>
    </div>;
}