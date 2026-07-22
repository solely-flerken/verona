import {PageLayout} from '../../layouts/PageLayout'
import {jobsData, jobsMetaDescription} from './data'
import {JobCard} from './JobCard'
import {ContactCard} from './ContactCard'
import {imagesData} from '../../shared/imagesData'
import './index.css'

export function JobsPage() {
    const activeJobs = jobsData.filter(j => j.active)

    return (
        <PageLayout
            subtitle="Jobs"
            description={jobsMetaDescription}
            showBack
        >
            <main className="flex-1 jobs-page" style={{backgroundImage: `url(${imagesData.wesekeLounge.src})`}}>
                <div className="jobs-content">
                    <div className="jobs-header">
                        <p className="jobs-eyebrow">Jobs · Weseke &amp; Borken</p>
                        <h1 className="jobs-title">Werde Teil unseres Teams.</h1>
                        <p className="jobs-subtitle">
                            Wir suchen engagierte Menschen für unsere Standorte in Weseke und Borken.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="jobs-separator" aria-hidden="true"/>
                        <h2 className="jobs-section-heading">
                            {activeJobs.length > 0 ? 'Offene Stellen' : 'Keine offenen Stellen'}
                        </h2>
                        {activeJobs.length === 0 && (
                            <p className="jobs-subtitle">
                                Nicht immer ist alles aktuell. Fragen kostet nichts.
                            </p>
                        )}
                        {activeJobs.map(job => (
                            <JobCard key={job.id} job={job}/>
                        ))}
                        <div className="jobs-separator" aria-hidden="true"/>
                        <ContactCard/>
                    </div>
                </div>
            </main>
        </PageLayout>
    )
}
