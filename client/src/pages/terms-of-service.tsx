import { useGlobals } from "@/lib/globals";

export default function TermsOfService() {
  const { businessName, phone, email, mcNumber, dotNumber } = useGlobals();
  const effectiveDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <section className="space-y-6">
          <p className="text-sm text-muted-foreground uppercase tracking-widest">
            Effective {effectiveDate}
          </p>
          <h1 className="text-4xl font-bold tracking-tight">Terms &amp; Conditions</h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your use of {businessName}
            &rsquo;s auto transport brokerage services, website, and communication channels,
            including Application-to-Person (A2P) 10-digit long code (10DLC) messaging programs. By
            requesting a quote, booking transport, or engaging with our digital properties, you agree
            to these Terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Brokerage Services</h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              {businessName} operates as a federally licensed transportation broker (FMCSA MC{" "}
              {mcNumber}, USDOT {dotNumber}). We connect shippers with independent motor carriers and
              do not own or operate carrier equipment.
            </li>
            <li>
              Quotes are estimates based on current market conditions and may change until a carrier
              is dispatched. We will notify you of any material adjustments before confirming service.
            </li>
            <li>
              You authorize us to share shipment details with vetted carriers, dispatch services, and
              insurance partners solely for the purpose of arranging transport.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Customer Responsibilities</h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Provide accurate pickup, delivery, and vehicle information when requesting service.</li>
            <li>Ensure vehicles are prepared for transport, meet state/federal regulations, and are operable unless otherwise disclosed.</li>
            <li>
              Remove personal items or secure them within permitted weight limits. Carriers may refuse
              transport if vehicles contain unauthorized cargo.
            </li>
            <li>
              Inspect vehicles at pickup and delivery, noting any exceptions on the bill of lading to
              preserve claims rights.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Payments &amp; Fees</h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              Deposits may be charged when a carrier is assigned. Remaining balances are typically due
              on delivery via certified funds or other carrier-approved payment methods.
            </li>
            <li>
              Cancellations prior to carrier dispatch may be refunded subject to administrative fees.
              After dispatch, cancellations may result in forfeited deposits or dry-run fees.
            </li>
            <li>
              Chargebacks or returned payments may incur additional processing costs and service
              interruptions.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Carrier Performance</h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              We pre-screen carriers for active authority, insurance, and compliance; however, carriers
              remain independent contractors and assume responsibility for shipment execution.
            </li>
            <li>
              Transit timelines are estimates and may be impacted by weather, traffic, inspections, or
              mechanical issues. We are not liable for delays outside our control but will coordinate
              updates and resolutions.
            </li>
            <li>
              Claims for damage must be submitted directly to the carrier&apos;s insurance provider.
              We will assist with documentation as reasonably required.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Digital Communications &amp; 10DLC Messaging</h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              By providing a mobile number, you consent to receive SMS messages related to quotes,
              booking confirmations, dispatch notices, delivery updates, and limited promotional
              offers. Message frequency varies; message and data rates may apply.
            </li>
            <li>
              Our messaging campaigns adhere to TCPA, CTIA, and carrier rules. We maintain verified
              10DLC registrations and consent records for every program.
            </li>
            <li>
              Reply <span className="font-medium text-foreground">STOP</span> to opt out of SMS at any
              time. Reply <span className="font-medium text-foreground">HELP</span> for assistance or
              contact us using the information below.
            </li>
            <li>
              We do not share mobile numbers or messaging data with third parties except vendors that
              enable compliant delivery of our communications.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Website &amp; Digital Use</h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              Content on this site is provided for informational purposes. Quotes obtained online are
              subject to confirmation and do not constitute a binding contract until carrier dispatch.
            </li>
            <li>
              You agree not to misuse our site, attempt unauthorized access, or deploy automated
              tools that interfere with performance.
            </li>
            <li>
              Third-party links are provided for convenience. We are not responsible for external
              content or privacy practices.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Disclaimers &amp; Liability</h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              Services are provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis.
              To the fullest extent permitted by law, we disclaim implied warranties of merchantability
              or fitness for a particular purpose.
            </li>
            <li>
              Our liability is limited to brokerage fees paid by you. We are not liable for indirect,
              incidental, or consequential damages arising from carrier performance or force majeure
              events.
            </li>
            <li>
              Certain jurisdictions may not allow the exclusion of warranties; in such cases, these
              provisions apply only to the extent permitted.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Governing Law &amp; Disputes</h2>
          <p className="text-muted-foreground">
            These Terms are governed by the laws of the state in which {businessName} is registered,
            without regard to conflict-of-law principles. Disputes will be resolved through good-faith
            negotiation. If unresolved, the parties agree to binding arbitration in that state, unless
            prohibited by law. Each party bears its own costs unless the arbitrator awards otherwise.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Changes to These Terms</h2>
          <p className="text-muted-foreground">
            We may modify these Terms to reflect service updates or compliance requirements. When
            changes are material, we will update the effective date and provide notice via our website
            or direct communications where required. Continued use of the services after notice
            constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Contact</h2>
          <p className="text-muted-foreground">
            Questions about these Terms or our 10DLC messaging program? We are here to help.
          </p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Phone:</span> {phone}
            </li>
            <li>
              <span className="font-medium text-foreground">Email:</span> {email}
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
