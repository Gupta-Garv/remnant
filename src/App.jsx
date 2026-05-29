import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Trash2, 
  Layers, 
  Cpu, 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  ChevronRight, 
  Lock, 
  FileText, 
  Maximize2, 
  Download, 
  Check, 
  Calendar,
  X,
  RefreshCw,
  Printer
} from 'lucide-react';

function App() {
  // Navigation & Scroll State
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Time & Coordinates States
  const [currentTime, setCurrentTime] = useState('');
  const [currentCoords, setCurrentCoords] = useState({ lat: '28.6139° N', lng: '77.2090° E' });

  // Section 2: Waste Slider State (Percentage split)
  const [wastePercentage, setWastePercentage] = useState(50);
  const sliderRef = useRef(null);
  const [isSliding, setIsSliding] = useState(false);

  // Section 3: Fabric Decoder State
  const [activeFabric, setActiveFabric] = useState('canvas');
  const fabricData = {
    canvas: {
      name: 'Surplus OD Canvas',
      lot: 'IND-ARMY-OD88',
      origin: 'Ordnance Depot, Kanpur',
      composition: '100% Heavy Cotton Canvas',
      gsm: '450 GSM (Weatherproof)',
      tactile: 'Rough weave, rigid drape, pigment fade properties.',
      declassified: 'Procured from surplus vehicle canvas cover reserves. High tear-resistance, historically used for troop transport shelter halves.',
      image: '/fabric_canvas.png'
    },
    drill: {
      name: 'Deadstock Olive Drill',
      lot: 'DSTK-MIL-DRL92',
      origin: 'Surplus Factory Warehouse, Coimbatore',
      composition: '65% Cotton / 35% Polyester Blend',
      gsm: '320 GSM (Reinforced)',
      tactile: 'Slightly brushed surface, structured drape, clean diagonal weave.',
      declassified: 'Overproduced fabric lot for military field dress contracts. Stored in climate-controlled storage for 6 years before salvage.',
      image: '/fabric_drill.png'
    },
    ripstop: {
      name: 'Surplus Combat Ripstop',
      lot: 'RMNT-RPS-RP77',
      origin: 'Decommissioned Gear Facility, Jabalpur',
      composition: '100% Nylon Grid-Weave',
      gsm: '220 GSM (Ultra-Light)',
      tactile: 'High tensile strength, grid-like microtexture, water-resistant coating.',
      declassified: 'Originally specified for tactical field vests and lightweight parachute harnesses. Repurposed for drop pockets and inner linings.',
      image: '/fabric_ripstop.png'
    }
  };

  // Section 4: Product Spec State
  const [activeProduct, setActiveProduct] = useState('jacket');
  const productSpecs = {
    jacket: {
      name: 'FIELD JACKET',
      tagline: 'Built from decommissioned troop shelter canvas.',
      units: 40,
      materials: 'Surplus Indian Army OD Green Canvas',
      image: '/product_jacket.png',
      bgSize: 'cover',
      bgPosition: 'center',
      specs: [
        { label: 'Raw Hemline', desc: 'Preserves the industrial end-of-roll edge' },
        { label: 'Utility Pockets', desc: 'Dual-depth tactical stowage compartments' },
        { label: 'Embossed Tag', desc: 'No visible branding, just a unique lot ID inside' },
        { label: 'Reinforced Elbows', desc: 'Double-layered canvas stitching' }
      ]
    },
    trousers: {
      name: 'CARGO TROUSERS',
      tagline: 'Six-pocket tactical silhouette with tapered fit.',
      units: 60,
      materials: 'Surplus Combat Ripstop & Olive Drill',
      image: '/product_trousers.png',
      bgSize: 'cover',
      bgPosition: 'center',
      specs: [
        { label: 'Six Pocket Layout', desc: 'Angled side slits and deep button cargos' },
        { label: 'Tapered Fit', desc: 'Adjustable drawstrings at ankles' },
        { label: 'Fabric Lot Stitching', desc: 'Original military production lot tag inside right pocket' },
        { label: 'Gusseted Crotch', desc: 'Engineered for full range of motion' }
      ]
    },
    vest: {
      name: 'UTILITY VEST',
      tagline: 'Asymmetric tactical harness reconstruction.',
      units: 25,
      materials: 'Decommissioned Tactical Vest Panels',
      image: '/product_vest.png',
      bgSize: 'cover',
      bgPosition: 'center',
      specs: [
        { label: 'Asymmetric Shell', desc: 'Deconstructed panels pieced for modern utility' },
        { label: 'Adjustable Straps', desc: 'Tactical webbing straps for modular adjustments' },
        { label: 'Decommissioned Mesh', desc: 'Breathable nylon backing from combat gear' },
        { label: 'Utility Carabiner D-ring', desc: 'Steel attachment point on front chest' }
      ]
    }
  };

  // Section 5: Target Audience Radar state
  const [activeBlip, setActiveBlip] = useState(0);
  const targetProfiles = [
    { title: 'The Deliberate Consumer', age: '18-28', location: 'Metro Cities (Delhi, Mumbai, Bengaluru)', values: 'Anti-Greenwashing, Quality-First, Storyteller', text: 'Tired of brands that perform sustainability without practicing it. They want something built to last that doesn\'t contribute to the 92 million tonnes of annual waste.' },
    { title: 'The Streetwear Purist', age: '20-25', location: 'Urban Hubs', values: 'Artificial Scarcity Reject, Raw Aesthetics, Military Archive', text: 'Draws inspiration from functional clothing. Wants unique archive silhouettes that cannot be duplicated or restocked by fast-fashion giants.' },
    { title: 'The Ethos Collector', age: '22-28', location: 'Pan-India', values: 'Supply Chain Clarity, Raw Material Focus, Anti-Fast-Fashion', text: 'Cares deeply about where materials originate. View the garment as a walking artifact rather than disposable seasonal clothing.' }
  ];

  // Section 7: Live Ledger calculator states
  const [dropsCount, setDropsCount] = useState(4); // default Year 1 Target
  const [averagePrice, setAveragePrice] = useState(48000); // Average price in INR (e.g. 48,000 for luxury surplus streetwear drops)
  const [unitsPerDrop, setUnitsPerDrop] = useState(125); // Target units per drop

  // Section 8: Waitlist State
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistFabric, setWaitlistFabric] = useState('OD Canvas');
  const [enlistedPass, setEnlistedPass] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submission presentation deck overlay state
  const [showBriefcase, setShowBriefcase] = useState(false);
  const [activeSlideTab, setActiveSlideTab] = useState('metadata');
  const [teamMembers, setTeamMembers] = useState([
    { name: 'Garv Gupta', roll: '24120320', email: 'garv.gupta24@iimb.ac.in' },
    { name: 'Garima Bhardwaj', roll: '24120318', email: 'garima.bhardwaj24@iimb.ac.in' },
    { name: 'Reiveeka Wagh', roll: '24120695', email: 'reiveeka.wagh24@iimb.ac.in' },
    { name: 'Rishika Raja', roll: '24120709', email: 'rishika.raja24@iimb.ac.in' },
    { name: 'Chaitanya Saxena', roll: '24120243', email: 'chaitanya.saxena24@iimb.ac.in' },
    { name: 'Prutha Deshpande', roll: '24120668', email: 'prutha.deshpande24@iimb.ac.in' }
  ]);

  // Live time ticker & coordinates wobble
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setCurrentTime(date.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    // Coordinates slight wobble to look like active GPS tracking
    const coordInterval = setInterval(() => {
      const baseLat = 28.6139;
      const baseLng = 77.2090;
      const deltaLat = (Math.random() - 0.5) * 0.002;
      const deltaLng = (Math.random() - 0.5) * 0.002;
      setCurrentCoords({
        lat: `${(baseLat + deltaLat).toFixed(4)}° N`,
        lng: `${(baseLng + deltaLng).toFixed(4)}° E`
      });
    }, 4000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(coordInterval);
    };
  }, []);

  // Handle scroll snap events to update side dots
  const handleScroll = (e) => {
    const container = e.target;
    const height = container.clientHeight;
    const scrollTop = container.scrollTop;
    
    // Active section index calculation
    const index = Math.round(scrollTop / height);
    setActiveSection(prev => {
      if (prev !== index) return index;
      return prev;
    });

    // Overall scroll progress calculation
    const totalHeight = container.scrollHeight - height;
    const progress = Math.round((scrollTop / totalHeight) * 100);
    setScrollProgress(prev => {
      if (prev !== progress) return progress;
      return prev;
    });
  };

  // Section 2: Split screen slider mouse actions
  const handleWasteSliderMove = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setWastePercentage(percentage);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleWasteSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseDown = () => setIsSliding(true);
  const handleMouseUp = () => setIsSliding(false);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isSliding) {
        handleWasteSliderMove(e.clientX);
      }
    };
    const handleGlobalMouseUp = () => {
      setIsSliding(false);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isSliding]);

  // Waitlist generation logic
  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (!waitlistName || !waitlistEmail) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const serialHash = Math.floor(1000 + Math.random() * 9000);
      setEnlistedPass({
        name: waitlistName.toUpperCase(),
        email: waitlistEmail.toLowerCase(),
        fabric: waitlistFabric,
        serial: `RMNT-001-${serialHash}`,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }),
        status: 'ENLISTED FOR ACTIVE MISSION DROP'
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleResetWaitlist = () => {
    setEnlistedPass(null);
    setWaitlistName('');
    setWaitlistEmail('');
  };

  // Print waitlist badge logic
  const handlePrintBadge = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>REMNANT — Mission Enlistment Pass</title>
          <style>
            body { font-family: monospace; background: #FFF; padding: 40px; text-align: center; }
            .pass { border: 4px solid #1B1D1C; padding: 30px; display: inline-block; text-align: left; background: #FAF9F6; max-width: 500px; }
            .header { border-bottom: 2px dashed #1B1D1C; padding-bottom: 15px; margin-bottom: 15px; font-weight: bold; }
            .barcode { font-size: 24px; letter-spacing: -2px; margin-top: 20px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="pass">
            <div class="header">REMNANT // MISSION PASS 001</div>
            <div><strong>SERIAL:</strong> ${enlistedPass.serial}</div>
            <div><strong>RECIPIENT:</strong> ${enlistedPass.name}</div>
            <div><strong>EMAIL:</strong> ${enlistedPass.email}</div>
            <div><strong>FABRIC RESERVED:</strong> ${enlistedPass.fabric}</div>
            <div><strong>ENLISTMENT DATE:</strong> ${enlistedPass.date}</div>
            <div><strong>STATUS:</strong> APPROVED FOR ACCESS</div>
            <div class="barcode">|||| | ||||| | || |||| | | |||</div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Scroll to a specific section helper
  const scrollToSection = (index) => {
    const container = document.getElementById('scroll-container-element');
    if (container) {
      container.scrollTop = index * container.clientHeight;
    }
  };

  return (
    <div className="main-container tactical-grid-bg">
      {/* Side Dot Navigation */}
      <nav className="dot-navigation" aria-label="Section Navigation">
        {[...Array(8)].map((_, index) => (
          <button
            key={index}
            className={`dot-nav-item ${activeSection === index ? 'active' : ''}`}
            onClick={() => scrollToSection(index)}
            aria-label={`Go to section ${index + 1}`}
          >
            <span className="dot-nav-label">
              {['Hero Brief', 'The Waste Problem', 'The Concept', 'Drop 001 Blueprints', 'Target Audience', 'Why REMNANT', 'Market Ledger', 'Waitlist Terminal'][index]}
            </span>
          </button>
        ))}
      </nav>

      {/* Sticky Bottom Status Bar */}
      <footer className="tactical-status-bar">
        <div>REMNANT // DECLASSIFIED PILOT MISSION // DROP 001</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>GPS: {currentCoords.lat} {currentCoords.lng}</span>
          <span>TIME: {currentTime}</span>
          <span>PROGRESS: {scrollProgress}%</span>
        </div>
      </footer>

      {/* Scrollable Main Container */}
      <div 
        id="scroll-container-element" 
        className="scroll-container" 
        onScroll={handleScroll}
      >

        {/* SECTION 1: HERO */}
        <section className="scroll-section" id="hero-section">
          <header className="section-header">
            <div>
              <span className="font-mono text-orange" style={{ display: 'block' }}>PROTOCOL: STARTUP_INIT</span>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-gray)', display: 'block', marginTop: '2px' }}>[LATITUDE_TRACKER: ACTIVE]</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="coordinates-tag" style={{ display: 'inline-block' }}>{currentCoords.lat} / {currentCoords.lng}</span>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-gray)', display: 'block', marginTop: '4px' }}>[REMNANT_SYS_LOG_V1]</span>
            </div>
          </header>

          <div className="section-body">
            <div className="hero-content">
              <div className="hero-title-container">
                <h1 className="font-heading hero-title">
                  REMNANT
                  <span className="stencil-text hero-stencil">EST. 2026</span>
                </h1>
              </div>

              <h2 className="hero-tagline font-heading text-orange">"Wear what's left."</h2>
              
              <p className="hero-subline">
                Built from the abandoned. Worn by the deliberate.
              </p>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button 
                  className="btn-tactical btn-orange" 
                  onClick={() => scrollToSection(7)}
                >
                  <Compass size={18} /> Join Waitlist
                </button>
                <button 
                  className="btn-tactical btn-secondary" 
                  onClick={() => scrollToSection(1)}
                >
                  Briefing File <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <footer className="section-footer">
            <span className="font-mono">[MISSION DROP: DIRECT-TO-CONSUMER ONLINE]</span>
            <span className="font-mono">SCROLL_DOWN_TO_ENTER</span>
          </footer>
        </section>


        {/* SECTION 2: THE PROBLEM */}
        <section className="scroll-section" id="problem-section">
          <header className="section-header">
            <div>
              <span className="font-mono text-orange" style={{ display: 'block' }}>PROTOCOL: RESOURCE_INVENTORY_WASTE</span>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-gray)', display: 'block', marginTop: '2px' }}>[INVENTORY_MONITOR: ACTIVE]</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="font-mono" style={{ display: 'block', fontWeight: 'bold' }}>CODE: WASTE_REPORT</span>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-gray)', display: 'block', marginTop: '2px' }}>[92M TONNES ANNUALLY]</span>
            </div>
          </header>

          <div className="section-body">
            <div className="problem-grid">
              <div className="problem-text">
                <h2 className="font-heading problem-h2">The Fast Fashion Graveyard</h2>
                <p className="problem-desc">
                  The fast fashion industry produces <strong>92 million tonnes</strong> of textile waste every single year. 
                  Factories overproduce. Excess surplus sits in warehouses and eventually gets incinerated or dumped. 
                  Meanwhile, military contracts leave behind thousands of metres of high-performance fabric with nowhere to go.
                </p>
                
                <div className="problem-stat-box">
                  <div className="problem-stat-num">92M</div>
                  <div className="problem-stat-label">Tonnes of Textile Waste Produced Annually</div>
                </div>
              </div>

              {/* Interactive Waste Split Screen Slider */}
              <div 
                ref={sliderRef}
                className="waste-slider-container"
                onMouseMove={(e) => isSliding && handleWasteSliderMove(e.clientX)}
                onTouchMove={handleTouchMove}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
                style={{ cursor: isSliding ? 'ew-resize' : 'default' }}
              >
                {/* Clean Military fabric display */}
                <div className="waste-slide waste-slide-clean">
                  <div className="slide-content-overlay">
                    <span className="font-mono" style={{ fontSize: '12px', background: 'rgba(27,29,28,0.7)', padding: '4px 8px', borderRadius: '2px' }}>
                      TACTICAL MATERIAL: UNUSED MILITARY DEADSTOCK
                    </span>
                    <h3 className="font-heading" style={{ fontSize: '24px', marginTop: '10px' }}>PREMIUM SURPLUS</h3>
                    <p style={{ fontSize: '13px', marginTop: '5px' }}>Durable, flame-resistant canvas and high-tensile ripstop grid weave.</p>
                  </div>
                </div>

                {/* Landfill waste display overlay */}
                <div 
                  className="waste-slide waste-slide-waste"
                  style={{ clipPath: `polygon(${wastePercentage}% 0, 100% 0, 100% 100%, ${wastePercentage}% 100%)` }}
                >
                  <div className="slide-content-overlay" style={{ marginLeft: `${wastePercentage > 50 ? '20%' : '5%'}` }}>
                    <span className="font-mono" style={{ fontSize: '12px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '2px' }}>
                      LANDFILL SITES: 92,000,000 TONNES DUMPED
                    </span>
                    <h3 className="font-heading" style={{ fontSize: '24px', marginTop: '10px' }}>WASTED POTENTIAL</h3>
                    <p style={{ fontSize: '13px', marginTop: '5px' }}>High quality military fabric left to rot in warehouses or incinerated.</p>
                  </div>
                </div>

                {/* Divider slider bar */}
                <div 
                  className="waste-slider-divider"
                  style={{ left: `${wastePercentage}%` }}
                />
              </div>
            </div>
          </div>

          <footer className="section-footer">
            <span className="font-mono">DRAG THE CENTER SLIDER TO SCAN CONTRAST</span>
            <span className="font-mono">SECTION 02 / 08</span>
          </footer>
        </section>


        {/* SECTION 3: THE CONCEPT */}
        <section className="scroll-section" id="concept-section">
          <header className="section-header">
            <div>
              <span className="font-mono text-orange" style={{ display: 'block' }}>PROTOCOL: THE_RECONSTRUCTION</span>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-gray)', display: 'block', marginTop: '2px' }}>[UPCYCLING_METHODOLOGY: VERIFIED]</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="font-mono" style={{ display: 'block', fontWeight: 'bold' }}>MISSION DECRYPT</span>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-gray)', display: 'block', marginTop: '2px' }}>[DROP_RUN: FINITE]</span>
            </div>
          </header>

          <div className="section-body">
            <div className="concept-grid">
              <div className="concept-text">
                <h2 className="font-heading problem-h2">Anti-Fast-Fashion. Without the Preach.</h2>
                <p className="problem-desc" style={{ marginBottom: '15px' }}>
                  REMNANT takes military deadstock canvas, olive drill, and decommissioned ripstop, converting them into limited streetwear drops.
                </p>
                <p style={{ color: 'var(--color-gray)', fontSize: '16px' }}>
                  We don't preach sustainability; we simply choose not to participate in the overproduction cycle. Each drop is a <strong>Mission</strong>, limited strictly by the fabric we salvage. No restocks, no overruns, no artificial scarcity.
                </p>

                <div className="concept-steps">
                  <div className="concept-step">
                    <span className="concept-step-num">01</span>
                    <div className="concept-step-text">
                      <strong>Salvage:</strong> Intercept military surplus lots before they are destroyed or forgotten.
                    </div>
                  </div>
                  <div className="concept-step">
                    <span className="concept-step-num">02</span>
                    <div className="concept-step-text">
                      <strong>Deconstruct:</strong> Disassemble original utility frames, transport covers, and panels.
                    </div>
                  </div>
                  <div className="concept-step">
                    <span className="concept-step-num">03</span>
                    <div className="concept-step-text">
                      <strong>Reconstruct:</strong> Build limited, serialized tactical wear items for drops.
                    </div>
                  </div>
                </div>
              </div>

              {/* Fabric lot decrypter interactive component */}
              <div className="fabric-decoder-box">
                <h3 className="font-heading" style={{ fontSize: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} className="text-orange" /> Fabric Spec Decrypter
                </h3>
                
                <div className="fabric-tabs">
                  <button 
                    className={`fabric-tab-btn ${activeFabric === 'canvas' ? 'active' : ''}`}
                    onClick={() => setActiveFabric('canvas')}
                  >
                    Army Canvas
                  </button>
                  <button 
                    className={`fabric-tab-btn ${activeFabric === 'drill' ? 'active' : ''}`}
                    onClick={() => setActiveFabric('drill')}
                  >
                    Olive Drill
                  </button>
                  <button 
                    className={`fabric-tab-btn ${activeFabric === 'ripstop' ? 'active' : ''}`}
                    onClick={() => setActiveFabric('ripstop')}
                  >
                    Combat Ripstop
                  </button>
                </div>

                <div className="fabric-preview-display">
                  <div 
                    className="fabric-bg-photo" 
                    style={{ backgroundImage: `url(${fabricData[activeFabric].image})` }} 
                  />
                  <div className="fabric-bg-overlay" />
                  <span className="fabric-stamp">{fabricData[activeFabric].lot.split('-')[1]}</span>
                  <div className="fabric-texture-layer"></div>
                  <div className="fabric-preview-content">
                    <div className="font-mono text-orange" style={{ fontSize: '12px' }}>[LOT SPECIFICATION ACTIVE]</div>
                    <div className="font-heading" style={{ fontSize: '24px', margin: '5px 0', color: 'var(--bg-card)' }}>{fabricData[activeFabric].name}</div>
                    <div className="font-mono" style={{ fontSize: '13px', background: 'rgba(255,255,255,0.15)', color: 'var(--bg-card)', padding: '2px 8px', display: 'inline-block' }}>
                      SOURCE ID: {fabricData[activeFabric].origin}
                    </div>
                  </div>
                </div>

                <div className="fabric-meta-specs">
                  <div className="spec-item"><span className="spec-label">Lot Code</span> <span className="spec-value">{fabricData[activeFabric].lot}</span></div>
                  <div className="spec-item"><span className="spec-label">Composition</span> <span className="spec-value">{fabricData[activeFabric].composition}</span></div>
                  <div className="spec-item"><span className="spec-label">Weight</span> <span className="spec-value">{fabricData[activeFabric].gsm}</span></div>
                  <div className="spec-item"><span className="spec-label">Tactile Vibe</span> <span className="spec-value" style={{ float: 'none', display: 'block', marginTop: '4px', color: 'var(--color-charcoal)', fontWeight: 'normal' }}>{fabricData[activeFabric].tactile}</span></div>
                </div>

                <div className="font-mono text-olive" style={{ fontSize: '11px', marginTop: '12px', borderTop: '1px dashed var(--color-light-gray)', paddingTop: '8px' }}>
                  * LOG: {fabricData[activeFabric].declassified}
                </div>
              </div>
            </div>
          </div>

          <footer className="section-footer">
            <span className="font-mono">SELECT TABS TO DECRYPT SALVAGE DATA</span>
            <span className="font-mono">SECTION 03 / 08</span>
          </footer>
        </section>


        {/* SECTION 4: THE PRODUCT */}
        <section className="scroll-section" id="product-section">
          <header className="section-header">
            <div>
              <span className="font-mono text-orange" style={{ display: 'block' }}>PROTOCOL: DROP_001_BLUEPRINTS</span>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-gray)', display: 'block', marginTop: '2px' }}>[GARMENT_SCHEMATIC: ACTIVE]</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="font-mono" style={{ display: 'block', fontWeight: 'bold' }}>MANIFEST CODES</span>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-gray)', display: 'block', marginTop: '2px' }}>[MODEL_LOGS: DECLASSIFIED]</span>
            </div>
          </header>

          <div className="section-body">
            <div className="product-showcase">
              {/* Product interactive blueprint viewer */}
              <div className="product-blueprint-viewer">
                <div 
                  className="blueprint-bg-photo" 
                  style={{ 
                    backgroundImage: `url(${productSpecs[activeProduct].image})`,
                    backgroundSize: productSpecs[activeProduct].bgSize,
                    backgroundPosition: productSpecs[activeProduct].bgPosition
                  }} 
                />
                <div className="blueprint-item-name">{productSpecs[activeProduct].name}</div>
                <div className="blueprint-units-badge">{productSpecs[activeProduct].units} UNITS ONLY</div>
              </div>

              {/* Product selector checklist */}
              <div className="product-selector-list">
                <h3 className="font-heading" style={{ fontSize: '24px', marginBottom: '10px' }}>Drop 001: The Manifest</h3>
                <p style={{ color: 'var(--color-gray)', fontSize: '15px', marginBottom: '20px' }}>
                  Select a product below to preview the limited edition reconstructed silhouette and materials.
                </p>

                {Object.keys(productSpecs).map((key) => (
                  <div
                    key={key}
                    className={`product-selector-card ${activeProduct === key ? 'active' : ''}`}
                    onClick={() => setActiveProduct(key)}
                  >
                    <div className="product-card-title">{productSpecs[key].name}</div>
                    <div className="product-card-desc">{productSpecs[key].tagline}</div>
                    <div className="font-mono text-orange" style={{ fontSize: '11px', marginTop: '8px' }}>
                      FABRIC: {productSpecs[key].materials} // BATCH SIZE: {productSpecs[key].units} units
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <footer className="section-footer">
            <span className="font-mono">CLICK PRODUCT CARDS TO TRIGGER SCHEMATIC BLUEPRINT DRAWING</span>
            <span className="font-mono">SECTION 04 / 08</span>
          </footer>
        </section>


        {/* SECTION 5: WHO IT'S FOR */}
        <section className="scroll-section" id="audience-section">
          <header className="section-header">
            <div>
              <span className="font-mono text-orange" style={{ display: 'block' }}>PROTOCOL: TARGET_PROFILING</span>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-gray)', display: 'block', marginTop: '2px' }}>[SWEEPING_USER_CHANNELS]</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="font-mono" style={{ display: 'block', fontWeight: 'bold' }}>RADAR SCAN</span>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-gray)', display: 'block', marginTop: '2px' }}>[INDIA_YOUTH_METRICS]</span>
            </div>
          </header>

          <div className="section-body">
            <div className="audience-grid">
              <div className="audience-text">
                <h2 className="font-heading problem-h2">Target Coordinates</h2>
                <p className="problem-desc">
                  REMNANT is built for urban youth who value deliberate consumption. We aren't making disposable clothes for the masses; we are building artifacts for individuals who care about origins.
                </p>

                <div className="audience-list">
                  {targetProfiles.map((profile, index) => (
                    <div 
                      key={index}
                      className="audience-item"
                      style={{ 
                        borderColor: activeBlip === index ? 'var(--accent-orange)' : 'var(--color-light-gray)',
                        background: activeBlip === index ? 'var(--bg-card)' : 'rgba(255,255,255,0.2)',
                        cursor: 'pointer'
                      }}
                      onClick={() => setActiveBlip(index)}
                    >
                      <div className="audience-icon">
                        <Users size={18} className={activeBlip === index ? 'text-orange' : ''} />
                      </div>
                      <div>
                        <div className="font-mono" style={{ fontSize: '11px', color: 'var(--color-gray)' }}>
                          PROFILE {index + 1}: {profile.age} // {profile.location}
                        </div>
                        <h4 className="font-heading" style={{ fontSize: '16px' }}>{profile.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radar scanner visualization */}
              <div className="audience-radar-wrapper">
                <div className="radar-ring radar-ring-1"></div>
                <div className="radar-ring radar-ring-2"></div>
                <div className="radar-ring radar-ring-3"></div>
                
                {/* Rotating radar sweep */}
                <div className="radar-sweep"></div>

                {/* Concentric Spider Web Grid & Plotted Metrics Polygon */}
                <svg viewBox="0 0 100 100" className="radar-spider-svg">
                  {/* Outer Grid lines */}
                  <polygon points="50,10 88,37.6 73.5,82.4 26.5,82.4 12,37.6" className="spider-grid-line" />
                  <polygon points="50,20 78.5,40.7 67.6,74.3 32.4,74.3 21.5,40.7" className="spider-grid-line" />
                  <polygon points="50,30 69,43.8 61.8,66.2 38.2,66.2 31,43.8" className="spider-grid-line" />
                  <polygon points="50,40 59.5,46.9 55.9,58.1 44.1,58.1 40.5,46.9" className="spider-grid-line" />
                  
                  {/* Axis lines from center to outer points */}
                  <line x1="50" y1="50" x2="50" y2="10" className="spider-axis-line" />
                  <line x1="50" y1="50" x2="88" y2="37.6" className="spider-axis-line" />
                  <line x1="50" y1="50" x2="73.5" y2="82.4" className="spider-axis-line" />
                  <line x1="50" y1="50" x2="26.5" y2="82.4" className="spider-axis-line" />
                  <line x1="50" y1="50" x2="12" y2="37.6" className="spider-axis-line" />
                  
                  {/* Text labels for axes */}
                  <text x="50" y="8" className="spider-label-text" textAnchor="middle">SUSTAINABILITY</text>
                  <text x="92" y="36" className="spider-label-text" textAnchor="start">AESTHETIC</text>
                  <text x="76" y="86" className="spider-label-text" textAnchor="start">UTILITY</text>
                  <text x="24" y="86" className="spider-label-text" textAnchor="end">VALUE</text>
                  <text x="8" y="36" className="spider-label-text" textAnchor="end">HERITAGE</text>
                  
                  {/* The active profile polygon */}
                  <polygon 
                    points={
                      activeBlip === 0 ? "50,14 74.7,42.0 70.0,77.5 39.4,64.6 29.1,43.2" :
                      activeBlip === 1 ? "50,28 86.1,38.3 66.5,72.7 41.8,61.3 17.7,39.5" :
                      "50,16 72.8,42.6 62.9,67.8 40.6,62.9 13.9,38.3"
                    } 
                    className="spider-active-polygon" 
                  />
                </svg>

                {/* Radar target pins (blips) */}
                <div 
                  className={`radar-blip ${activeBlip === 0 ? 'active' : ''}`} 
                  style={{ top: '12%', left: '48.5%' }}
                  onClick={() => setActiveBlip(0)}
                >
                  <div className="radar-blip-pulse"></div>
                  <span className="blip-number">01</span>
                </div>
                <div 
                  className={`radar-blip ${activeBlip === 1 ? 'active' : ''}`} 
                  style={{ top: '35%', left: '86.5%' }}
                  onClick={() => setActiveBlip(1)}
                >
                  <div className="radar-blip-pulse"></div>
                  <span className="blip-number">02</span>
                </div>
                <div 
                  className={`radar-blip ${activeBlip === 2 ? 'active' : ''}`} 
                  style={{ top: '35%', left: '10.5%' }}
                  onClick={() => setActiveBlip(2)}
                >
                  <div className="radar-blip-pulse"></div>
                  <span className="blip-number">03</span>
                </div>

                {/* HUD Data display cards */}
                <div className="radar-card-popup">
                  <div className="font-mono text-orange" style={{ borderBottom: '1px solid var(--accent-orange)', paddingBottom: '4px', marginBottom: '8px' }}>
                    TRACKING DATA: {targetProfiles[activeBlip].title}
                  </div>
                  <div><strong>VALUES:</strong> {targetProfiles[activeBlip].values}</div>
                  <div style={{ marginTop: '5px', fontSize: '12px', color: 'var(--bg-coyote)' }}>
                    {targetProfiles[activeBlip].text}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="section-footer">
            <span className="font-mono">RADAR SCREEN TRACKS CORE USER VECTORS</span>
            <span className="font-mono">SECTION 05 / 08</span>
          </footer>
        </section>

        {/* SECTION 6: WHY REMNANT */}
        <section className="scroll-section" id="why-section">
          <header className="section-header">
            <div>
              <span className="font-mono text-orange" style={{ display: 'block' }}>PROTOCOL: COMPETITIVE_ADVANTAGE</span>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-gray)', display: 'block', marginTop: '2px' }}>[MANIFESTO: STENCIL_PRINTED]</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="font-mono" style={{ display: 'block', fontWeight: 'bold' }}>WHY_REMNANT</span>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-gray)', display: 'block', marginTop: '2px' }}>[DASH_LOG_06]</span>
            </div>
          </header>

          <div className="section-body">
            <div className="why-grid">
              <div className="why-column">
                <h2 className="font-heading problem-h2" style={{ marginBottom: '25px' }}>The Tactical Differentiators</h2>
                
                <div className="why-items-manifest">
                  <div className="why-item">
                    <div className="why-item-title">
                      <span>01 / ZERO NEW FABRIC</span>
                      <ShieldCheck size={16} className="text-orange" />
                    </div>
                    <div className="why-item-desc">
                      Every piece is built entirely from existing surplus or deadstock military canvas. Zero virgin polyester or cotton produced.
                    </div>
                  </div>

                  <div className="why-item">
                    <div className="why-item-title">
                      <span>02 / MATERIAL SCARCITY</span>
                      <ShieldCheck size={16} className="text-orange" />
                    </div>
                    <div className="why-item-desc">
                      Our run quantities are dictated strictly by the fabrics we intercept. Scarcity is built into our supply chain, not marketed.
                    </div>
                  </div>

                  <div className="why-item">
                    <div className="why-item-title">
                      <span>03 / ARTIFACT UNIQUENESS</span>
                      <ShieldCheck size={16} className="text-orange" />
                    </div>
                    <div className="why-item-desc">
                      Due to fabric lots, sun-bleach variations, and repairs, no two garments in a mission series are completely identical.
                    </div>
                  </div>
                </div>
              </div>

              {/* Manifesto placard */}
              <div className="manifesto-panel">
                <div>
                  <div className="manifesto-header">
                    <span>REMNANT ARCHIVAL DOCUMENT LOG</span>
                    <span style={{ float: 'right' }}>SYS-088-RMNT</span>
                  </div>
                  
                  <div className="manifesto-body">
                    We do not participate in fast fashion cycles. We do not manufacture synthetic feelings or artificial trends. 
                    REMNANT represents the utility of what exists. India has plenty of elite materials lying forgotten in storage vaults. 
                    We classify these vaults, retrieve the canvas, and design armor for the urban survivor. 
                    The supply chain itself is the garment's design.
                  </div>
                </div>

                <div className="manifesto-footer">
                  <div>* CODENAME: "Wear what's left."</div>
                  <div>* DECLASSIFIED FOR: Young Streetwear Segment, India</div>
                </div>
              </div>
            </div>
          </div>

          <footer className="section-footer">
            <span className="font-mono">NO GREENWASHING // TRUTHS ONLY</span>
            <span className="font-mono">SECTION 06 / 08</span>
          </footer>
        </section>


        {/* SECTION 7: MARKET & VISION */}
        <section className="scroll-section" id="market-section">
          <header className="section-header">
            <div>
              <span className="font-mono text-orange" style={{ display: 'block' }}>PROTOCOL: FISCAL_LEDGER_PROJECTIONS</span>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-gray)', display: 'block', marginTop: '2px' }}>[PROJECTED_RUNS: SCALABLE]</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="font-mono" style={{ display: 'block', fontWeight: 'bold' }}>MARKET ANALYSIS</span>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-gray)', display: 'block', marginTop: '2px' }}>[INR_CRORES_INDEX]</span>
            </div>
          </header>

          <div className="section-body">
            <div className="market-grid">
              <div className="market-text">
                <h2 className="font-heading problem-h2">Fiscal Blueprint & Projections</h2>
                <p className="problem-desc" style={{ marginBottom: '20px' }}>
                  The Indian streetwear segment is valued at <strong>$400 Million</strong>, growing at 18% annually. The global sustainable fashion domain stands at <strong>$9.8 Billion</strong>. We sit at their intersection.
                </p>

                <div className="market-stats-container">
                  <div className="market-stat-card">
                    <div className="market-stat-title">Streetwear Market (IN)</div>
                    <div className="market-stat-value">$400M</div>
                    <div className="font-mono text-orange" style={{ fontSize: '11px', marginTop: '5px' }}>+18% Annual growth</div>
                  </div>
                  <div className="market-stat-card">
                    <div className="market-stat-title">Sustainable Fashion (GL)</div>
                    <div className="market-stat-value">$9.8B</div>
                    <div className="font-mono text-orange" style={{ fontSize: '11px', marginTop: '5px' }}>Premium Segment</div>
                  </div>
                </div>
              </div>

              {/* Dynamic projections calculator ledger */}
              <div className="market-ledger-box">
                <h3 className="font-heading" style={{ fontSize: '16px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} className="text-orange" /> Year 1 Projection Ledger
                </h3>

                <div className="ledger-row">
                  <span>SALVAGED DROPS (MISSIONS)</span>
                  <span className="text-orange">{dropsCount} / year</span>
                </div>
                <div className="ledger-row">
                  <span>UNITS PER MISSION DROP</span>
                  <span className="text-orange">{unitsPerDrop} units</span>
                </div>
                <div className="ledger-row">
                  <span>AVG GARMENT PRICE</span>
                  <span className="text-orange">₹{(averagePrice).toLocaleString('en-IN')}</span>
                </div>
                <div className="ledger-row">
                  <span>TOTAL SALES VOLUME</span>
                  <span className="text-orange">{(dropsCount * unitsPerDrop)} Garments</span>
                </div>
                
                <div className="ledger-total">
                  <span>PROJECTED REVENUE (GROSS)</span>
                  <span style={{ float: 'right' }}>₹{((dropsCount * unitsPerDrop * averagePrice) / 10000000).toFixed(2)} Crores</span>
                </div>

                {/* Ledger sliders */}
                <div className="ledger-slider-container">
                  <div className="ledger-slider-header">
                    <span>Missions per Year: {dropsCount}</span>
                  </div>
                  <input 
                    type="range" 
                    min="2" 
                    max="6" 
                    className="ledger-slider" 
                    value={dropsCount} 
                    onChange={(e) => setDropsCount(parseInt(e.target.value))} 
                  />

                  <div className="ledger-slider-header" style={{ marginTop: '10px' }}>
                    <span>Units per Drop: {unitsPerDrop}</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="250" 
                    step="25"
                    className="ledger-slider" 
                    value={unitsPerDrop} 
                    onChange={(e) => setUnitsPerDrop(parseInt(e.target.value))} 
                  />
                </div>
              </div>
            </div>
          </div>

          <footer className="section-footer">
            <span className="font-mono">ADJUST LEDGER PARAMETERS LIVE TO DECLASSIFY PROJECTIONS</span>
            <span className="font-mono">SECTION 07 / 08</span>
          </footer>
        </section>


        {/* SECTION 8: CALL TO ACTION */}
        <section className="scroll-section" id="cta-section">
          <header className="section-header">
            <div>
              <span className="font-mono text-orange" style={{ display: 'block' }}>PROTOCOL: ENLIST_WAITLIST</span>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-gray)', display: 'block', marginTop: '2px' }}>[GATEWAY: OPEN]</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="font-mono" style={{ display: 'block', fontWeight: 'bold' }}>MISSION ACCESS CODE</span>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-gray)', display: 'block', marginTop: '2px' }}>[SECURE_WAITLIST_SYS]</span>
            </div>
          </header>

          <div className="section-body">
            <div className="cta-content">
              {enlistedPass ? (
                /* Waitlist enlistment success card rendering */
                <div className="enlisted-pass-container" style={{ textAlign: 'center', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                  <div className="enlistment-pass">
                    {/* Corners details */}
                    <div className="hero-hud-element" style={{ top: 12, left: 12, fontSize: '10px' }}>REMNANT ACCESS PASS</div>
                    <div className="hero-hud-element" style={{ top: 12, right: 12, fontSize: '10px' }}>SECURE LINK ACTIVE</div>
                    
                    <div className="dossier-stamp" style={{ marginTop: '20px' }}>ACCESS APPROVED</div>
                    
                    <h3 className="font-heading" style={{ fontSize: '28px', margin: '10px 0' }}>{enlistedPass.name}</h3>
                    <p className="font-mono" style={{ fontSize: '13px', color: 'var(--color-gray)' }}>{enlistedPass.email}</p>
                    
                    <div style={{ borderTop: '1px dashed var(--color-charcoal)', borderBottom: '1px dashed var(--color-charcoal)', margin: '20px 0', padding: '15px 0', textAlign: 'left', fontSize: '14px' }}>
                      <div><strong>ASSIGNED PASS ID:</strong> <span className="text-orange">{enlistedPass.serial}</span></div>
                      <div><strong>FABRIC ALLOCATION:</strong> {enlistedPass.fabric}</div>
                      <div><strong>ENLIST DATE:</strong> {enlistedPass.date}</div>
                      <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--accent-olive)' }}>* System notification will route to email prior to Mission 001 launch. No repeat logs allowed.</div>
                    </div>

                    <div className="pass-barcode">|||| | ||||| | || |||| | | |||</div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                      <button className="btn-tactical btn-orange" onClick={handlePrintBadge}>
                        <Printer size={16} /> Print Pass
                      </button>
                      <button className="btn-tactical btn-secondary" onClick={handleResetWaitlist}>
                        <RefreshCw size={16} /> Register Another
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Default Waitlist Input Form */
                <div className="cta-grid">
                  <div className="cta-text-side">
                    <div>
                      <h2 className="font-heading cta-h2">Mission 001 is coming.</h2>
                      <p className="cta-subtext">
                        We don't restock. We don't repeat. Register now to gain access to the declassified terminal link before the mission goes live.
                      </p>
                    </div>
                    <div className="font-mono" style={{ fontSize: '12px', borderTop: '1px dashed var(--color-light-gray)', paddingTop: '15px' }}>
                      STATUS: TERMINAL ACCESS LOCK<br />
                      DROP SIZE: 125 UNITS TOTAL
                    </div>
                  </div>

                  <form className="cta-form-side" onSubmit={handleWaitlistSubmit}>
                    <div className="form-group">
                      <label className="form-label">OPERATIVE NAME</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. ARJUN MEHTA" 
                        required
                        value={waitlistName}
                        onChange={(e) => setWaitlistName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">OPERATIVE EMAIL</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        placeholder="e.g. arjun@domain.com" 
                        required
                        value={waitlistEmail}
                        onChange={(e) => setWaitlistEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">PREFERRED FABRIC ALLOCATION</label>
                      <select 
                        className="form-input"
                        value={waitlistFabric}
                        onChange={(e) => setWaitlistFabric(e.target.value)}
                      >
                        <option value="OD Canvas">Surplus Army OD Canvas (Field Jacket)</option>
                        <option value="Combat Ripstop">Surplus Combat Ripstop (Cargo Trousers)</option>
                        <option value="Tactical Vest Panels">Decommissioned Vest Panels (Utility Vest)</option>
                      </select>
                    </div>

                    <button type="submit" className="btn-tactical btn-orange" style={{ width: '100%', justifyContent: 'center' }} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>Encrypting Log...</>
                      ) : (
                        <>
                          <Lock size={16} /> Enlist in Mission Waitlist
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          <footer className="section-footer">
            <span className="font-mono">WAITLIST SERIALIZED PASS GENERATED SECURELY</span>
            <span className="font-mono">SECTION 08 / 08</span>
          </footer>
        </section>

      </div>

      {/* Sticky Tab Trigger for Submission Folder Overlay */}
      <button 
        className="btn-tactical btn-orange presentation-tab-trigger"
        onClick={() => setShowBriefcase(true)}
      >
        <FileText size={18} /> SUBMISSION SLIDES & PROCESS NOTE
      </button>

      {/* Presentation Briefcase Overlay Modal */}
      {showBriefcase && (
        <div className="presentation-overlay">
          <div className="briefcase-container">
            <header className="briefcase-header">
              <span className="font-mono" style={{ fontSize: '13px' }}>FOLDER: SUBMISSION_DOSSIER // CLASS_EVALUATION</span>
              <button 
                onClick={() => setShowBriefcase(false)} 
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
                aria-label="Close dossier"
              >
                <X size={20} />
              </button>
            </header>

            <div className="briefcase-body">
              {/* Sidebar tabs selection */}
              <nav className="briefcase-sidebar" aria-label="Briefcase sections">
                <button 
                  className={`slide-tab-btn ${activeSlideTab === 'metadata' ? 'active' : ''}`}
                  onClick={() => setActiveSlideTab('metadata')}
                >
                  Group Metadata
                </button>
                <button 
                  className={`slide-tab-btn ${activeSlideTab === 'design' ? 'active' : ''}`}
                  onClick={() => setActiveSlideTab('design')}
                >
                  Slide 1: Design Decisions
                </button>
                <button 
                  className={`slide-tab-btn ${activeSlideTab === 'process' ? 'active' : ''}`}
                  onClick={() => setActiveSlideTab('process')}
                >
                  Slide 2: Development Note
                </button>
              </nav>

              {/* Slide Contents viewer */}
              <main className="briefcase-content">
                {activeSlideTab === 'metadata' && (
                  <div>
                    <div className="dossier-stamp">EVALUATION SHEET</div>
                    <h3 className="font-heading" style={{ fontSize: '28px', marginBottom: '10px' }}>Project Group Manifest</h3>
                    <p style={{ color: 'var(--color-gray)', fontSize: '14px', marginBottom: '20px' }}>
                      This single-scroll website was developed under classroom guidelines. Group details are listed below for grading convenience.
                    </p>

                    <table className="team-table">
                      <thead>
                        <tr>
                          <th>OPERATIVE NAME</th>
                          <th>ROLL NUMBER</th>
                          <th>INSTITUTION EMAIL ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamMembers.map((member, idx) => (
                          <tr key={idx}>
                            <td>{member.name}</td>
                            <td>{member.roll}</td>
                            <td>{member.email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="font-mono text-olive" style={{ fontSize: '12px', marginTop: '25px' }}>
                      * Submission includes: Responsive coded landing page, interactive CSS widgets, waitlist badge generator, and printable logs.
                    </div>
                  </div>
                )}

                {activeSlideTab === 'design' && (
                  <div>
                    <div className="dossier-stamp">SLIDE 1</div>
                    <h3 className="font-heading" style={{ fontSize: '28px', marginBottom: '10px' }}>Design System & Aesthetic Logic</h3>
                    <p style={{ color: 'var(--color-gray)', fontSize: '14px', marginBottom: '15px' }}>
                      Critical analysis of visual decisions, brand tokens, and usability principles.
                    </p>

                    <div className="slide-bullet-list">
                      <div className="slide-bullet">
                        <strong>Bold Military Color Palette (Anti-Dark Theme):</strong> Rather than using typical black/white portfolios, we used <em>Coyote Desert Tan (#DFD8CD)</em> as the structural background, paired with high-visibility <em>Hazard Orange (#FF5E00)</em> for interactive alerts and actions.
                      </div>
                      <div className="slide-bullet">
                        <strong>Typography Hierarchy:</strong> Used <em>Space Grotesk</em> for industrial, geometrical titles, and <em>Share Tech Mono</em> for coordinate registers and HUD status panels, giving a declassified tech pack feel.
                      </div>
                      <div className="slide-bullet">
                        <strong>Minimalism & Data Density:</strong> Copy is kept brief and formatted into functional manifests, tables, and blueprints, prioritizing technical diagrams and vectors over heavy text.
                      </div>
                      <div className="slide-bullet">
                        <strong>Accessibility:</strong> High contrast ratio between dark charcoal stencils and sandy khaki background. Large interactive click target regions and tooltips ensure clean accessibility.
                      </div>
                    </div>
                  </div>
                )}

                {activeSlideTab === 'process' && (
                  <div>
                    <div className="dossier-stamp">SLIDE 2</div>
                    <h3 className="font-heading" style={{ fontSize: '28px', marginBottom: '10px' }}>Development & Iterative Notes</h3>
                    <p style={{ color: 'var(--color-gray)', fontSize: '14px', marginBottom: '15px' }}>
                      Step-by-step documentation of coding implementation and loops.
                    </p>

                    <div className="slide-bullet-list">
                      <div className="slide-bullet">
                        <strong>Step 1 — Frame Construction:</strong> Built on a React + Vite boilerplate, utilizing raw CSS selectors and flexboxes to align elements strictly to a 1440px desktop grid.
                      </div>
                      <div className="slide-bullet">
                        <strong>Step 2 — Interactive Scanners:</strong> Coded the split-screen clip-path waste slider and fabric decrypter from scratch. They map mouse events inside the slider box container to handle the width dynamically.
                      </div>
                      <div className="slide-bullet">
                        <strong>Step 3 — CAD Product Blueprints:</strong> Garments are rendered as inline responsive SVGs. Hotspots are positioned at absolute coordinate overlays and hoverable for detail reveal.
                      </div>
                      <div className="slide-bullet">
                        <strong>Step 4 — Feedback Iterations:</strong> Early feedback requested printable waitlist tickets. We integrated a dynamic pass generation template which outputs print stylesheet media directives.
                      </div>
                    </div>
                  </div>
                )}
              </main>
            </div>
            
            <footer style={{ padding: '15px 25px', background: 'var(--color-light-gray)', borderTop: 'var(--border-tactical)', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                className="btn-tactical btn-orange"
                onClick={() => window.print()}
              >
                <Download size={14} /> Export Dossier to PDF
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
