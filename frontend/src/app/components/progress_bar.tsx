export default function ProgressBar({ progress = 1 }: { progress: number }) {
    return <div className="progress" role="progressbar" >
        <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${(100*progress).toString()}%` }}></div>
    </div>;
}