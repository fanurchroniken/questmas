import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Imprint() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-forest-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-cream/70 hover:text-cream transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToHome') || 'Zurück zur Startseite'}</span>
        </Link>

        <div className="bg-cream rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-deep-teal" />
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-forest-dark">
              Impressum
            </h1>
          </div>

          <div className="prose prose-lg max-w-none text-forest-dark/90 font-body">
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-forest-dark mb-4">Angaben gemäß § 5 TMG</h2>
              <p className="mb-4">
                Questmas<br />
                [Ihr Name oder Firmenname]<br />
                [Ihre Straße und Hausnummer]<br />
                [Ihre PLZ und Ort]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-forest-dark mb-4">Kontakt</h2>
              <p className="mb-4">
                Telefon: [Ihre Telefonnummer]<br />
                E-Mail: [Ihre E-Mail-Adresse]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-forest-dark mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
              <p className="mb-4">
                [Ihr Name oder Firmenname]<br />
                [Ihre Straße und Hausnummer]<br />
                [Ihre PLZ und Ort]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-forest-dark mb-4">EU-Streitschlichtung</h2>
              <p className="mb-4">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-deep-teal hover:underline ml-1">
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p className="mb-4">
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-forest-dark mb-4">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
              <p className="mb-4">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-forest-dark mb-4">Haftung für Inhalte</h2>
              <p className="mb-4">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
                allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
                unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach 
                Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
              <p className="mb-4">
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen 
                bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis 
                einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden 
                wir diese Inhalte umgehend entfernen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-forest-dark mb-4">Haftung für Links</h2>
              <p className="mb-4">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
                Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten 
                Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten 
                wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum 
                Zeitpunkt der Verlinkung nicht erkennbar.
              </p>
              <p className="mb-4">
                Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer 
                Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-forest-dark mb-4">Urheberrecht</h2>
              <p className="mb-4">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
                Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
                Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. 
                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
              </p>
              <p className="mb-4">
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter 
                beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine 
                Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von 
                Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

