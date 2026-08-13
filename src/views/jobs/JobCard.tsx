import {MapPin, Clock} from 'lucide-react'
import type {JobListing} from './data'
import {getJobLocationLabel} from './data'
import './JobCard.css'

export function JobCard({job}: { job: JobListing }) {
    return (
        <article className="job-card">
            <div className="job-card__row">
                <h3 className="job-card__name">{job.title}</h3>
                <span className="job-card__leader flex-1" aria-hidden="true"/>
                <span className="job-card__type">{job.employmentType}</span>
            </div>
            <p className="job-card__meta flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="inline-flex items-center gap-1.5">
                    <MapPin size={12}/>
                    {getJobLocationLabel(job.locationSlugs)}
                </span>
                {job.postedAt &&
                    <span className="inline-flex items-center gap-1.5">
                        <Clock size={12}/>
                        Seit {job.postedAt}
                    </span>
                }
            </p>
            <p className="job-card__description">{job.description}</p>

            <div className="job-card__lists grid gap-6 sm:grid-cols-2">
                <div className="job-card__list-block">
                    <p className="job-card__list-heading">Aufgaben</p>
                    <ul className="job-card__list">
                        {job.tasks.map((task, i) => (
                            <li key={i}>{task}</li>
                        ))}
                    </ul>
                </div>
                <div className="job-card__list-block">
                    <p className="job-card__list-heading">Voraussetzungen</p>
                    <ul className="job-card__list">
                        {job.requirements.map((req, i) => (
                            <li key={i}>{req}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </article>
    )
}
