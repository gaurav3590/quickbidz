"use client";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Terms & Conditions
        </h1>
        <p className="text-lg text-center mb-12">
          Please read these terms and conditions carefully before using
          QuickBidz. By accessing or using our platform, you agree to be bound
          by these terms.
        </p>

        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              1. Account Registration
            </h2>
            <div className="space-y-4">
              <p>
                To use QuickBidz services, you must register for an account. You
                agree to provide accurate, current, and complete information
                during the registration process and to update such information
                to keep it accurate, current, and complete.
              </p>
              <p>
                You are responsible for safeguarding your password and for all
                activities that occur under your account. You agree to notify us
                immediately of any unauthorized use of your account or any other
                breach of security.
              </p>
              <p>
                QuickBidz reserves the right to refuse service, terminate
                accounts, remove or edit content, or cancel orders at our sole
                discretion.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Bidding Rules</h2>
            <div className="space-y-4">
              <p>
                By placing a bid on QuickBidz, you enter into a legally binding
                contract to purchase the item if you are the winning bidder. You
                should bid only if you intend to complete the transaction.
              </p>
              <p>
                All bids are final and cannot be retracted once placed. In
                exceptional circumstances, QuickBidz may, at its sole
                discretion, allow bid retractions if there was a clear error in
                the bid amount.
              </p>
              <p>
                Auction winners are determined by the highest valid bid at the
                time the auction closes. In case of bidding disputes, QuickBidz
                reserves the right to declare the final winning bidder.
              </p>
              <p>
                Shill bidding, bid manipulation, or any form of collusion
                between users to artificially inflate or suppress prices is
                strictly prohibited and may result in permanent account
                termination.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              3. Seller Responsibilities
            </h2>
            <div className="space-y-4">
              <p>
                Sellers must provide accurate and complete descriptions of items
                listed for auction, including any defects, damages, or
                imperfections. Misrepresentation of items may result in
                transaction cancellation and possible suspension of seller
                privileges.
              </p>
              <p>
                Once an auction ends, sellers are obligated to complete the
                transaction with the winning bidder at the final auction price.
                Failure to fulfill this obligation may result in negative
                feedback, removal of selling privileges, or account termination.
              </p>
              <p>
                Sellers are responsible for setting appropriate shipping costs
                and ensuring timely delivery of items to buyers. Sellers should
                communicate any shipping delays to buyers promptly.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              4. Buyer Responsibilities
            </h2>
            <div className="space-y-4">
              <p>
                Buyers are responsible for reading item descriptions carefully
                before placing bids. By placing a bid, buyers acknowledge that
                they have read and understood the item description.
              </p>
              <p>
                Winning bidders must complete the purchase by making payment
                within 3 days of auction end, unless otherwise specified by the
                seller. Failure to make timely payment may result in negative
                feedback, cancellation of the transaction, or suspension of
                bidding privileges.
              </p>
              <p>
                Buyers should communicate any issues with received items to the
                seller within 5 days of delivery. QuickBidz encourages buyers
                and sellers to resolve disputes amicably.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Prohibited Items</h2>
            <div className="space-y-4">
              <p>
                QuickBidz prohibits the listing of illegal items, counterfeit
                products, hazardous materials, weapons, drugs, adult content,
                and items that infringe on intellectual property rights.
              </p>
              <p>
                QuickBidz reserves the right to remove any listings that violate
                our policies or applicable laws. Repeated violations may result
                in account suspension or termination.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              6. Fees and Payments
            </h2>
            <div className="space-y-4">
              <p>
                QuickBidz may charge fees for listing items, successful sales,
                or premium features. All applicable fees will be clearly
                communicated before users incur them.
              </p>
              <p>
                Payment processing is handled securely through our approved
                payment methods. QuickBidz is not responsible for transactions
                conducted outside our platform.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              7. Dispute Resolution
            </h2>
            <div className="space-y-4">
              <p>
                In case of disputes between buyers and sellers, QuickBidz
                provides a dispute resolution process. Both parties agree to
                participate in this process in good faith before seeking
                external remedies.
              </p>
              <p>
                QuickBidz reserves the right to make final decisions on disputes
                based on available evidence and platform policies. Our decisions
                are binding on all parties involved.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              8. Limitation of Liability
            </h2>
            <div className="space-y-4">
              <p>
                QuickBidz provides the platform "as is" without warranties of
                any kind, either express or implied. We do not guarantee
                continuous, uninterrupted access to our services.
              </p>
              <p>
                QuickBidz shall not be liable for any direct, indirect,
                incidental, special, or consequential damages resulting from the
                use or inability to use our services or for the cost of
                procurement of substitute goods and services.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              9. Modifications to Terms
            </h2>
            <div className="space-y-4">
              <p>
                QuickBidz reserves the right to modify these terms and
                conditions at any time. We will notify users of significant
                changes through our platform or via email.
              </p>
              <p>
                Continued use of QuickBidz after such modifications constitutes
                acceptance of the updated terms and conditions.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              10. Contact Information
            </h2>
            <div className="space-y-4">
              <p>
                If you have any questions about these Terms & Conditions, please
                contact us at{" "}
                <span className="text-primary">legal@quickbidz.com</span> or
                through our{" "}
                <a href="/contact" className="text-primary hover:underline">
                  Contact Us
                </a>{" "}
                page.
              </p>
            </div>
          </section>

          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Last updated: July 25, 2023
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
