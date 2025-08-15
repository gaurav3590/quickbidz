"use client";

import React from "react";
import {
  EmailIcon,
  PhoneIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
} from "@/components/ui/icons";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
        <p className="text-lg text-center mb-12">
          We're here to help! Have a question, suggestion, or need support?
          Reach out to our friendly team.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <form className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-md border border-input px-3 py-2 focus:border-primary focus:ring-primary"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-md border border-input px-3 py-2 focus:border-primary focus:ring-primary"
                    placeholder="yourname@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium mb-1"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full rounded-md border border-input px-3 py-2 focus:border-primary focus:ring-primary"
                  >
                    <option value="support">Customer Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-1"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full rounded-md border border-input px-3 py-2 focus:border-primary focus:ring-primary"
                    placeholder="How can we help you?"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          <div>
            <div className="bg-muted/10 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">Get In Touch</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mt-1 mr-3">
                    <EmailIcon className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Email Us</h3>
                    <p className="text-sm mt-1">info.quickbidz@gmail.com</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      We'll respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-1 mr-3">
                    <PhoneIcon className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Call Us</h3>
                    <p className="text-sm mt-1">+91 9876543210</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mon-Fri, 9am-5pm
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/10 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Connect With Us</h2>
              <p className="text-sm mb-4">
                Follow us on social media for the latest auction updates, tips,
                and community highlights.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-muted/20 p-2 rounded-full hover:bg-primary/10 transition-colors"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="#"
                  className="bg-muted/20 p-2 rounded-full hover:bg-primary/10 transition-colors"
                >
                  <TwitterIcon />
                </a>
                <a
                  href="#"
                  className="bg-muted/20 p-2 rounded-full hover:bg-primary/10 transition-colors"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="#"
                  className="bg-muted/20 p-2 rounded-full hover:bg-primary/10 transition-colors"
                >
                  <LinkedInIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
