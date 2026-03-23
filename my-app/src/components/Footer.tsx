import React, { useState } from "react";
import { CELogo } from "./Logo";
import { PhoneIcon } from "./PhoneIcon";

interface FooterProps {
  theme?: "dark" | "light";
  onCatalogClick?: () => void;
  onAboutClick?: () => void;
  onQuoteClick?: () => void;
  onContactClick?: () => void;
  onCareersClick?: () => void;
}

const FooterLink: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
}> = ({ children, onClick, href, target }) => {
  const [hov, setHov] = useState(false);
  const style: React.CSSProperties = {
    color: hov ? "#CC0000" : "rgba(255,255,255,0.35)",
    fontSize: 13,
    marginBottom: 10,
    fontFamily: "'Barlow',sans-serif",
    cursor: "pointer",
    transition: "color 0.15s",
    display: "block",
    textDecoration: "none",
  };
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel="noreferrer"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={style}
      >
        {children}
      </a>
    );
  }
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

export const Footer: React.FC<FooterProps> = ({
  onCatalogClick,
  onAboutClick,
  onQuoteClick,
  onContactClick,
  onCareersClick,
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
          {/* Brand col */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                marginBottom: 16,
              }}
            >
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
              Our purpose is to empower businesses with uninterrupted
              performance, ensuring stability, reliability, and efficiency.
            </p>
            <div
              style={{
                marginTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <a
                href="tel:+17862026599"
                style={{
                  color: "#CC0000",
                  fontSize: 13,
                  fontFamily: "'Barlow',sans-serif",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <PhoneIcon size={14} color="#CC0000" />
                +1 786-202-6599
              </a>
              <a
                href="mailto:clickexpress.inc@gmail.com"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 12,
                  fontFamily: "'Barlow',sans-serif",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="rgba(255,255,255,0.4)"
                >
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                clickexpress.inc@gmail.com
              </a>
              <span
                style={{
                  color: "rgba(255,255,255,0.28)",
                  fontSize: 12,
                  fontFamily: "'Barlow',sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="rgba(255,255,255,0.28)"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Hallandale Beach, FL 33009
              </span>
            </div>
          </div>

          {/* Services */}
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
            <FooterLink onClick={onCatalogClick}>
              Full Truckload (FTL)
            </FooterLink>
            <FooterLink onClick={onCatalogClick}>
              Partial Loads (LTL)
            </FooterLink>
            <FooterLink onClick={onCatalogClick}>Flatbed Shipping</FooterLink>
            <FooterLink onClick={onCatalogClick}>Oversized / Heavy</FooterLink>
            <FooterLink onClick={onCatalogClick}>Military Loads</FooterLink>
            <FooterLink onClick={onCatalogClick}>
              Construction Equip.
            </FooterLink>
          </div>

          {/* Company */}
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
            <FooterLink onClick={onAboutClick}>Our Fleet</FooterLink>
            <FooterLink onClick={onAboutClick}>Dispatchers</FooterLink>
            <FooterLink onClick={onCareersClick}>Careers</FooterLink>
            <FooterLink onClick={onContactClick}>Safety Record</FooterLink>
            <FooterLink
              href="https://www.instagram.com/clickexpress.official"
              target="_blank"
            >
              Green Card Drivers
            </FooterLink>
          </div>

          {/* Quick Links */}
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
            <FooterLink
              href="https://www.instagram.com/clickexpress.official"
              target="_blank"
            >
              Instagram
            </FooterLink>
            <FooterLink onClick={onContactClick}>Contact Us</FooterLink>
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
            © 2025 Click Express Inc. All rights reserved. · DOT & FMCSA
            Licensed Carrier · Hallandale Beach, FL
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.1)",
              fontSize: 11,
              fontFamily: "'Barlow',sans-serif",
            }}
          >
            React · UTM Lab
          </p>
        </div>
      </div>
    </footer>
  );
};
