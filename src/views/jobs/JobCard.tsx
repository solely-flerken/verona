import type {JobListing} from './data'
import {LOCATION_LABELS} from './data'
import './JobCard.css'

export function JobCard({job}: { job: JobListing }) {
    return (
        <article className="job-card">
            <div className="job-card__badges flex items-center gap-2">
                <span className="job-badge job-badge--type">{job.employmentType}</span>
                <span className="job-badge job-badge--location">
                    {LOCATION_LABELS[job.location]}
                </span>
            </div>

            <h3 className="job-card__title">{job.title}</h3>
            <p className="job-card__description">{job.description}</p>

            <div className="job-card__lists flex flex-col gap-4">
                <div className="flex-1">
                    <p className="job-card__list-heading">Aufgaben</p>
                    <ul className="job-card__list">
                        {job.tasks.map((task, i) => (
                            <li key={i}>{task}</li>
                        ))}
                    </ul>
                </div>
                <div className="flex-1">
                    <p className="job-card__list-heading">Voraussetzungen</p>
                    <ul className="job-card__list">
                        {job.requirements.map((req, i) => (
                            <li key={i}>{req}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="job-card__footer">
                <span className="job-card__date">Seit {job.postedAt}</span>
            </div>
        </article>
    )
}
