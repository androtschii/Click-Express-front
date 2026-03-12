import React, { useState } from "react";
import { CELogo } from "./Logo";

interface FooterProps {
  theme?: 'dark' | 'light';
  onCatalogClick?: () => void;
  onAboutClick?: () => void;
  onQuoteClick?: () => void;
}

const FooterLink: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        color: hov ? "#fff" : "rgba(255,255,255,0.3)",
        fontSize: 13,
        marginBottom: 10,
        fontFamily: "'Barlow',sans-serif",
        cursor: onClick ? "pointer" : "default",
        transition: "color 0.15s",
      }}
    >
      {children}
    </div>
  );
};

export const Footer: React.FC<FooterProps> = ({
  onCatalogClick,
  onAboutClick,
  onQuoteClick,
}) => {
  return (
    <footer
      style={{
        background: "#050505",
        borderTop: "3px solid #CC0000",
        padding: "52px clamp(20px,5vw,64px) 28px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 44,
            marginBottom: 44,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
              <CELogo size={46} />
              <div>
                <div
                  style={{
                    fontFamily: "'Oswald',sans-serif",
                    fontWeight: 700,
                    fontSize: 19,
                    color: "#fff",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  <span style={{ color: "#CC0000" }}>CLICK</span> EXPRESS INC
                </div>
                <div
                  style={{
                    fontSize: 8,
                    color: "rgba(255,255,255,0.28)",
                    letterSpacing: 2.5,
                    fontFamily: "'Barlow',sans-serif",
                  }}
                >
                  HEAVY FREIGHT SOLUTIONS
                </div>
              </div>
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.33)",
                fontSize: 13,
                lineHeight: 1.75,
                fontFamily: "'Barlow',sans-serif",
                maxWidth: 270,
              }}
            >
              Our purpose is to empower businesses with uninterrupted performance,
              ensuring stability, reliability, and efficiency.
            </p>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
              <a
                href="tel:+17862026599"
                style={{
                  color: "#CC0000",
                  fontSize: 13,
                  fontFamily: "'Barlow',sans-serif",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                📞 +1 786-202-6599
              </a>
              <a
                href="mailto:clickexpress.inc@gmail.com"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 12,
                  fontFamily: "'Barlow',sans-serif",
                  textDecoration: "none",
                }}
              >
                ✉️ clickexpress.inc@gmail.com
              </a>
              <span
                style={{
                  color: "rgba(255,255,255,0.28)",
                  fontSize: 12,
                  fontFamily: "'Barlow',sans-serif",
                }}
              >
                📍 Hallandale Beach, FL 33009
              </span>
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: "'Oswald',sans-serif",
                fontWeight: 600,
                fontSize: 13,
                color: "#CC0000",
                letterSpacing: 2.5,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Services
            </div>
            {[
              "Full Truckload (FTL)",
              "Partial Loads (LTL)",
              "Flatbed Shipping",
              "Oversized / Heavy",
              "Military Loads",
              "Construction Equip.",
            ].map(i => (
              <FooterLink key={i}>{i}</FooterLink>
            ))}
          </div>

          <div>
            <div
              style={{
                fontFamily: "'Oswald',sans-serif",
                fontWeight: 600,
                fontSize: 13,
                color: "#CC0000",
                letterSpacing: 2.5,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Company
            </div>
            <FooterLink onClick={onAboutClick}>About Us</FooterLink>
            {[
              "Our Fleet",
              "Dispatchers",
              "Careers",
              "Safety Record",
              "Green Card Drivers",
            ].map(i => (
              <FooterLink key={i}>{i}</FooterLink>
            ))}
          </div>

          <div>
            <div
              style={{
                fontFamily: "'Oswald',sans-serif",
                fontWeight: 600,
                fontSize: 13,
                color: "#CC0000",
                letterSpacing: 2.5,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Quick Links
            </div>
            <FooterLink onClick={onCatalogClick}>View Loads</FooterLink>
            <FooterLink onClick={onQuoteClick}>Get a Quote</FooterLink>
            <a
              href="https://www.instagram.com/clickexpress.official"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: 13,
                marginBottom: 10,
                fontFamily: "'Barlow',sans-serif",
                display: "block",
                textDecoration: "none",
              }}
            >
              Instagram
            </a>
            <a
              href="mailto:clickexpress.inc@gmail.com"
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: 13,
                marginBottom: 10,
                fontFamily: "'Barlow',sans-serif",
                display: "block",
                textDecoration: "none",
              }}
            >
              Contact Us
            </a>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.16)",
              fontSize: 12,
              fontFamily: "'Barlow',sans-serif",
            }}
          >
            © 2024 Click Express Inc. All rights reserved. · DOT & FMCSA Licensed Carrier ·
            Hallandale Beach, FL
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.1)",
              fontSize: 11,
              fontFamily: "'Barlow',sans-serif",
            }}
          >
            React · UTM Lab #2
          </p>
        </div>
      </div>
    </footer>
  );
};