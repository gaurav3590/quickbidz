"use client";

import { UserIcon } from "@/components/ui/icons";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About QuickBidz</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg mb-6">
            At QuickBidz, our mission is to create a vibrant, transparent, and
            secure online marketplace where buyers and sellers can connect
            through the excitement of real-time auctions.
          </p>
          <p className="text-lg mb-6">
            We believe that online bidding should be accessible to everyone,
            combining the thrill of traditional auctions with the convenience of
            digital technology. Our platform is designed to make the process
            fun, fair, and financially rewarding for all participants.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <div className="bg-muted/20 p-6 rounded-lg mb-6">
            <p className="italic">
              "QuickBidz began with a simple idea: create an online auction
              platform that people could trust. We wanted to build something
              that combined cutting-edge technology with old-fashioned values of
              integrity, transparency, and community."
            </p>
            <p className="text-right mt-2">— QuickBidz Founder</p>
          </div>
          <p className="text-lg">
            Founded in 2023, QuickBidz has quickly grown from a small startup to
            a thriving marketplace with thousands of active users. Our team has
            expanded along with our vision, bringing together experts in
            e-commerce, cybersecurity, customer experience, and auction
            management.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "Founder & CEO",
                description:
                  "Alex brings 15 years of e-commerce experience and a passion for creating trust-based online communities.",
              },
              {
                name: "Sarah Chen",
                role: "Head of Technology",
                description:
                  "Sarah leads our development team, ensuring the platform remains secure, scalable, and innovative.",
              },
              {
                name: "Marcus Williams",
                role: "Customer Success",
                description:
                  "Marcus works tirelessly to ensure both buyers and sellers have a seamless experience on QuickBidz.",
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <UserIcon size={64} strokeWidth={1} />
                </div>
                <h3 className="text-xl font-medium">{member.name}</h3>
                <p className="text-primary mb-2">{member.role}</p>
                <p className="text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-muted/10 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">Safe & Secure</h3>
              <p>
                We implement bank-level security measures to protect your data
                and transactions. Our verification process ensures that all
                participants are legitimate, creating a trusted community.
              </p>
            </div>
            <div className="bg-muted/10 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">Transparent & Fair</h3>
              <p>
                All our auction processes are transparent, with clear rules and
                no hidden fees. We actively monitor all listings and bidding to
                ensure fairness for everyone involved.
              </p>
            </div>
            <div className="bg-muted/10 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">Customer-Focused</h3>
              <p>
                Your experience matters to us. Our dedicated support team is
                always ready to help, and we continuously improve our platform
                based on user feedback.
              </p>
            </div>
            <div className="bg-muted/10 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">Community-Driven</h3>
              <p>
                QuickBidz is more than a marketplace—it's a community. We foster
                connections between buyers and sellers, encouraging respectful
                interactions and shared enthusiasm.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
