// src/components/FooterSection.jsx
"use client";

import React from "react";
import Link from "next/link";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function FooterSection() {
  const footerLinks = [
    {
      title: "About Us",
      links: [
        { label: "Job positions", href: "/" },
        { label: "Contact us", href: "/" },
        { label: "Cooperate with us", href: "/" },
      ],
    },
    {
      title: "Guide",
      links: [
        { label: "Site map", href: "/sitemap" },
        { label: "Frequently questions", href: "/faq" },
        { label: "Privacy", href: "/privacy" },
      ],
    },
    {
      title: "Social networks",
      links: [
        { label: "Instagram", href: "https://www.instagram.com/" },
        { label: "Twitter", href: "https://www.x.com/" },
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
      ],
    },
  ];

  const socialIconMap = {
    instagram: FaInstagram,
    twitter: FaTwitter,
    linkedin: FaLinkedin,
  };

  return (
    <div className="footer-section">
      {/* Map Section */}
      <section className="pt-5 text-center">
        <h4>Our Address</h4>
        <br />
        <iframe
          title="Company Location"
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d330.4487474617009!2d51.455177466451595!3d35.80249477081845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfa!2s!4v1729416604001!5m2!1sfa!2s"
          width="100%"
          height="250px"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      {/* Footer Links */}
      <footer className="py-5">
        <div className="container mx-auto grid grid-cols-1 justify-items-center sm:grid-cols-2 sm:justify-items-start md:grid-cols-3 md:justify-items-start gap-6">
          {footerLinks.map((section, idx) => (
            <div key={idx} className="text-justify">
              <h4 className="mt-1 mb-4">{section.title}</h4>
              <nav>
                <ul className="flex flex-col space-y-2">
                  {section.links.map((link, index) => {
                    const lower = link.label.toLowerCase();
                    if (
                      section.title === "Social networks" &&
                      socialIconMap[lower]
                    ) {
                      const Icon = socialIconMap[lower];
                      return (
                        <li key={index}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block hover:scale-110 transition-transform"
                          >
                            <Icon className="text-2xl" />
                          </a>
                        </li>
                      );
                    } else if (link.href.startsWith("http")) {
                      return (
                        <li key={index}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] block hover:font-bold"
                          >
                            {link.label}
                          </a>
                        </li>
                      );
                    } else {
                      return (
                        <li key={index}>
                          <Link
                            href={link.href}
                            className="text-[13px] block hover:font-bold"
                          >
                            {link.label}
                          </Link>
                        </li>
                      );
                    }
                  })}
                </ul>
              </nav>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
