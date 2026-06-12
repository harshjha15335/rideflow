import React, { useState, useRef } from 'react';
import { Search, MapPin, Train, Bus, Car, Zap, Map } from 'lucide-react';
import { useJourney } from '../services/JourneyContext';
import cityHero from '../assets/city_hero.png';

const MODES = [
  { icon: Train, label: 'Metro',  color: '#5B4CFF' },
  { icon: Bus,   label: 'Bus',    color: '#7A6CFF' },
  { icon: Car,   label: 'Taxi',   color: '#FF5B6B' },
  { icon: Zap,   label: 'Auto',   color: '#F59E0B' },
];

export const LandingHomeScreen: React.FC = () => {
  const { setTab, executeSearch, allLocations, setSearchQuery, sourceId, preference } = useJourney();
  const [query, setQuery]               = useState('');
  const [focused, setFocused]           = useState(false);
  const [showSuggestions, setShowSugg]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = query.length > 0
    ? allLocations.filter(l => l.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : allLocations.slice(0, 5);

  const handleSuggestionClick = (locationId: string, locationName: string) => {
    setQuery(locationName);
    setShowSugg(false);
    setSearchQuery(sourceId, locationId, preference);
    setTimeout(() => { executeSearch(); setTab('search'); }, 100);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch();
    setTab('search');
  };

  return (
    <div
      id="landing-home-screen"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── City illustration (bottom layer) ── */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', pointerEvents: 'none' }}>
        <img
          src={cityHero}
          alt="RideFlow smart city"
          style={{
            width: '120%',
            maxWidth: 'none',
            objectFit: 'cover',
            objectPosition: 'top center',
            marginBottom: '-1%',
            userSelect: 'none',
            filter: 'saturate(1.05) brightness(1.02)',
          }}
        />
      </div>

      {/* ── Gradient fade overlay ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            to bottom,
            rgba(255,255,255,1)    0%,
            rgba(255,255,255,0.97) 14%,
            rgba(255,255,255,0.82) 30%,
            rgba(255,255,255,0.45) 46%,
            rgba(255,255,255,0.10) 62%,
            rgba(255,255,255,0)    74%
          )`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '64px',
        }}
      >
        {/* ══ LOGO CARD ══ */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '28px',
            boxShadow: '0 12px 56px rgba(91,76,255,0.13), 0 2px 12px rgba(0,0,0,0.07)',
            padding: '26px 48px 22px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(91,76,255,0.09)',
            marginBottom: '36px',
          }}
        >
          {/* Icon + wordmark — matches Sidebar logo exactly */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                background: '#4F46E5',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
                flexShrink: 0,
              }}
            >
              <Map size={30} color="#ffffff" strokeWidth={1.8} />
            </div>

            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: '42px',
                letterSpacing: '-1px',
                background: 'linear-gradient(135deg, #5B4CFF 0%, #9B6BFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1,
              }}
            >
              RideFlow
            </span>
          </div>

          {/* Subtitle */}
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '4px',
              color: '#B0B8CC',
              textTransform: 'uppercase',
            }}
          >
            INTELLIGENT TRANSIT
          </span>
        </div>

        {/* ══ SEARCH BAR ══ */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '680px', padding: '0 24px' }}>
          <form onSubmit={handleSearchSubmit}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#ffffff',
                border: `2.5px solid ${focused ? '#5B4CFF' : 'rgba(91,76,255,0.4)'}`,
                borderRadius: '999px',
                padding: '0 10px 0 26px',
                height: '68px',
                boxShadow: focused
                  ? '0 0 0 5px rgba(91,76,255,0.13), 0 10px 40px rgba(91,76,255,0.18)'
                  : '0 6px 32px rgba(91,76,255,0.12), 0 1px 6px rgba(0,0,0,0.07)',
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                gap: '14px',
              }}
            >
              <Search
                size={24}
                style={{
                  color: focused ? '#5B4CFF' : '#B0B8CC',
                  flexShrink: 0,
                  transition: 'color 0.2s',
                }}
              />

              <input
                ref={inputRef}
                id="landing-search-input"
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setShowSugg(true); }}
                onFocus={() => { setFocused(true); setShowSugg(true); }}
                onBlur={() => { setFocused(false); setTimeout(() => setShowSugg(false), 180); }}
                placeholder="Where to next?"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '18px',
                  color: '#1A202C',
                  caretColor: '#5B4CFF',
                  letterSpacing: '-0.1px',
                }}
              />

              <button
                type="submit"
                id="landing-search-btn"
                style={{
                  height: '50px',
                  padding: '0 32px',
                  background: 'linear-gradient(135deg, #5B4CFF 0%, #7A6CFF 100%)',
                  border: 'none',
                  borderRadius: '999px',
                  color: '#fff',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  letterSpacing: '0.2px',
                  transition: 'opacity 0.15s, transform 0.15s',
                  boxShadow: '0 4px 16px rgba(91,76,255,0.35)',
                }}
                onMouseEnter={e => { const b = e.target as HTMLElement; b.style.opacity='0.9'; b.style.transform='scale(1.03)'; }}
                onMouseLeave={e => { const b = e.target as HTMLElement; b.style.opacity='1';   b.style.transform='scale(1)'; }}
              >
                Search
              </button>
            </div>
          </form>

          {/* Suggestions dropdown */}
          {showSuggestions && focused && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                left: '24px',
                right: '24px',
                background: '#ffffff',
                borderRadius: '22px',
                boxShadow: '0 16px 48px rgba(0,0,0,0.13), 0 2px 8px rgba(91,76,255,0.08)',
                border: '1px solid rgba(91,76,255,0.12)',
                overflow: 'hidden',
                zIndex: 10,
              }}
            >
              <div style={{ padding: '10px' }}>
                {suggestions.map((loc, i) => (
                  <button
                    key={`suggestion-item-${i}`}
                    id={`suggestion-${loc.id}`}
                    onMouseDown={() => handleSuggestionClick(loc.id, loc.name)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F7F5FF'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '12px',
                        background: i % 2 === 0 ? '#F0EEFF' : '#FFF0F3',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <MapPin size={16} style={{ color: i % 2 === 0 ? '#5B4CFF' : '#FF5B6B' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#1A202C' }}>{loc.name}</div>
                      <div style={{ fontSize: '12px', color: '#A0AEC0', marginTop: '2px' }}>{loc.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ══ TRANSPORT MODE PILLS ══ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '22px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: '0 24px',
          }}
        >
          {MODES.map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '9px 20px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.92)',
                border: `1.5px solid ${color}28`,
                boxShadow: '0 3px 12px rgba(0,0,0,0.07)',
                backdropFilter: 'blur(10px)',
                cursor: 'default',
              }}
            >
              <Icon size={15} style={{ color }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '14px', color: '#4A5568' }}>
                {label}
              </span>
            </div>
          ))}
          <div
            style={{
              padding: '9px 20px', borderRadius: '999px',
              background: 'rgba(255,255,255,0.92)',
              border: '1.5px solid rgba(160,174,192,0.3)',
              boxShadow: '0 3px 12px rgba(0,0,0,0.07)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '14px', color: '#A0AEC0' }}>
              + more
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
