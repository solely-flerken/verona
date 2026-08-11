import Link from 'next/link'
import {ArrowLeft} from 'lucide-react'
import {PageLayout} from '@/layouts/PageLayout'
import {imagesData} from '@/shared/imagesData'
import {speisekarteFooterLinks} from '@/shared/footerNav'
import './index.css'

export function NotFoundPage() {
    return (
        <PageLayout subtitle="Seite nicht gefunden" showBack footerLinks={speisekarteFooterLinks}>
            <main className="flex-1 not-found-page" style={{backgroundImage: `url(${imagesData.wesekeLounge.src})`}}>
                <article className="not-found-content">
                    <div className="not-found-content__inner">
                        <div className="not-found-header">
                            <p className="not-found-eyebrow">404 · Pizzeria Verona</p>
                            <h1 className="not-found-title">Seite nicht gefunden</h1>
                        </div>

                        <section className="not-found__section">
                            <h2 className="not-found__heading">Was ist passiert?</h2>
                            <p className="not-found__body">
                                Diese Seite existiert leider nicht mehr oder wurde verschoben.
                            </p>
                            <Link href="/" className="not-found__link inline-flex items-center gap-1.5">
                                <ArrowLeft size={15} strokeWidth={1.75}/>
                                Zurück zur Startseite
                            </Link>
                        </section>
                    </div>
                </article>
            </main>
        </PageLayout>
    )
}
