import { useGlobals } from "@/lib/globals";

export default function PrivacyPolicy() {
  const { businessName, phone, email } = useGlobals();
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
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            This Privacy Policy explains how {businessName} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
            collects, uses, and safeguards information when you interact with our auto transport
            brokerage services, website, digital properties, and Application-to-Person (A2P) 10DLC
            messaging programs. By using our services, you agree to the practices described in this
            policy.
          </p>
        </section>

<section className="space-y-4">
  <h2 className="text-2xl font-semibold">SMS Communications &amp; Consent</h2>
  <p className="text-muted-foreground">
    We may send SMS messages to you when you voluntarily provide your mobile number and choose to
    opt in through our website forms or communication channels. These messages support your shipping
    process by delivering quotes, booking confirmations, transport updates, and customer service
    information.
  </p>

  <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
    <li>
      <span className="font-medium text-foreground">Purpose of SMS messaging:</span>{" "}
      providing quotes, shipment status alerts, customer support responses, and important
      service-related notifications.
    </li>

    <li>
      <span className="font-medium text-foreground">Consent for messages:</span>{" "}
      by opting in, you authorize Abex Transport to send SMS messages to the mobile number you
      provided. Message and data rates may apply, and message frequency may vary depending on your
      requests and active shipments.
    </li>

    <li>
      <span className="font-medium text-foreground">Opt-out instructions:</span>{" "}
      you may opt out of receiving SMS messages at any time by replying <strong>“STOP”</strong> to
      any message. You may receive one additional message confirming your opt-out request. For
      assistance, reply <strong>“HELP”</strong> or contact us through our support page.
    </li>

    <li>
      <span className="font-medium text-foreground">Consent records:</span>{" "}
      to maintain compliance with 10DLC, TCPA, and carrier regulations, we securely store your
      consent status, message history, opt-in time, and any keywords you send (e.g., STOP, HELP).
    </li>

    <li>
      <span className="font-medium text-foreground">No third-party SMS sharing:</span>{" "}
      mobile opt-in, SMS consent, and phone numbers collected specifically for SMS communication
      purposes <strong>will not be shared with any third party or affiliates for marketing
      purposes</strong>. We may only share information as needed to provide core services or comply
      with legal requirements.
    </li>
  </ul>
</section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
          <p className="text-muted-foreground">
            We collect information that you provide directly to us and data that is automatically
            captured through your use of our digital channels.
          </p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Customer &amp; vehicle details:</span>{" "}
              name, email, phone number, pickup and delivery locations, vehicle make, model, and
              condition, preferred shipping dates, and insurance needs.
            </li>
            <li>
              <span className="font-medium text-foreground">Business and compliance data:</span>{" "}
              company name, MC/DOT identifiers, broker agreements, and documentation required for
              transport coordination.
            </li>
            <li>
              <span className="font-medium text-foreground">Payment information:</span> billing
              address and limited payment details processed through PCI-compliant third-party
              providers. We do not store complete credit card numbers on our servers.
            </li>
            <li>
              <span className="font-medium text-foreground">Digital usage data:</span> device
              identifiers, browser type, referral URLs, IP address, and interaction analytics
              collected via cookies, web beacons, and similar technologies.
            </li>
            <li>
              <span className="font-medium text-foreground">Messaging preferences:</span> SMS opt-in
              status, message history, consent records, and any keywords you send (e.g., STOP, HELP)
              for our 10DLC programs.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
          <p className="text-muted-foreground">
            We process personal data to provide safe, efficient auto transport brokerage services and
            to comply with industry and carrier obligations.
          </p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Generate quotes, confirm bookings, and coordinate carriers and drivers.</li>
            <li>
              Send transactional updates and consent-based marketing via voice, email, or SMS (10DLC).
            </li>
            <li>
              Verify identity, prevent fraud, and maintain US Department of Transportation (USDOT) and
              Federal Motor Carrier Safety Administration (FMCSA) compliance.
            </li>
            <li>Improve our website, customer experience, and service offerings.</li>
            <li>Respond to support inquiries and deliver requested materials or documentation.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. A2P 10DLC &amp; SMS Compliance</h2>
          <p className="text-muted-foreground">
            Our text messaging programs comply with CTIA, TCPA, and carrier requirements for
            A2P 10-digit long code messaging. By opting in, you agree to receive messages related to
            quotes, shipment updates, and promotional offers.
          </p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              Message frequency varies and depends on shipment status or engagement. Message and data
              rates may apply.
            </li>
            <li>
              Reply <span className="font-medium text-foreground">STOP</span> to cancel at any time.
              Reply <span className="font-medium text-foreground">HELP</span> for assistance, or
              contact us using the information below.
            </li>
            <li>
              We retain opt-in/opt-out records and maintain approved use cases for 10DLC campaigns.
            </li>
            <li>
              We do not sell SMS data to third parties and share it only with service providers that
              enable compliant message delivery.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Sharing &amp; Disclosure</h2>
          <p className="text-muted-foreground">
            We share personal data only as necessary to fulfill your transport requests or as required
            by law.
          </p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Carriers, drivers, and dispatch partners involved with your shipment.</li>
            <li>
              Technology vendors that provide hosting, analytics, messaging, and payment processing
              under confidentiality obligations.
            </li>
            <li>
              Government regulators and law enforcement when legally required or to protect our
              rights, customers, and carriers.
            </li>
            <li>
              Successors in connection with mergers, acquisitions, financing, or transfer of assets.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Data Retention &amp; Security</h2>
          <p className="text-muted-foreground">
            We retain personal information only as long as needed for the purpose collected, to comply
            with legal obligations, resolve disputes, and enforce our agreements. We implement
            administrative, technical, and physical safeguards designed to protect data from
            unauthorized access, alteration, or misuse.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Your Choices &amp; Rights</h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              Update or correct the personal information you have provided by contacting our support
              team.
            </li>
            <li>
              Opt out of marketing communications by using the unsubscribe link in emails or replying
              STOP to SMS messages.
            </li>
            <li>
              Request access, deletion, or restriction of your personal data as required by applicable
              state privacy laws (including CCPA and state telemarketing statutes).
            </li>
            <li>
              Adjust cookie preferences in your browser. Some features may not function without
              cookies.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Children&apos;s Privacy</h2>
          <p className="text-muted-foreground">
            Our services are not directed to individuals under 18. We do not knowingly collect
            personal information from minors. If we learn that we have received data from a child, we
            will delete it promptly.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy to reflect operational, legal, or regulatory changes.
            When we make material updates, we will revise the effective date and notify you via our
            website or direct communications where required.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Contact Us</h2>
          <p className="text-muted-foreground">
            For privacy questions, data requests, or help with our messaging programs, contact us at:
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
