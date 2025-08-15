"use client";

import React from "react";
import {
  LockIcon,
  FraudDetectionIcon,
  SecurePaymentsIcon,
  MonitoringIcon,
} from "@/components/ui/icons";
import { DateDisplay } from "@/components/ui/DateDisplay";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Privacy & Security
        </h1>
        <p className="text-lg text-center mb-12">
          At QuickBidz, we're committed to protecting your personal information
          and ensuring a secure bidding experience.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Last Updated: <DateDisplay date="2023-05-15" />
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            How We Protect Your Data
          </h2>
          <div className="bg-muted/10 p-6 rounded-lg">
            <p className="mb-4">
              Your privacy and security are our highest priorities. We use
              industry-leading encryption and security protocols to ensure that
              your personal information and transaction data remain safe and
              confidential.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="flex items-start">
                <div className="mt-1 mr-3">
                  <LockIcon className="text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-medium">Secure Encryption</h3>
                  <p className="text-sm mt-1">
                    All data is encrypted using 256-bit TLS/SSL protocols
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mt-1 mr-3">
                  <FraudDetectionIcon className="text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-medium">Fraud Detection</h3>
                  <p className="text-sm mt-1">
                    Advanced systems to identify and prevent suspicious
                    activities
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mt-1 mr-3">
                  <SecurePaymentsIcon className="text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-medium">Secure Payments</h3>
                  <p className="text-sm mt-1">
                    PCI-DSS compliant payment processing
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mt-1 mr-3">
                  <MonitoringIcon className="text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-medium">
                    Continuous Monitoring
                  </h3>
                  <p className="text-sm mt-1">
                    24/7 security monitoring and threat detection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            Information We Collect
          </h2>
          <div className="space-y-6">
            <div className="bg-muted/5 p-5 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Account Information</h3>
              <p className="text-sm">
                When you register for a QuickBidz account, we collect basic
                information such as your name, email address, phone number, and
                shipping address. This information is necessary to create and
                manage your account, communicate with you, and facilitate
                transactions.
              </p>
            </div>
            <div className="bg-muted/5 p-5 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Transaction Data</h3>
              <p className="text-sm">
                We collect information related to your bidding activity,
                purchase history, and payment details. This helps us process
                transactions, resolve disputes, and prevent fraudulent
                activities.
              </p>
            </div>
            <div className="bg-muted/5 p-5 rounded-lg">
              <h3 className="text-lg font-medium mb-2">
                Device and Usage Information
              </h3>
              <p className="text-sm">
                We collect information about your device and how you interact
                with our platform, including IP addresses, browser types,
                operating systems, and browsing behaviors. This data helps us
                improve our services and provide a better user experience.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-3">
            <li>To provide and maintain our bidding platform</li>
            <li>
              To process your transactions and send transaction confirmations
            </li>
            <li>To verify your identity and prevent fraud</li>
            <li>
              To personalize your experience and recommend relevant auctions
            </li>
            <li>
              To communicate with you about your account, auctions, or customer
              support
            </li>
            <li>To improve our platform and develop new features</li>
            <li>
              To comply with legal obligations and enforce our terms of service
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            Your Data Control Rights
          </h2>
          <p className="mb-4">
            We believe that you should have control over your personal
            information. As a QuickBidz user, you have the right to:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted/10 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Access</h3>
              <p className="text-sm">
                Request access to the personal data we hold about you
              </p>
            </div>
            <div className="bg-muted/10 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Correction</h3>
              <p className="text-sm">
                Request corrections to inaccurate or incomplete information
              </p>
            </div>
            <div className="bg-muted/10 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Deletion</h3>
              <p className="text-sm">
                Request deletion of your personal data under certain
                circumstances
              </p>
            </div>
            <div className="bg-muted/10 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Restriction</h3>
              <p className="text-sm">
                Request restrictions on how we process your data
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Contact Us About Privacy
          </h2>
          <p className="mb-6">
            If you have any questions or concerns about our privacy practices,
            please don't hesitate to contact our dedicated privacy team at{" "}
            <span className="text-primary">privacy@quickbidz.com</span> or
            through our
            <a href="/contact" className="text-primary hover:underline ml-1">
              Contact Us
            </a>{" "}
            page.
          </p>
          <div className="bg-primary/5 p-5 rounded-lg">
            <p className="text-sm italic">
              "We're committed to maintaining the highest standards of security
              and privacy. Your trust is our most valuable asset, and we work
              tirelessly to protect your information and provide a secure
              platform for all your auction needs."
            </p>
            <p className="text-right mt-2 text-sm">— QuickBidz Security Team</p>
          </div>
        </section>
      </div>
    </div>
  );
}
