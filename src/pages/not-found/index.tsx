import {Link} from 'react-router'
import {ArrowLeft} from 'lucide-react'
import {PageLayout} from '../../layouts/PageLayout'
import {imagesData} from '../../shared/imagesData'
import './index.css'

export function NotFoundPage() {
    return (
        <PageLayout subtitle="Seite nicht gefunden" showBack>
            <main className="flex-1 not-found-page" style={{backgroundImage: `url(${imagesData.wesekeLounge.src})`}}>
                <div className="not-found-content">
                    <p className="not-found-eyebrow">404 · Pizzeria Verona</p>
                    <h1 className="not-found-title">Seite nicht gefunden</h1>
                    <p className="not-found-body">Diese Seite existiert leider nicht.</p>
                    <Link to="/" className="gate-header-back inline-flex items-center gap-1.5">
                        <ArrowLeft size={15} strokeWidth={1.75}/>
                        Zurück zur Startseite
                    </Link>
                </div>
            </main>
        </PageLayout>
    )
}
