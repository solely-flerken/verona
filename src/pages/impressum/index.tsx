import {PageLayout} from '../../layouts/PageLayout'
import {imagesData} from '../../shared/imagesData'
import './index.css'

export function ImpressumPage() {
    return (
        <PageLayout subtitle="Impressum" showBack>
            <main className="flex-1 impressum-page" style={{backgroundImage: `url(${imagesData.wesekeEntry.src})`}}>
                <article className="impressum-content">
                    <div className="impressum-header">
                        <p className="impressum-eyebrow">Rechtliches · Pizzeria Verona</p>
                        <h1 className="impressum-title">Impressum</h1>
                    </div>

                    <section className="impressum__section">
                        <h2 className="impressum__heading">Angaben gemäß § 5 TMG</h2>
                        <p className="impressum__body">
                            Pizzeria Verona Weseke &amp; Borken<br/>
                            Schlückersring 13<br/>
                            46325 Borken
                        </p>
                        <p className="impressum__body">
                            Inhaber: Marek Kaminski
                        </p>
                    </section>

                    <section className="impressum__section">
                        <h2 className="impressum__heading">Kontakt</h2>
                        <p className="impressum__body">
                            Telefon: 02862 3724<br/>
                            E-Mail: info@pizzeria-verona.de
                        </p>
                    </section>

                    <section className="impressum__section">
                        <h2 className="impressum__heading">Umsatzsteuer-Identifikationsnummer</h2>
                        <p className="impressum__body">
                            DE 157284978
                        </p>
                    </section>

                    <section className="impressum__section">
                        <h2 className="impressum__heading">Haftung für Links</h2>
                        <p className="impressum__body">
                            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
                            Einfluss haben. Für diese Inhalte ist stets der jeweilige Betreiber der verlinkten Seite
                            verantwortlich. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist ohne
                            konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
                            Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                        </p>
                    </section>
                </article>
            </main>
        </PageLayout>
    )
}
