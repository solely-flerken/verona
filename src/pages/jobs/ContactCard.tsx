import {Phone, Mail} from 'lucide-react'
import {jobsContact} from './data'
import './ContactCard.css'

export function ContactCard() {
    return (
        <div className="jobs-contact-card">
            <div className="jobs-contact-card__body">
                <p className="jobs-contact-card__heading">
                    Interesse? <span className="jobs-contact-card__accent">Meld dich.</span>
                </p>
                <p className="jobs-contact-card__text">
                    Am liebsten ganz unkompliziert. Ein Anruf oder eine kurze Mail genügt. Wir freuen uns, dich
                    kennenzulernen.
                </p>
            </div>
            <div className="jobs-contact-card__actions">
                <a href={`tel:${jobsContact.phone.replace(/\s/g, '')}`} className="jobs-contact-card__action">
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
