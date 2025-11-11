const MainContent = () => {
    return (
      <main className="main-content">
        <section className="status-bar">
          <div className="status-item">WhatsApp Business API Status: <span className="status-live">LIVE</span></div>
          <div className="status-item">Quality Rating: <span className="status-high">High</span></div>
          <div className="status-item">Remaining Quota: 250</div>
        </section>
        {/* More sections like QR download, KYC steps, etc. */}
      </main>
    );
  };
  
  export default MainContent;