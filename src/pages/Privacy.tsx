import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Privacy() {
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
            <Shield className="w-8 h-8 text-deep-teal" />
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-forest-dark">
              Datenschutzerklärung
            </h1>
          </div>

          <div className="prose prose-lg max-w-none text-forest-dark/90 font-body">
            <p className="text-sm text-forest-dark/70 mb-6">
              <strong>Stand:</strong> {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-forest-dark mb-4">1. Datenschutz auf einen Blick</h2>
              
              <h3 className="text-xl font-heading font-semibold text-forest-dark mb-3 mt-6">Allgemeine Hinweise</h3>
              <p className="mb-4">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, 
                wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
              </p>

              <h3 className="text-xl font-heading font-semibold text-forest-dark mb-3 mt-6">Datenerfassung auf dieser Website</h3>
              <p className="mb-4">
                <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong>
              </p>
              <p className="mb-4">
                Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie 
                dem Abschnitt „Hinweis zur Verantwortlichen Stelle" in dieser Datenschutzerklärung entnehmen.
              </p>

              <p className="mb-4">
                <strong>Wie erfassen wir Ihre Daten?</strong>
              </p>
              <p className="mb-4">
                Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten 
                handeln, die Sie in ein Kontaktformular eingeben.
              </p>
              <p className="mb-4">
                Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. 
                Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). 
                Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.
              </p>

              <p className="mb-4">
                <strong>Wofür nutzen wir Ihre Daten?</strong>
              </p>
              <p className="mb-4">
                Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten 
                können zur Analyse Ihres Nutzerverhaltens verwendet werden.
              </p>

              <p className="mb-4">
                <strong>Welche Rechte haben Sie?</strong>
              </p>
              <p className="mb-4">
                Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten 
                personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. 
                Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft 
                widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer 
                personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-forest-dark mb-4">2. Hosting</h2>
              <p className="mb-4">
                Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, die auf dieser Website 
                erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v. a. um IP-Adressen, Kontaktanfragen, 
                Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine 
                Website generiert werden, handeln.
              </p>
              <p className="mb-4">
                Der Einsatz des Hosters erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren potenziellen und bestehenden Kunden 
                (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen und effizienten Bereitstellung unseres 
                Online-Angebots durch einen professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO). Sofern eine entsprechende Einwilligung 
                abgefragt wurde, erfolgt die Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TTDSG, 
                soweit die Einwilligung die Speicherung von Cookies oder den Zugriff auf Informationen im Endgerät des Nutzers 
                (z. B. Device-Fingerprinting) umfasst. Die Einwilligung ist jederzeit widerrufbar.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-forest-dark mb-4">3. Allgemeine Hinweise und Pflichtinformationen</h2>
              
              <h3 className="text-xl font-heading font-semibold text-forest-dark mb-3 mt-6">Datenschutz</h3>
              <p className="mb-4">
                Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen 
                Daten vertraulich und entsprechend den gesetzlichen Datenschutzbestimmungen sowie dieser Datenschutzerklärung.
              </p>
              <p className="mb-4">
                Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, 
                mit denen Sie persönlich identifiziert werden können. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir 
                erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.
              </p>
              <p className="mb-4">
                Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation per E-Mail) Sicherheitslücken 
                aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.
              </p>

              <h3 className="text-xl font-heading font-semibold text-forest-dark mb-3 mt-6">Hinweis zur verantwortlichen Stelle</h3>
              <p className="mb-4">
                Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
              </p>
              <p className="mb-4">
                Questmas<br />
                [Ihre Adresse]<br />
                [Ihre PLZ und Ort]
              </p>
              <p className="mb-4">
                Telefon: [Ihre Telefonnummer]<br />
                E-Mail: [Ihre E-Mail-Adresse]
              </p>
              <p className="mb-4">
                Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke 
                und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-forest-dark mb-4">4. Datenerfassung auf dieser Website</h2>
              
              <h3 className="text-xl font-heading font-semibold text-forest-dark mb-3 mt-6">Kontaktformular</h3>
              <p className="mb-4">
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der 
                von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns 
                gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
              </p>
              <p className="mb-4">
                Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der 
                Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen 
                übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns 
                gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), sofern 
                diese abgefragt wurde.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-forest-dark mb-4">5. Ihre Rechte</h2>
              <p className="mb-4">
                Sie haben folgende Rechte:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Recht auf Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten (Art. 15 DSGVO)</li>
                <li>Recht auf Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                <li>Recht auf Löschung (Art. 17 DSGVO)</li>
                <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruchsrecht gegen die Verarbeitung (Art. 21 DSGVO)</li>
                <li>Recht auf Widerruf einer erteilten Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
                <li>Beschwerderecht bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

