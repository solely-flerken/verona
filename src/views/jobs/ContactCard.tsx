import {Phone, Mail} from 'lucide-react'
import {jobsContact} from '@/shared/siteData'
import {telRef} from '@/shared/telRef.ts'
import './ContactCard.css'

export function ContactCard() {
    return (
        <section className="jobs-contact-band">
            <div className="jobs-section__inner flex flex-col items-center gap-4 text-center">
                <h2 className="jobs-contact-band__title">Interesse geweckt? Meld dich einfach.</h2>
                <p className="jobs-contact-band__text">
                    Am liebsten ganz unkompliziert. Ein Anruf oder eine kurze Mail genügt. Wir freuen uns dich kennenzulernen.
                </p>
                <div className="jobs-contact-band__actions">
                    <a href={telRef(jobsContact.phone)} className="jobs-contact-band__cta inline-flex items-center gap-2">
                        <Phone size={17}/>
                        {jobsContact.phone}
                    </a>
                    <a href={`mailto:${jobsContact.email}?subject=Bewerbung`} className="jobs-contact-band__phone inline-flex items-center gap-2">
                        <Mail size={17}/>
                        {jobsContact.email}
                    </a>
                </div>
            </div>
        </section>
    )
}
