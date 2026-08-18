import React from 'react';
import './trustedby.css';
import { FaYoutube, FaTwitch, FaDiscord, FaSpotify, FaInstagram } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';

const TrustedBy = () => {
  // Array of logos to easily map and duplicate for the infinite scroll
  const brands = [
    { icon: <FaYoutube className="logo-icon" />, name: "YouTube" },
    { icon: <FaInstagram className="logo-icon" />, name: "Instagram" },
    { icon: <FaTwitch className="logo-icon" />, name: "Twitch" },
    { icon: <FaDiscord className="logo-icon" />, name: "Discord" },
    { icon: <FaSpotify className="logo-icon" />, name: "Spotify" },
    { icon: <SiTiktok className="logo-icon" />, name: "TikTok" }
  ];

  return (
    <section className="trusted-section">
      <div className="trusted-container">
        <p className="trusted-text">
          Trusted by top creators and modern production teams
        </p>
        
        {/* The Marquee Wrapper with faded edges */}
        <div className="marquee-wrapper">
          <div className="marquee-content">
            
            {/* First Set of Logos */}
            {brands.map((brand, index) => (
              <div className="logo-wrapper" key={`first-${index}`}>
                {brand.icon}
                <span>{brand.name}</span>
              </div>
            ))}

            {/* Second Set of Logos (Exactly the same, creates the infinite loop illusion) */}
            {brands.map((brand, index) => (
              <div className="logo-wrapper" key={`second-${index}`}>
                {brand.icon}
                <span>{brand.name}</span>
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;