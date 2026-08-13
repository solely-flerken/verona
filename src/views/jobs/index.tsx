import {Clock, Users, HeartHandshake, Sparkles} from 'lucide-react'
import {PageLayout} from '@/layouts/PageLayout'
import {jobBenefits, jobProcessSteps, jobsData, type JobBenefit} from './data'
import {JobCard} from './JobCard'
import {ContactCard} from './ContactCard'
import {imagesData} from '@/shared/imagesData'
import {speisekarteFooterLinks} from '@/shared/footerNav'
import './index.css'

const BENEFIT_ICONS: Record<JobBenefit['icon'], typeof Clock> = {
    clock: Clock,
    users: Users,
    'heart-handshake': HeartHandshake,
    sparkles: Sparkles,
}

export function JobsPage() {
    const activeJobs = jobsData.filter(j => j.active)

    return (
        <PageLayout
            subtitle="Jobs"
            showBack
            footerLinks={speisekarteFooterLinks}
        >
            <main className="flex-1">
                {/* ── Hero ─────────────────────────────────────────── */}
                <section className="jobs-hero relative flex flex-col justify-end">
                    <img
                        src={imagesData.wesekeLounge.src}
                        alt={imagesData.wesekeLounge.alt}
                        className="jobs-hero__photo absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="relative z-10 px-6 pb-10 md:pb-14">
                        <div className="jobs-section__inner flex flex-col items-start gap-3">
                            <p className="jobs-hero__eyebrow">Karriere · Weseke &amp; Borken</p>
                            <h1 className="jobs-hero__title">Werde Teil unseres Teams.</h1>
                            <p className="jobs-hero__descriptor">
                                Wir sind ein Familienbetrieb und suchen Menschen, die mit anpacken und
                                unsere Gäste gern glücklich machen.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── Benefits ─────────────────────────────────────── */}
                <section className="jobs-section">
                    <div className="jobs-section__inner">
                        <p className="jobs-eyebrow">Warum Verona</p>
                        <h2 className="jobs-heading">Das erwartet dich bei uns</h2>
                        <div className="jobs-benefits grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                            {jobBenefits.map((benefit) => {
                                const Icon = BENEFIT_ICONS[benefit.icon] ?? Sparkles
                                return (
                                    <div key={benefit.title} className="jobs-benefit">
                                        <Icon size={22} className="jobs-benefit__icon"/>
                                        <p className="jobs-benefit__title">{benefit.title}</p>
                                        <p className="jobs-benefit__text">{benefit.text}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* ── Open positions ───────────────────────────────── */}
                <section className="jobs-section jobs-section--warm">
                    <div className="jobs-section__inner">
                        <p className="jobs-eyebrow">Offene Stellen</p>
                        <h2 className="jobs-heading">
                            {activeJobs.length > 0 ? 'Aktuell gesucht' : 'Aktuell keine offenen Stellen'}
                        </h2>
                        {activeJobs.length === 0 && (
                            <p className="jobs-empty-text">
                                Hier ist nicht immer alles aktuell. Du kannst uns auch gerne einfach direkt fragen.
                            </p>
                        )}
                        <div>
                            {activeJobs.map(job => (
                                <JobCard key={job.id} job={job}/>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Application process ──────────────────────────── */}
                <section className="jobs-section">
                    <div className="jobs-section__inner">
                        <p className="jobs-eyebrow">Bewerbung</p>
                        <h2 className="jobs-heading">So läuft&apos;s ab</h2>
                        <div className="jobs-steps grid gap-8 md:grid-cols-4">
                            {jobProcessSteps.map((step) => (
                                <div key={step.step} className="jobs-step">
                                    <span className="jobs-step__number">
                                        {step.step}
                                        {step.optional && <span className="jobs-step__optional"> · optional</span>}
                                    </span>
                                    <p className="jobs-step__title">{step.title}</p>
                                    <p className="jobs-step__text">{step.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Contact band ─────────────────────────────────── */}
                <ContactCard/>
            </main>
        </PageLayout>
    )
}
