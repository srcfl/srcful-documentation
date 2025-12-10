import React, { useEffect } from 'react';
import Layout from '@theme/Layout';

export default function CompatibleDevices() {
  useEffect(() => {
    // Get the language from query parameter
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    
    // Map language code to support site locale
    // sv-SE or sv -> 'sv', otherwise default to 'en'
    const locale = lang?.toLowerCase().startsWith('sv') ? 'sv' : 'en';
    
    // Construct the redirect URL
    const redirectUrl = `https://support.sourceful.energy/${locale}/collections/16907838-device-compatability`;
    
    // Perform the redirect
    window.location.href = redirectUrl;
  }, []);

  return (
    <Layout
      title="Compatible Devices"
      description="Redirecting to device compatibility information...">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '20px',
        }}>
        <p>Redirecting to device compatibility information...</p>
      </div>
    </Layout>
  );
}

