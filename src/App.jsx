import { useState, useEffect, useRef, useCallback } from 'react'
import { Volume2, VolumeX, Heart, Check, X, Trophy, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import './index.css'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const ALL_PHOTOS = [
  '/Images/WhatsApp Image 2026-05-29 at 14.46.15.jpeg',
  '/Images/WhatsApp Image 2026-05-29 at 14.46.16 (1).jpeg',
  '/Images/WhatsApp Image 2026-05-29 at 14.46.16.jpeg',
  '/Images/WhatsApp Image 2026-05-29 at 14.46.17.jpeg',
  '/Images/WhatsApp Image 2026-05-29 at 14.46.19.jpeg',
  '/Images/WhatsApp Image 2026-05-29 at 14.46.20.jpeg',
  '/Images/WhatsApp Image 2026-05-29 at 14.46.22.jpeg',
  '/Images/WhatsApp Image 2026-05-29 at 14.46.23.jpeg',
  '/Images/WhatsApp Image 2026-05-29 at 14.46.24.jpeg',
  '/Images/WhatsApp Image 2026-05-29 at 14.46.26.jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 14.23.24.jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 14.32.24.jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 14.32.47.jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 15.27.00.jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 15.27.43.jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 15.27.51.jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 15.27.59.jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 15.28.09.jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 15.28.34.jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 15.28.45.jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 15.29.00.jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 15.29.31.jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 15.29.51.jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 15.29.58.jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 15.30.33.jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 15.30.42.jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 15.47.57 (1).jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 15.47.57 (2).jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 15.47.57 (3).jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 15.47.57.jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 15.47.59.jpeg',
  '/Images/WhatsApp Image 2026-05-31 at 15.49.06.jpeg',
]

// ─── AUDIO ───────────────────────────────────────────────────────────────────
function useAudio() {
  const raceRef  = useRef(null)
  const countRef = useRef(null)
  const [muted, setMuted]     = useState(false)
  const [playing, setPlaying] = useState(null)
  useEffect(() => {
    raceRef.current        = new Audio('/hamitratz.mp3')
    raceRef.current.loop   = true
    raceRef.current.volume = 0.45
    countRef.current        = new Audio('/count_on_me.mp3')
    countRef.current.loop   = true
    countRef.current.volume = 0.55
    return () => { raceRef.current?.pause(); countRef.current?.pause() }
  }, [])
  useEffect(() => {
    if (raceRef.current)  raceRef.current.muted  = muted
    if (countRef.current) countRef.current.muted = muted
  }, [muted])
  const playRace  = useCallback(() => { countRef.current?.pause(); raceRef.current?.play().catch(()=>{}); setPlaying('race')  }, [])
  const stopRace  = useCallback(() => { raceRef.current?.pause(); if(raceRef.current) raceRef.current.currentTime=0; setPlaying(p=>p==='race'?null:p) }, [])
  const playCount = useCallback(() => { raceRef.current?.pause(); if(raceRef.current) raceRef.current.currentTime=0; countRef.current?.play().catch(()=>{}); setPlaying('count') }, [])
  return { playing, muted, setMuted, playRace, stopRace, playCount }
}

// ─── CONFETTI ────────────────────────────────────────────────────────────────
function Confetti() {
  const colors = ['#ffd700','#e91e8c','#f48fb1','#f9a825','#ce93d8','#ff8a80']
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{zIndex:99}}>
      {Array.from({length:60}).map((_,i) => (
        <div key={i} className="confetti-piece" style={{
          left:`${Math.random()*100}%`, background:colors[i%colors.length],
          borderRadius:i%3===0?'50%':'2px',
          width:`${5+Math.random()*9}px`, height:`${5+Math.random()*9}px`,
          animationDuration:`${2.5+Math.random()*3}s`,
          animationDelay:`${Math.random()*2.5}s`,
        }}/>
      ))}
    </div>
  )
}

// ─── FLOATING HEARTS ─────────────────────────────────────────────────────────
function FloatingHearts() {
  const [hearts, setHearts] = useState([])
  const emojis = ['❤️','💕','💝','💖','💗','💓']
  useEffect(() => {
    const id = setInterval(() => {
      setHearts(h => [...h.slice(-18), { id: Date.now(), x: 8+Math.random()*84, e: emojis[Math.floor(Math.random()*emojis.length)] }])
    }, 800)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{zIndex:0}}>
      {hearts.map(h => (
        <div key={h.id} className="heart-particle absolute"
          style={{left:`${h.x}%`, bottom:'4%'}}
          onAnimationEnd={() => setHearts(p => p.filter(x => x.id !== h.id))}
        >{h.e}</div>
      ))}
    </div>
  )
}

// ─── MUTE BUTTON ─────────────────────────────────────────────────────────────
function MuteButton({ muted, setMuted, visible }) {
  if (!visible) return null
  return (
    <button onClick={() => setMuted(m => !m)} style={{
      background:'rgba(194,24,91,0.85)', position:'fixed', top:16, left:16,
      zIndex:200, padding:12, borderRadius:'50%',
      border:'2px solid rgba(249,168,37,0.6)', cursor:'pointer',
      color:muted?'rgba(255,255,255,0.4)':'#fff', transition:'all 0.2s',
      boxShadow:'0 2px 12px rgba(194,24,91,0.35)',
    }}>
      {muted ? <VolumeX size={22}/> : <Volume2 size={22}/>}
    </button>
  )
}

// ─── BG HEARTS DECO ──────────────────────────────────────────────────────────
function BgDeco({ items, color = 'rgba(216,27,96,0.07)', count = 12 }) {
  const list = items || ['❤️','💕','🌸','✨','💝','⭐','💫','🌟']
  return (
    <>
      {Array.from({length:count}).map((_,i) => (
        <div key={i} className="animate-float" style={{
          position:'absolute',
          fontSize:`${1.0+(i%4)*0.3}rem`,
          top:`${(i*17+3)%90}%`, left:`${(i*13+5)%95}%`,
          animationDelay:`${(i*0.35)%3}s`,
          opacity:0.35, pointerEvents:'none', userSelect:'none',
        }}>{list[i % list.length]}</div>
      ))}
    </>
  )
}

// ─── SCREEN 0: LANDING ───────────────────────────────────────────────────────
function Screen0({ onNext }) {
  const decor = ['🎈','🎉','🎊','🎂','✨','💝','💕','🎁','🎀','❤️','🥳','🌸','💐','🎶','💗','🎵']
  return (
    <div dir="rtl" style={{
      minHeight:'100svh',
      background:'linear-gradient(150deg,#fff0f7 0%,#fce4ec 25%,#ffe4f0 55%,#f3e5f5 100%)',
      display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', padding:'28px 16px 36px',
      position:'relative', overflow:'hidden',
    }}>
      <FloatingHearts/>
      {decor.map((item,i) => (
        <div key={i} className="animate-float" style={{
          position:'absolute', fontSize:`${1.1+(i%4)*0.38}rem`,
          top:`${(i*17+3)%90}%`, left:`${(i*13+5)%95}%`,
          animationDelay:`${(i*0.35)%3}s`, opacity:0.38,
          pointerEvents:'none', userSelect:'none',
        }}>{item}</div>
      ))}

      {/* Photo */}
      <div className="animate-bounce-in" style={{
        width:230, height:230, borderRadius:'50%', overflow:'hidden',
        marginBottom:26, flexShrink:0,
        border:'6px solid #e91e8c',
        boxShadow:'0 0 0 6px #f9a825, 0 0 0 12px rgba(233,30,140,0.2), 0 16px 48px rgba(233,30,140,0.35)',
        position:'relative', zIndex:1,
      }}>
        <img src="/Images/gali.jpeg" alt="גלי" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
      </div>

      {/* Title */}
      <div style={{textAlign:'center', position:'relative', zIndex:1, marginBottom:34, padding:'0 12px'}}>
        <h1 style={{
          fontSize:'clamp(1.5rem,6vw,2.6rem)', fontWeight:900,
          background:'linear-gradient(135deg,#880e4f,#e91e8c,#9c27b0)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
          margin:'0 0 18px', lineHeight:1.3,
          filter:'drop-shadow(0 2px 6px rgba(136,14,79,0.2))',
        }}>
          יום הולדת שמח לחברה שלנו היפה
        </h1>
        <div style={{display:'flex', justifyContent:'center', gap:10, fontSize:30}}>
          {['🥳','❤️','🎀','💕','🎉'].map((e,i) => (
            <span key={i} className="animate-float" style={{animationDelay:`${i*0.25}s`}}>{e}</span>
          ))}
        </div>
      </div>

      <button onClick={onNext} className="animate-pulse-glow" style={{
        background:'linear-gradient(135deg,#e91e8c,#880e4f)',
        color:'#fff', fontWeight:900, padding:'20px 52px',
        borderRadius:'50px', border:'none', cursor:'pointer',
        fontSize:'1.3rem', position:'relative', zIndex:1,
        boxShadow:'0 8px 36px rgba(233,30,140,0.5)',
        transition:'all 0.25s ease', letterSpacing:'0.05em',
      }}>
        בואו נתחיל 🎉
      </button>
    </div>
  )
}

// ─── SCREEN 1: POEM ──────────────────────────────────────────────────────────
const poemLines = [
  'גלי שלנו 🥹🥹🥹❤️❤️❤️',
  'אמנם הגעת לגיל 28 והחרדה בשיאה,',
  'אלו היו שנים מדהימות, מקווים שבעצמך את גאה.',
  'מאחלים לך הכי טוב שאפשר,',
  'ושיום יבוא ויהיה לך מזל כמו של תמר…..',
  'את באמת הבן אדם הכי טוב בעולם,',
  'ולא סתם אהובה על כולם.',
  'יש בך איכויות שכל אחד היה רוצה,',
  'ואיתך יום שלם אפשר להיות ולא למצא.',
  'שתלמדי להמנע משיחות חולין,',
  'ושתאכלי מלא קלוריות מבלי להשמין.',
  'שתמשיכי להכין פעילויות ולחגוג יום הולדת לכל אחד,',
  'ותמיד לדאוג לכולם באופן מיוחד.',
  'מאחלים לך להגשים את עצמך ואת כל החלומות,',
  'ושנמשיך לבלות במלא מקומות.',
  'אוהבים המון ולתמיד ומעריצים,',
  'המלווים.',
]

function Screen1({ onNext }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    poemLines.forEach((_,i) => setTimeout(() => setShown(n => Math.max(n,i+1)), 300+i*200))
  }, [])
  return (
    <div dir="rtl" style={{
      minHeight:'100svh',
      background:'linear-gradient(150deg,#fff0f7 0%,#fce4ec 50%,#fff0f7 100%)',
      display:'flex', flexDirection:'column', alignItems:'center',
      padding:'20px 16px 36px', position:'relative', overflow:'hidden',
    }}>
      <div className="race-stripe-top"/>
      <div className="race-stripe-bottom"/>
      <BgDeco/>

      <div className="animate-fade-in-up" style={{textAlign:'center', marginBottom:22, marginTop:8}}>
        <div className="shimmer-text" style={{fontSize:28, fontWeight:900, marginBottom:6}}>חמשיר ❤️</div>
        <div style={{display:'flex', justifyContent:'center', gap:8, fontSize:24}}>
          {['🎂','💝','🌟','🥳','💕'].map((e,i) => (
            <span key={i} className="animate-float" style={{animationDelay:`${i*0.25}s`}}>{e}</span>
          ))}
        </div>
      </div>

      <div className="race-card" style={{width:'100%', maxWidth:480, padding:'24px 22px', marginBottom:28}}>
        <div style={{display:'flex', flexDirection:'column', gap:9}}>
          {poemLines.map((line,i) => (
            <p key={i} style={{
              textAlign:'right', margin:0,
              opacity:i<shown?1:0,
              transform:i<shown?'translateX(0)':'translateX(20px)',
              transition:'opacity 0.5s ease, transform 0.5s ease',
              color:i===0?'#880e4f':i===poemLines.length-1?'#c2185b':'#3e0020',
              fontWeight:(i===0||i===poemLines.length-1)?700:400,
              fontSize:i===0?'1.1rem':'0.97rem',
              lineHeight:1.75,
              fontStyle:(i>0&&i<poemLines.length-1)?'italic':'normal',
            }}>{line}</p>
          ))}
        </div>
      </div>

      {shown >= poemLines.length && (
        <button onClick={onNext} className="btn-race animate-bounce-in animate-pulse-glow"
          style={{fontSize:'1.05rem', padding:'16px 40px'}}>
          המשך למשימה ➡️
        </button>
      )}
    </div>
  )
}

// ─── SCREEN 2: ENVELOPE (YELLOW + BLACK – AMAZING RACE STYLE) ────────────────
function Screen2({ onNext, playRace }) {
  const [opened, setOpened]   = useState(false)
  const [showBtn, setShowBtn] = useState(false)

  const handleOpen = () => {
    if (opened) return
    setOpened(true); playRace()
    setTimeout(() => setShowBtn(true), 1200)
  }

  return (
    <div dir="rtl" style={{
      minHeight:'100svh',
      background:'linear-gradient(150deg,#f3e5f5 0%,#ede7f6 50%,#e8eaf6 100%)',
      display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', padding:'28px 16px', position:'relative', overflow:'hidden',
    }}>
      {/* purple stripe */}
      <div style={{position:'absolute',top:0,left:0,right:0,height:5,background:'linear-gradient(90deg,#7b1fa2,#e91e8c,#7b1fa2)'}}/>
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:5,background:'linear-gradient(90deg,#7b1fa2,#e91e8c,#7b1fa2)'}}/>

      <div style={{textAlign:'center', marginBottom:24}}>
        <div style={{color:'#4a0072', fontWeight:900, fontSize:'1.15rem', marginBottom:4}}>המשימה שלך</div>
        {!opened && <p style={{color:'rgba(74,0,114,0.5)', fontSize:'0.85rem', margin:0}}>לחצי על המעטפה לפתיחה</p>}
      </div>

      {/* ── ENVELOPE ── */}
      <div
        onClick={handleOpen}
        style={{
          cursor:opened?'default':'pointer',
          position:'relative', width:300, marginBottom:32,
          transform:opened?'scale(1.04) translateY(-8px)':'scale(1)',
          transition:'transform 0.7s ease',
          filter:opened?'drop-shadow(0 16px 32px rgba(0,0,0,0.22))':'drop-shadow(0 6px 16px rgba(0,0,0,0.14))',
        }}
      >
        {/* Envelope body */}
        <div style={{
          borderRadius:18, border:'4px solid #000',
          overflow:'hidden', background:'#FFD700',
          boxShadow:'inset 0 0 0 2px rgba(255,255,255,0.2)',
        }}>
          {/* Top flap overlay (collapses when opened) */}
          <div style={{
            height:opened?0:80, overflow:'hidden',
            transition:'height 0.9s ease', position:'relative',
          }}>
            {/* V-shape flap */}
            <div style={{
              width:0, height:0,
              borderLeft:'150px solid transparent',
              borderRight:'150px solid transparent',
              borderTop:'78px solid #e6b800',
            }}/>
            <div style={{position:'absolute',top:0,left:0,width:0,height:0,borderLeft:'150px solid transparent',borderRight:'150px solid transparent',borderTop:'78px solid rgba(0,0,0,0.18)'}}/>
          </div>

          {/* Black banner – race title */}
          <div style={{background:'#000', padding:'12px 16px', textAlign:'center'}}>
            <div style={{color:'#FFD700', fontWeight:900, fontSize:22, letterSpacing:3, fontFamily:'Impact,Arial Black,sans-serif'}}>
              המירוץ למיליון
            </div>
          </div>

          {/* PRESS HERE button area */}
          <div style={{padding:'16px 14px 4px'}}>
            <div style={{
              background:'rgba(255,255,255,0.55)',
              border:'3px solid #000', borderRadius:50,
              padding:'16px 20px', textAlign:'center',
              boxShadow:'0 2px 0 rgba(0,0,0,0.25)',
            }}>
              <div style={{color:'#000', fontWeight:900, fontSize:22, letterSpacing:3, fontFamily:'Impact,Arial Black,sans-serif'}}>
                PRESS HERE
              </div>
            </div>
          </div>

          {/* Bottom strip */}
          <div style={{padding:'10px 16px 14px', textAlign:'center'}}>
            <div style={{color:'#000', fontSize:13, fontWeight:600}}>
              ✉ הודעה מיוחדת ✉
            </div>
          </div>
        </div>

        {/* Pop-out clue card */}
      </div>

      {!opened && (
        <p className="animate-float" style={{color:'rgba(74,0,114,0.45)', fontSize:'0.85rem', margin:0}}>
          לחצי על המעטפה לפתיחה ⬆️
        </p>
      )}
      {showBtn && (
        <button onClick={onNext} className="btn-race animate-bounce-in" style={{fontSize:'1rem', marginTop:10}}>
          לחץ כאן להתחיל חידון קצרצר 🎯
        </button>
      )}
    </div>
  )
}

// ─── SCREEN 3: QUIZ ──────────────────────────────────────────────────────────
const quizData = [
  {question:'במה גלי הכי טובה?',options:['א. לאסוף חברים','ב. ללמד עברית','ג. להספיק להכניס ל-24 שעות 30 דברים לעשות','ד. היא טובה בהכל'],correct:3,type:'choice'},
  {question:'מנה כמה שיותר חברים של גלי (עד 20 כדי שלא יגמר לנו הערב רק על השאלה הזו...)',type:'text'},
  {question:'את מי גלי הכי אוהבת?',options:['א. שלי לוי','ב. שלי לוי','ג. שלי לוי (כן תמר ונריה אין אתכם באופציות סורי)','ד. שלי לוי'],correct:2,type:'choice'},
]

function Screen3({ onNext }) {
  const [qi, setQi]           = useState(0)
  const [selected, setSelected] = useState(null)
  const [textVal, setTextVal]   = useState('')
  const [textDone, setTextDone] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const q = quizData[qi]

  const pickChoice = (i) => {
    if (selected !== null) return
    setSelected(i)
    if (i === q.correct) setShowNext(true)
    else setTimeout(() => setSelected(null), 700)
  }
  const submitText = () => { if (!textVal.trim()) return; setTextDone(true); setShowNext(true) }
  const next = () => {
    if (qi < quizData.length-1) { setQi(n=>n+1); setSelected(null); setTextVal(''); setTextDone(false); setShowNext(false) }
    else onNext()
  }

  return (
    <div dir="rtl" style={{
      minHeight:'100svh',
      background:'linear-gradient(150deg,#fff0f7 0%,#fce4ec 50%,#fff0f7 100%)',
      display:'flex', flexDirection:'column', alignItems:'center',
      padding:'20px 16px 36px', position:'relative',
    }}>
      <div className="race-stripe-top"/>
      <BgDeco count={10}/>

      <div style={{width:'100%', maxWidth:480, marginBottom:20, position:'relative', zIndex:1}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
          <span style={{color:'#880e4f', fontWeight:700, fontSize:'0.85rem'}}>שאלה {qi+1} מתוך {quizData.length}</span>
          <div style={{display:'flex', gap:6}}>
            {quizData.map((_,i) => (
              <div key={i} style={{height:8, width:40, borderRadius:4, background:i<=qi?'linear-gradient(90deg,#880e4f,#e91e8c)':'rgba(0,0,0,0.08)', transition:'all 0.3s'}}/>
            ))}
          </div>
        </div>
        <div style={{textAlign:'center'}}>
          <Trophy size={32} color="#e91e8c" style={{margin:'0 auto 6px'}}/>
          <div className="shimmer-text" style={{fontSize:24, fontWeight:900}}>חידון גלי!</div>
        </div>
      </div>

      <div key={qi} className="race-card animate-card-reveal" style={{width:'100%', maxWidth:480, padding:'24px 20px', marginBottom:20, position:'relative', zIndex:1}}>
        <p style={{color:'#880e4f', fontWeight:700, fontSize:'1.05rem', textAlign:'right', marginBottom:20, lineHeight:1.6}}>{q.question}</p>
        {q.type === 'choice' && (
          <div style={{display:'flex', flexDirection:'column', gap:10}}>
            {q.options.map((opt,i) => {
              const isSel=selected===i, isCorr=i===q.correct
              let bg='#fafafa', border='rgba(0,0,0,0.1)', color='#2a0010'
              if (selected !== null) {
                if (isSel&&isCorr)   { bg='rgba(76,175,80,0.15)'; border='#4caf50' }
                else if (isSel&&!isCorr)  { bg='rgba(244,67,54,0.12)'; border='#f44336' }
                else if (!isSel&&isCorr)  { bg='rgba(76,175,80,0.08)'; border='rgba(76,175,80,0.5)' }
              }
              return (
                <button key={i} onClick={()=>pickChoice(i)} style={{
                  width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
                  gap:10, padding:'13px 16px', borderRadius:14,
                  background:bg, border:`1.5px solid ${border}`, color, fontWeight:500,
                  fontSize:'0.92rem', textAlign:'right', cursor:'pointer', transition:'all 0.3s ease',
                  boxShadow:'0 2px 8px rgba(0,0,0,0.04)',
                }}>
                  <span style={{flex:1, lineHeight:1.5}}>{opt}</span>
                  {isSel&&isCorr &&<Check size={18} color="#4caf50"/>}
                  {isSel&&!isCorr&&<X size={18} color="#f44336"/>}
                </button>
              )
            })}
          </div>
        )}
        {q.type === 'text' && (
          <div style={{display:'flex', flexDirection:'column', gap:12}}>
            <textarea value={textVal} onChange={e=>setTextVal(e.target.value)} disabled={textDone}
              placeholder="כתבי כאן את שמות החברים..." rows={4}
              style={{width:'100%', background:'#fafafa', border:'1.5px solid rgba(216,27,96,0.2)', borderRadius:14, padding:14, color:'#2a0010', fontSize:'0.95rem', textAlign:'right', resize:'none', outline:'none', fontFamily:'inherit', boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}/>
            {!textDone
              ? <button onClick={submitText} disabled={!textVal.trim()} className="btn-race" style={{width:'100%'}}>הגש ✓</button>
              : <div style={{background:'rgba(76,175,80,0.1)', border:'1.5px solid rgba(76,175,80,0.4)', borderRadius:14, padding:'16px', textAlign:'center'}}>
                  <div style={{color:'#2e7d32', fontWeight:700, fontSize:'1.1rem', marginBottom:4}}>נכון! כל הכבוד! 🎉</div>
                  <div style={{color:'#388e3c', fontSize:'0.85rem'}}>גלי באמת יש לה חברים בלי סוף 💛</div>
                </div>
            }
          </div>
        )}
      </div>

      {showNext && (
        <button onClick={next} className="btn-race animate-bounce-in" style={{fontSize:'1rem', position:'relative', zIndex:1}}>
          {qi===quizData.length-1 ? 'המשך לחלק שתיים ➡️' : 'שאלה הבאה ➡️'}
        </button>
      )}
    </div>
  )
}

// ─── SCREEN 4: ALIAS ─────────────────────────────────────────────────────────
const aliasWords = [
  'בריף בריפוני','אבא גיא','בא"ח גבעתי','אינבידיה',
  'תמר מצטיינת דיקן','שיעור עברית','צו 8 פתוח',
  'אוכל מפלייטיקה','מובילאיי',"נינג'ה קרימי",
  'עופרה','מיצר','גבעתי','נטעים',
  'שים עלי שים עלי שים עלי יהלום',
  'מתן','בוזי','פילגש','צופית','נוימן',
  'אקדמית תל אביב יפו','ספינינג','נטע בוסית','גיא פסיכיאטר',
]

function Screen4({ onNext }) {
  const [phase, setPhase]   = useState('start')
  const [idx, setIdx]       = useState(0)
  const [fading, setFading] = useState(false)

  const handleDone     = () => setPhase('handoff')
  const handleShowWord = () => {
    const nxt = idx+1
    if (nxt >= aliasWords.length) { setPhase('finished') }
    else { setFading(true); setTimeout(() => { setIdx(nxt); setFading(false); setPhase('word') }, 350) }
  }

  return (
    <div dir="rtl" style={{
      minHeight:'100svh',
      background:'linear-gradient(150deg,#b71c1c 0%,#d32f2f 40%,#c62828 70%,#b71c1c 100%)',
      display:'flex', flexDirection:'column', alignItems:'center',
      padding:'20px 16px 32px', position:'relative', overflow:'hidden',
    }}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:6,background:'linear-gradient(90deg,#ffd700,#fff,#ffd700)'}}/>
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:6,background:'linear-gradient(90deg,#ffd700,#fff,#ffd700)'}}/>

      {Array.from({length:8}).map((_,i) => (
        <div key={i} className="animate-float" style={{position:'absolute',color:'rgba(255,215,0,0.15)',fontSize:22,top:`${(i*23+5)%88}%`,left:`${(i*19+5)%92}%`,animationDelay:`${(i*0.4)%3}s`,pointerEvents:'none'}}>★</div>
      ))}

      <div style={{textAlign:'center', marginBottom:16, marginTop:10, position:'relative', zIndex:1}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:8}}>
          <img src="/Images/אליאס.png" alt="alias" style={{width:44,height:44,objectFit:'contain',borderRadius:8}} onError={e=>{e.target.style.display='none'}}/>
          <div style={{color:'#ffd700', fontWeight:900, fontSize:32, letterSpacing:3, textShadow:'0 2px 12px rgba(0,0,0,0.3)'}}>ALIAS</div>
          <img src="/Images/אליאס.png" alt="" style={{width:44,height:44,objectFit:'contain',borderRadius:8,transform:'scaleX(-1)'}} onError={e=>{e.target.style.display='none'}}/>
        </div>
        <div style={{background:'rgba(0,0,0,0.25)',border:'1px solid rgba(255,255,255,0.3)',borderRadius:14,padding:'10px 18px',maxWidth:380,margin:'0 auto',color:'#ffffff',fontSize:'0.88rem',lineHeight:1.6,backdropFilter:'blur(8px)'}}>
          נא להעביר כל פעם את הטלפון למי שיושב מימנך<br/>
          <span style={{opacity:0.8,fontSize:'0.82rem'}}>(הוא צריך להעביר את המילה)</span>
        </div>
      </div>

      {(phase==='word'||phase==='handoff') && (
        <div style={{display:'flex',gap:4,flexWrap:'wrap',justifyContent:'center',maxWidth:340,marginBottom:14,position:'relative',zIndex:1}}>
          {aliasWords.map((_,i) => (
            <div key={i} style={{width:10,height:10,borderRadius:'50%',transition:'all 0.3s',background:i<idx?'#4caf50':i===idx?'#ffd700':'rgba(255,255,255,0.25)',transform:i===idx?'scale(1.4)':'scale(1)'}}/>
          ))}
        </div>
      )}

      {phase==='start' && (
        <div style={{background:'#fff',borderRadius:22,padding:'32px 24px',textAlign:'center',maxWidth:340,width:'100%',boxShadow:'0 12px 48px rgba(0,0,0,0.3)',position:'relative',zIndex:1}}>
          <div style={{fontSize:56,marginBottom:16}}>🎭</div>
          <p style={{color:'#b71c1c',fontWeight:700,fontSize:'1rem',lineHeight:1.7,marginBottom:24}}>
            {aliasWords.length} מילות אליאס מוכנות!<br/>
            <span style={{fontWeight:400,fontSize:'0.9rem',color:'#555'}}>מוכנים? בואו נתחיל!</span>
          </p>
          <button onClick={()=>setPhase('word')} style={{background:'linear-gradient(135deg,#d32f2f,#ff5252)',color:'#fff',fontWeight:900,padding:'16px 32px',borderRadius:'50px',border:'none',cursor:'pointer',fontSize:'1.05rem',width:'100%',boxShadow:'0 4px 20px rgba(211,47,47,0.45)'}}>
            בואו נתחיל! 🎯
          </button>
        </div>
      )}

      {phase==='word' && (
        <div style={{width:'100%',maxWidth:360,position:'relative',zIndex:1}}>
          {[2,1].map(off => <div key={off} style={{position:'absolute',inset:0,borderRadius:22,background:`rgba(255,255,255,${0.3+off*0.1})`,transform:`translateY(${off*8}px) scale(${1-off*0.03})`,zIndex:-off}}/>)}
          <div style={{background:'#fff',borderRadius:22,padding:'36px 24px 28px',textAlign:'center',boxShadow:'0 16px 56px rgba(0,0,0,0.35)',opacity:fading?0:1,transform:fading?'scale(0.9)':'scale(1)',transition:'opacity 0.3s,transform 0.3s'}}>
            <div style={{color:'rgba(183,28,28,0.2)',fontSize:'0.7rem',fontWeight:700,letterSpacing:3,marginBottom:8}}>ALIAS</div>
            <div style={{color:'#b71c1c',fontSize:'clamp(1.7rem,7vw,2.3rem)',fontWeight:900,margin:'12px 0 32px',lineHeight:1.2}}>
              {aliasWords[idx]}
            </div>
            <div style={{display:'flex',gap:4,justifyContent:'center',marginBottom:24}}>
              {aliasWords.map((_,i) => <div key={i} style={{height:3,flex:1,borderRadius:2,maxWidth:14,background:i<idx?'#4caf50':i===idx?'#d32f2f':'rgba(0,0,0,0.1)',transition:'all 0.3s'}}/>)}
            </div>
          </div>
          <button onClick={handleDone} style={{marginTop:18,width:'100%',padding:'18px',background:'linear-gradient(135deg,#ffd700,#ffb300)',color:'#7a0000',fontWeight:900,fontSize:'1.15rem',borderRadius:'50px',border:'none',cursor:'pointer',boxShadow:'0 6px 24px rgba(255,179,0,0.5)'}}>
            עשיתי ✓
          </button>
        </div>
      )}

      {phase==='handoff' && (
        <div className="animate-bounce-in" style={{background:'#fff',borderRadius:22,padding:'36px 24px',textAlign:'center',maxWidth:340,width:'100%',boxShadow:'0 12px 48px rgba(0,0,0,0.3)',position:'relative',zIndex:1}}>
          <div style={{fontSize:52,marginBottom:14}}>🔄</div>
          <div style={{color:'#b71c1c',fontWeight:900,fontSize:'1.35rem',marginBottom:12}}>העבר את הטלפון למשתתף מימנך!</div>
          <p style={{color:'#555',fontSize:'0.9rem',marginBottom:28,lineHeight:1.5}}>המשתתף הבא לוחץ כשמוכן לראות את המילה</p>
          <button onClick={handleShowWord} style={{width:'100%',padding:'18px',background:'linear-gradient(135deg,#d32f2f,#ff5252)',color:'#fff',fontWeight:900,fontSize:'1.1rem',borderRadius:'50px',border:'none',cursor:'pointer',boxShadow:'0 4px 20px rgba(211,47,47,0.45)'}}>
            הצג מילה 👁️
          </button>
        </div>
      )}

      {phase==='finished' && (
        <div className="animate-bounce-in" style={{background:'#fff',borderRadius:22,padding:'36px 24px',textAlign:'center',maxWidth:340,width:'100%',boxShadow:'0 12px 48px rgba(0,0,0,0.3)',position:'relative',zIndex:1}}>
          <div style={{fontSize:56,marginBottom:12}}>🏆</div>
          <div style={{color:'#b71c1c',fontWeight:900,fontSize:24,marginBottom:8}}>כל הכבוד!</div>
          <p style={{color:'#555',marginBottom:24,fontSize:'0.9rem'}}>סיימתם את כל מילות האליאס!</p>
          <button onClick={onNext} style={{width:'100%',padding:'16px',background:'linear-gradient(135deg,#d32f2f,#ff5252)',color:'#fff',fontWeight:900,fontSize:'1.05rem',borderRadius:'50px',border:'none',cursor:'pointer',boxShadow:'0 4px 20px rgba(211,47,47,0.45)'}}>
            המשך לאמת או חובה 💫
          </button>
        </div>
      )}
    </div>
  )
}

// ─── SCREEN 5: TRUTH OR DARE ──────────────────────────────────────────────────
const dares = [
  'חובה עליך להגיד על כל אחד את מה שאת הכי אוהבת בו',
  'חובה עליך לאחל לעצמך את הדבר שהכי היית רוצה',
  'חובה עליך לחזור לשיחות הראשונות עם כל אחד מאיתנו ולהעלות זכרונות',
  'חובה עליך לשלוח משהו בסנאפצאט עם הפילגש שישריט את כולן',
  'חובה עליך לדאוג שתהיה לנו תמונה שלנו',
]

function Screen5({ onNext }) {
  const [revealed, setRevealed] = useState(Array(dares.length).fill(false))
  const [cur, setCur]           = useState(0)
  const allRevealed = revealed.every(Boolean)

  const reveal = () => { const n=[...revealed]; n[cur]=true; setRevealed(n) }

  return (
    <div dir="rtl" style={{
      minHeight:'100svh',
      background:'linear-gradient(150deg,#fce4ec 0%,#f8bbd0 30%,#fce4ec 70%,#f3e5f5 100%)',
      display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', padding:'24px 16px 36px', position:'relative',
    }}>
      <div className="race-stripe-top"/>
      <div className="race-stripe-bottom"/>
      <BgDeco items={['💕','❤️','💝','💖','💗','💓','🌸','✨']} count={14}/>

      <div style={{textAlign:'center', marginBottom:24, position:'relative', zIndex:1}}>
        <div style={{fontSize:44, marginBottom:8}}>💕</div>
        <div className="shimmer-love" style={{fontSize:28, fontWeight:900, marginBottom:4}}>אמת או חובה</div>
        <p style={{color:'rgba(136,14,79,0.55)', fontSize:'0.85rem', margin:0}}>משימות מיוחדות לגלי ❤️</p>
      </div>

      {/* Card stack */}
      <div style={{position:'relative', width:'100%', maxWidth:360, marginBottom:22, zIndex:1}}>
        {dares.map((_,i) => i>cur && i<cur+3 && (
          <div key={i} style={{position:'absolute',inset:0,borderRadius:22,background:'#fff',boxShadow:'0 4px 16px rgba(216,27,96,0.1)',border:'1.5px solid rgba(216,27,96,0.12)',transform:`translateY(${(i-cur)*7}px) scale(${1-(i-cur)*0.03})`,zIndex:-(i-cur)}}/>
        ))}
        <div key={cur} className="animate-card-reveal" style={{
          position:'relative', borderRadius:22, background:'#fff',
          border:'2px solid rgba(216,27,96,0.25)',
          boxShadow:'0 8px 40px rgba(216,27,96,0.18)',
          minHeight:220, padding:'24px 20px',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        }}>
          <div style={{position:'absolute',top:12,right:16,color:'rgba(216,27,96,0.4)',fontSize:12,fontWeight:700}}>{cur+1}/{dares.length}</div>
          {!revealed[cur] ? (
            <div onClick={reveal} style={{cursor:'pointer', textAlign:'center', width:'100%', padding:'8px 0'}}>
              {/* Pattern instead of emoji */}
              <div style={{
                width:70, height:70, borderRadius:'50%', margin:'0 auto 18px',
                background:'linear-gradient(135deg,#fce4ec,#f8bbd0)',
                border:'3px solid rgba(216,27,96,0.3)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:32,
              }}>💝</div>
              <p style={{color:'rgba(136,14,79,0.8)', fontSize:'1rem', margin:0, fontWeight:600}}>לחצי לחשיפת המשימה</p>
              <p style={{color:'rgba(136,14,79,0.4)', fontSize:'0.78rem', marginTop:6}}>משימה #{cur+1}</p>
            </div>
          ) : (
            <div className="animate-bounce-in" style={{textAlign:'center'}}>
              <div style={{fontSize:38, marginBottom:14}}>💫</div>
              <p style={{color:'#880e4f', fontWeight:600, fontSize:'1.05rem', lineHeight:1.7}}>{dares[cur]}</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <div style={{display:'flex', gap:16, alignItems:'center', marginBottom:20, position:'relative', zIndex:1}}>
        <button onClick={()=>cur>0&&setCur(c=>c-1)} disabled={cur===0} style={{padding:12,borderRadius:'50%',border:'1.5px solid rgba(216,27,96,0.25)',background:'#fff',color:'#c2185b',cursor:cur>0?'pointer':'not-allowed',opacity:cur>0?1:0.35,transition:'all 0.2s',boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
          <ChevronRight size={22}/>
        </button>
        <div style={{display:'flex', gap:8}}>
          {dares.map((_,i) => (
            <div key={i} onClick={()=>setCur(i)} style={{cursor:'pointer',borderRadius:i===cur?8:'50%',width:i===cur?28:14,height:14,transition:'all 0.3s',background:i===cur?'#c2185b':revealed[i]?'#4caf50':'rgba(216,27,96,0.15)'}}/>
          ))}
        </div>
        <button onClick={()=>cur<dares.length-1&&setCur(c=>c+1)} disabled={cur===dares.length-1} style={{padding:12,borderRadius:'50%',border:'1.5px solid rgba(216,27,96,0.25)',background:'#fff',color:'#c2185b',cursor:cur<dares.length-1?'pointer':'not-allowed',opacity:cur<dares.length-1?1:0.35,transition:'all 0.2s',boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
          <ChevronLeft size={22}/>
        </button>
      </div>

      {!revealed[cur] && (
        <button onClick={reveal} style={{background:'linear-gradient(135deg,#c2185b,#e91e8c)',color:'#fff',fontWeight:800,padding:'14px 32px',borderRadius:'50px',border:'none',cursor:'pointer',fontSize:'1rem',marginBottom:14,boxShadow:'0 4px 20px rgba(194,24,91,0.4)',position:'relative',zIndex:1}}>
          חשפי את המשימה
        </button>
      )}

      {allRevealed && (
        <button onClick={onNext} className="animate-pulse-glow" style={{background:'linear-gradient(135deg,#880e4f,#e91e8c,#f9a825)',color:'#fff',fontWeight:900,padding:'18px 28px',borderRadius:'50px',border:'none',cursor:'pointer',fontSize:'1rem',textAlign:'center',boxShadow:'0 6px 28px rgba(136,14,79,0.5)',transition:'all 0.25s ease',lineHeight:1.45,position:'relative',zIndex:1}}>
          לחץ כאן להגיע לנקודת הסיום של המירוץ למיליון 🏁
        </button>
      )}
    </div>
  )
}

// ─── PHOTO SLIDESHOW ─────────────────────────────────────────────────────────
function PhotoSlideshow({ onEnd }) {
  const [photos]           = useState(() => shuffle([...ALL_PHOTOS]))
  const [idx, setIdx]       = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [ended, setEnded]   = useState(false)
  const timerRef = useRef(null)

  const advance = useCallback(() => {
    setIdx(i => {
      const next = i+1
      if (next >= photos.length) { setEnded(true); onEnd && onEnd(); return i }
      setAnimKey(k => k+1)
      return next
    })
  }, [photos.length, onEnd])

  useEffect(() => {
    if (ended) return
    timerRef.current = setInterval(advance, 4000)
    return () => clearInterval(timerRef.current)
  }, [advance, ended])

  return (
    <div style={{borderRadius:22, overflow:'hidden', boxShadow:'0 8px 48px rgba(136,14,79,0.25)', border:'2px solid rgba(216,27,96,0.25)'}}>
      <div style={{position:'relative', width:'100%', paddingTop:'75%', background:'#fce4ec'}}>
        <img
          key={animKey}
          src={photos[idx]}
          alt=""
          className="photo-zoom-in"
          style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}}
        />
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:3,background:'rgba(255,255,255,0.3)'}}>
          <div style={{height:'100%',background:'linear-gradient(90deg,#880e4f,#e91e8c)',width:`${((idx+1)/photos.length)*100}%`,transition:'width 0.5s ease'}}/>
        </div>
        {ended && (
          <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'rgba(252,228,236,0.92)',backdropFilter:'blur(6px)'}}>
            <div style={{fontSize:52,marginBottom:12}} className="animate-heartbeat">❤️</div>
            <div style={{color:'#880e4f',fontWeight:900,fontSize:'1.8rem',textAlign:'center'}}>מזל טוב יפה שלנו! 🎊</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── SCREEN 6: FINAL ─────────────────────────────────────────────────────────
function Screen6() {
  const [slideshowEnded, setSlideshowEnded] = useState(false)
  const [pitImgOk, setPitImgOk]           = useState(true)

  return (
    <div dir="rtl" style={{
      minHeight:'100svh',
      background:'linear-gradient(150deg,#fff0f7 0%,#fce4ec 40%,#f3e5f5 100%)',
      display:'flex', flexDirection:'column', alignItems:'center',
      padding:'24px 16px 48px', position:'relative', overflow:'hidden',
    }}>
      <Confetti/>
      <FloatingHearts/>
      <div className="race-stripe-top"/>
      <div className="race-stripe-bottom"/>
      <BgDeco items={['❤️','💕','🎊','✨','💝','🌸','💗','⭐']} count={14}/>

      {/* Title */}
      <div style={{textAlign:'center', marginBottom:20, position:'relative', zIndex:1}}>
        <div className="animate-float" style={{fontSize:52, marginBottom:10}}>🏁</div>
        <h1 style={{
          fontSize:'clamp(1.6rem,6vw,2.4rem)', fontWeight:900,
          background:'linear-gradient(135deg,#880e4f,#e91e8c)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
          margin:'0 0 12px',
        }}>
          הגעת לנקודת הסיום! 🏁
        </h1>
        <div style={{display:'flex', justifyContent:'center', gap:8, fontSize:26}}>
          {['🎉','🥳','🎂','❤️','🏆'].map((e,i) => (
            <span key={i} className="animate-float" style={{animationDelay:`${i*0.2}s`}}>{e}</span>
          ))}
        </div>
      </div>

      {/* PIT STOP image */}
      <div style={{width:'100%', maxWidth:440, position:'relative', zIndex:1, marginBottom:20}}>
        {pitImgOk ? (
          <img
            src="/Images/pitstop.png"
            alt="PIT STOP"
            onError={() => setPitImgOk(false)}
            style={{width:'100%', borderRadius:18, boxShadow:'0 8px 32px rgba(136,14,79,0.2)', border:'2px solid rgba(216,27,96,0.2)'}}
          />
        ) : (
          /* Fallback banner if no pitstop image */
          <div style={{
            background:'linear-gradient(135deg,#880e4f,#c2185b)',
            borderRadius:18, padding:'28px 20px', textAlign:'center',
            boxShadow:'0 8px 32px rgba(136,14,79,0.3)',
            border:'2px solid rgba(249,168,37,0.4)',
          }}>
            <div style={{fontSize:52, marginBottom:10}}>🏁</div>
            <div style={{color:'#fff', fontWeight:900, fontSize:'1.6rem', letterSpacing:2}}>PIT STOP</div>
            <div style={{color:'rgba(255,255,255,0.75)', fontSize:'0.9rem', marginTop:6}}>נקודת הסיום של המירוץ למיליון</div>
          </div>
        )}
      </div>

      {/* Slideshow */}
      <div style={{width:'100%', maxWidth:440, position:'relative', zIndex:1, marginBottom:18}}>
        <PhotoSlideshow onEnd={() => setSlideshowEnded(true)}/>
      </div>

      {/* Quote */}
      <div style={{width:'100%', maxWidth:440, position:'relative', zIndex:1, marginBottom:24, textAlign:'center', padding:'0 8px'}}>
        <p style={{
          color:'#880e4f', fontStyle:'italic', fontWeight:500,
          fontSize:'clamp(0.9rem,3.5vw,1.05rem)', lineHeight:2.1, margin:0,
        }}>
          "You can <strong style={{fontStyle:'normal'}}>COUNT ON ME</strong> like 1 2 3....."<br/>
          "Cause that's what friends supposed to do...."
        </p>
      </div>

      {/* Birthday message – appears after slideshow ends */}
      {slideshowEnded && (
        <div className="race-card animate-pop-in" style={{
          width:'100%', maxWidth:440, position:'relative', zIndex:1,
          padding:'30px 26px', textAlign:'center',
          borderColor:'rgba(216,27,96,0.25)', marginBottom:24,
        }}>
          <Heart size={34} fill="currentColor" color="#e91e8c" style={{margin:'0 auto 14px'}} className="animate-heartbeat"/>
          <p style={{
            background:'linear-gradient(135deg,#880e4f,#e91e8c)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            fontWeight:900, fontSize:'clamp(1.35rem,5vw,1.7rem)', margin:'0 0 14px', lineHeight:1.3,
          }}>
            יום הולדת שמח גלי 🎂
          </p>
          <p style={{color:'#3e0020', fontSize:'1.05rem', lineHeight:1.9, margin:'0 0 14px', fontWeight:400}}>
            תמשיכי להיות החברה הכי טובה שאפשר לבקש
          </p>
          <p style={{color:'#c2185b', fontWeight:700, fontSize:'1.1rem', margin:'0 0 8px'}}>
            אוהבים המון ❤️
          </p>
          <p style={{color:'#880e4f', fontWeight:900, fontSize:'1.2rem', margin:0}}>
            תמר נריה ושלי
          </p>
        </div>
      )}

      <div style={{display:'flex', gap:10, marginTop:8, position:'relative', zIndex:1}}>
        {[...Array(5)].map((_,i) => (
          <Heart key={i} size={26} fill="currentColor" color="#e91e8c" className="animate-float" style={{animationDelay:`${i*0.3}s`}}/>
        ))}
      </div>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState(0)
  const { playing, muted, setMuted, playRace, stopRace, playCount } = useAudio()

  const goTo = useCallback((n) => {
    if (n === 3) stopRace()
    if (n === 6) playCount()
    setScreen(n)
    window.scrollTo({ top:0, behavior:'smooth' })
  }, [stopRace, playCount])

  return (
    <div dir="rtl" style={{minHeight:'100svh'}}>
      <MuteButton muted={muted} setMuted={setMuted} visible={playing !== null}/>
      {screen===0 && <Screen0 onNext={()=>goTo(1)}/>}
      {screen===1 && <Screen1 onNext={()=>goTo(2)}/>}
      {screen===2 && <Screen2 onNext={()=>goTo(3)} playRace={playRace}/>}
      {screen===3 && <Screen3 onNext={()=>goTo(4)}/>}
      {screen===4 && <Screen4 onNext={()=>goTo(5)}/>}
      {screen===5 && <Screen5 onNext={()=>goTo(6)}/>}
      {screen===6 && <Screen6/>}
    </div>
  )
}
