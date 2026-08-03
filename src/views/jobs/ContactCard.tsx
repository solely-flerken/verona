import {Phone, Mail} from 'lucide-react'
import {jobsContact} from './data'
import {telRef} from '@/shared/telRef.ts'
import './ContactCard.css'

export function ContactCard() {
    return (
        <div className="jobs-contact-card flex flex-col items-center gap-4 text-center">
            <p className="jobs-contact-card__heading">
                Interesse? <span className="jobs-contact-card__accent">Meld dich.</span>
            </p>
            <p className="jobs-contact-card__text">
                Am liebsten ganz unkompliziert. Ein Anruf oder eine kurze Mail genügt. Wir freuen uns, dich
                kennenzulernen.
            </p>
            <div className="jobs-contact-card__actions">
                <a href={telRef(jobsContact.phone)} className="jobs-contact-card__action">
                    <Phone size={15} className="jobs-contact-card__icon shrink-0"/>
                    {jobsContact.phone}
                </a>
                <a href={`mailto:${jobsContact.email}?subject=Bewerbung`} className="jobs-contact-card__action">
                    <Mail size={15} className="jobs-contact-card__icon shrink-0"/>
                    {jobsContact.email}
                </a>
            </div>
        </div>
    )
}
