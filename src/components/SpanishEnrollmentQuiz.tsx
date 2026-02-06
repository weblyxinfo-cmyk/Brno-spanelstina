'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { courseMatchesLevel } from '@/lib/levelMapping';

// Data
const questions = [
  {
    question: 'Co znamená "Hola"?',
    options: ['Děkuji', 'Ahoj', 'Nashledanou', 'Prosím'],
    correct: 1,
  },
  {
    question: 'Yo ___ de Praga.',
    options: ['es', 'soy', 'está', 'ser'],
    correct: 1,
  },
  {
    question: '¿Cómo ___ llamas?',
    options: ['te', 'se', 'me', 'le'],
    correct: 0,
  },
  {
    question: 'Ayer ___ al cine con mis amigos.',
    options: ['fui', 'iba', 'voy', 'ir'],
    correct: 0,
  },
  {
    question: 'Cuando era niño, ___ mucho al fútbol.',
    options: ['jugué', 'jugaba', 'juego', 'jugar'],
    correct: 1,
  },
  {
    question: 'Jak přeložíte: "Chtěl bych sklenici vody, prosím."',
    options: [
      'Quiero un vaso de agua, por favor.',
      'Quisiera un vaso de agua, por favor.',
      'Tengo un vaso de agua, por favor.',
      'Dame un vaso de agua, por favor.',
    ],
    correct: 1,
  },
  {
    question: 'Espero que ___ buen tiempo mañana.',
    options: ['hace', 'haga', 'hacía', 'hará'],
    correct: 1,
  },
  {
    question: 'Si ___ más dinero, viajaría por todo el mundo.',
    options: ['tengo', 'tuviera', 'tendré', 'tenga'],
    correct: 1,
  },
  {
    question: 'Me dijo que ___ a las ocho.',
    options: ['viene', 'venía', 'vendría', 'venga'],
    correct: 2,
  },
  {
    question: 'Si lo hubiera sabido, no ___ así.',
    options: ['actuara', 'habría actuado', 'actúe', 'actuaba'],
    correct: 1,
  },
];

const experienceOptions = [
  { id: 'none', label: 'Nikdy jsem se španělsky neučil/a', skipQuiz: true },
  { id: 'basics', label: 'Znám pár základních slov (hola, gracias...)', skipQuiz: false },
  { id: 'school', label: 'Učil/a jsem se ve škole nebo v kurzu', skipQuiz: false },
  { id: 'communicate', label: 'Domluvím se v běžných situacích', skipQuiz: false },
  { id: 'fluent', label: 'Mluvím docela plynule', skipQuiz: false },
];

const goalOptions = [
  'Cestování',
  'Práce / kariéra',
  'Studium v zahraničí',
  'Rodina / partner',
  'Kultura (filmy, hudba, knihy)',
  'Jen tak pro radost',
];

// Course schedule data for matching
interface ScheduleCourse {
  uroven: string;
  den: string;
  cas: string;
  popis: string;
  lekci: number;
  cena: string;
  isHighlighted?: boolean;
  badge?: string;
  type: 'morning' | 'afternoon';
}

const allCourses: ScheduleCourse[] = [
  // Morning courses
  { uroven: "začátečníci A1", den: "Dle domluvy", cas: "09:00–10:30", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč", type: 'morning' },
  { uroven: "začátečníci A2", den: "Dle domluvy", cas: "08:00–13:00", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč", type: 'morning' },
  { uroven: "mírně pokročilí B1", den: "čtvrtek", cas: "09:00–10:30", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč", type: 'morning' },
  { uroven: "mírně pokročilí B1 plus", den: "pátek", cas: "08:30–10:00", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč", type: 'morning' },
  { uroven: "začátečníci A1", den: "sobota", cas: "09:00–10:30", popis: "1x90min, max 4 studenti", lekci: 19, cena: "7 600 Kč", isHighlighted: true, badge: "novinka", type: 'morning' },
  // Afternoon courses
  { uroven: "začátečníci A1", den: "čtvrtek / dle domluvy", cas: "14:30–20:15", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč", type: 'afternoon' },
  { uroven: "začátečnický A1+", den: "úterý", cas: "13:00–14:30", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč", type: 'afternoon' },
  { uroven: "začátečníci A2", den: "čtvrtek", cas: "14:00–15:30", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč", type: 'afternoon' },
  { uroven: "mírně pokročilí B1", den: "středa", cas: "17:00–18:30", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč", type: 'afternoon' },
  { uroven: "pokročilí B2", den: "pondělí", cas: "18:45–20:15", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč", type: 'afternoon' },
  { uroven: "pokročilí B2", den: "čtvrtek", cas: "17:00–18:30", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč", type: 'afternoon' },
  { uroven: "pokročilí B2+", den: "pondělí", cas: "18:45–20:15", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč", type: 'afternoon' },
];

const levelDescriptions: Record<string, { name: string; spanish: string; description: string; emoji: string; color: string }> = {
  A1: {
    name: 'Úplný začátečník',
    spanish: 'Primeros pasos',
    description: 'Začnete od nuly! Naučíte se základní fráze, pozdravy, jak se představit a objednat si v restauraci.',
    emoji: '🌱',
    color: '#10b981',
  },
  A2: {
    name: 'Mírně pokročilý začátečník',
    spanish: 'Paso a paso',
    description: 'Základy už máte! Zaměříme se na minulé časy, rozšíření slovní zásoby a praktickou konverzaci.',
    emoji: '🌿',
    color: '#059669',
  },
  'A2-B1': {
    name: 'Přechodová úroveň',
    spanish: 'En camino',
    description: 'Jste na cestě k pokročilejší španělštině. Upevníte základy a připravíte se na subjuntiv.',
    emoji: '🌳',
    color: '#0d9488',
  },
  B1: {
    name: 'Středně pokročilý',
    spanish: 'Avanzando',
    description: 'Skvělá práce! Ponoříme se do subjuntivu, kondicionálu a naučíte se plynule konverzovat.',
    emoji: '🔥',
    color: '#E07B53',
  },
  'B1+': {
    name: 'Vyšší středně pokročilý',
    spanish: 'Más allá',
    description: 'Výborně! Jste připraveni na složitější konverzace a přípravu na certifikát DELE B1.',
    emoji: '⭐',
    color: '#ef4444',
  },
  'B2+': {
    name: 'Pokročilý',
    spanish: 'Nivel superior',
    description: '¡Impresionante! Doporučujeme konverzační kurz nebo přípravu na DELE B2/C1.',
    emoji: '🏆',
    color: '#8b5cf6',
  },
};

function getLevel(score: number): string {
  if (score <= 2) return 'A1';
  if (score <= 4) return 'A2';
  if (score <= 6) return 'A2-B1';
  if (score <= 8) return 'B1';
  if (score === 9) return 'B1+';
  return 'B2+';
}

type Step = 'intro' | 'form' | 'quiz' | 'result';

interface FormData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  goals: string[];
}

export default function SpanishEnrollmentQuiz() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('intro');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    experience: '',
    goals: [],
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [resultLevel, setResultLevel] = useState('');

  const isFormValid = formData.name && formData.email && formData.experience;

  // Get courses matching the result level
  const matchingCourses = resultLevel
    ? allCourses.filter(course => courseMatchesLevel(course.uroven, resultLevel))
    : [];

  const handleFormSubmit = () => {
    const exp = experienceOptions.find(o => o.id === formData.experience);
    if (exp?.skipQuiz) {
      setResultLevel('A1');
      setStep('result');
    } else {
      setStep('quiz');
    }
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    const newScore = isCorrect ? score + 1 : score;

    if (currentQuestion === questions.length - 1) {
      setScore(newScore);
      setResultLevel(getLevel(newScore));
      setStep('result');
    } else {
      setScore(newScore);
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const handleReset = () => {
    setStep('intro');
    setFormData({ name: '', email: '', phone: '', experience: '', goals: [] });
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setResultLevel('');
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const level = levelDescriptions[resultLevel];
  const contactUrl = `/kontakt?level=${resultLevel}&name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}`;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFE5E5 0%, #FFDDD3 50%, #E07B53 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Outfit', sans-serif",
    }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
      `}</style>

      {/* INTRO */}
      {step === 'intro' && (
        <div style={{
          background: 'white',
          borderRadius: '32px',
          padding: '48px 40px',
          maxWidth: '580px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🇪🇸</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '36px',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '16px',
          }}>
            Začněte se španělštinou!
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '18px',
            lineHeight: 1.6,
            marginBottom: '32px',
          }}>
            Vyplňte krátký dotazník a zjistěte, do které skupiny patříte. Zabere vám to jen 2 minuty.
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            marginBottom: '40px',
            flexWrap: 'wrap',
          }}>
            {[
              { value: '6', label: 'úrovní' },
              { value: '2', label: 'minuty' },
              { value: '1', label: 'zkušební lekce zdarma' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#C4613D' }}>{stat.value}</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep('form')}
            style={{
              background: 'linear-gradient(135deg, #E07B53, #C4613D)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '18px 40px',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 10px 30px -5px rgba(217, 119, 6, 0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 15px 35px -5px rgba(217, 119, 6, 0.5)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px -5px rgba(217, 119, 6, 0.4)';
            }}
          >
            Zjistit svoji úroveň →
          </button>
        </div>
      )}

      {/* FORM */}
      {step === 'form' && (
        <div style={{
          background: 'white',
          borderRadius: '32px',
          padding: '40px',
          maxWidth: '580px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '28px',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '8px',
            textAlign: 'center',
          }}>
            Řekněte nám o sobě
          </h2>
          <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '32px' }}>
            Pomůže nám to najít pro vás ten správný kurz
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                Jméno a příjmení *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jan Novák"
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#E07B53'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                E-mail *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="jan@email.cz"
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#E07B53'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Phone */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                Telefon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+420 123 456 789"
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#E07B53'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Experience */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
                Zkušenosti se španělštinou *
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {experienceOptions.map(option => (
                  <div
                    key={option.id}
                    onClick={() => setFormData({ ...formData, experience: option.id })}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: `2px solid ${formData.experience === option.id ? '#E07B53' : '#e5e7eb'}`,
                      background: formData.experience === option.id ? '#FFE5E5' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '15px',
                      color: '#374151',
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
                Proč se chcete učit španělsky?
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {goalOptions.map(goal => (
                  <div
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '50px',
                      border: `2px solid ${formData.goals.includes(goal) ? '#E07B53' : '#e5e7eb'}`,
                      background: formData.goals.includes(goal) ? '#FFE5E5' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '14px',
                      color: '#374151',
                    }}
                  >
                    {goal}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleFormSubmit}
              disabled={!isFormValid}
              style={{
                background: isFormValid ? 'linear-gradient(135deg, #E07B53, #C4613D)' : '#e5e7eb',
                color: isFormValid ? 'white' : '#9ca3af',
                border: 'none',
                borderRadius: '16px',
                padding: '18px 40px',
                fontSize: '18px',
                fontWeight: 600,
                cursor: isFormValid ? 'pointer' : 'not-allowed',
                boxShadow: isFormValid ? '0 10px 30px -5px rgba(217, 119, 6, 0.4)' : 'none',
                transition: 'all 0.2s',
                marginTop: '16px',
              }}
            >
              Pokračovat →
            </button>
          </div>
        </div>
      )}

      {/* QUIZ */}
      {step === 'quiz' && (
        <div style={{
          background: 'white',
          borderRadius: '32px',
          padding: '40px',
          maxWidth: '580px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        }}>
          {/* Progress */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                Otázka {currentQuestion + 1} z {questions.length}
              </span>
              <span style={{ fontSize: '14px', color: '#10b981', fontWeight: 600 }}>
                {score} správně
              </span>
            </div>
            <div style={{
              background: '#e5e7eb',
              borderRadius: '10px',
              height: '8px',
              overflow: 'hidden',
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #E07B53, #C4613D)',
                height: '100%',
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                borderRadius: '10px',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>

          {/* Question */}
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '24px',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '28px',
            lineHeight: 1.4,
          }}>
            {questions[currentQuestion].question}
          </h2>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {questions[currentQuestion].options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleAnswerSelect(index)}
                style={{
                  padding: '16px 20px',
                  borderRadius: '14px',
                  border: `2px solid ${selectedAnswer === index ? '#E07B53' : '#e5e7eb'}`,
                  background: selectedAnswer === index ? '#FFE5E5' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '16px',
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <span style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: selectedAnswer === index ? '#E07B53' : '#f3f4f6',
                  color: selectedAnswer === index ? 'white' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '14px',
                  flexShrink: 0,
                }}>
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </div>
            ))}
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            style={{
              width: '100%',
              background: selectedAnswer !== null ? 'linear-gradient(135deg, #E07B53, #C4613D)' : '#e5e7eb',
              color: selectedAnswer !== null ? 'white' : '#9ca3af',
              border: 'none',
              borderRadius: '16px',
              padding: '18px 40px',
              fontSize: '18px',
              fontWeight: 600,
              cursor: selectedAnswer !== null ? 'pointer' : 'not-allowed',
              boxShadow: selectedAnswer !== null ? '0 10px 30px -5px rgba(217, 119, 6, 0.4)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {currentQuestion === questions.length - 1 ? 'Zobrazit výsledek' : 'Další otázka →'}
          </button>
        </div>
      )}

      {/* RESULT */}
      {step === 'result' && level && (
        <div style={{
          background: 'white',
          borderRadius: '32px',
          padding: '48px 40px',
          maxWidth: '680px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          textAlign: 'center',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>{level.emoji}</div>

          <div style={{
            display: 'inline-block',
            background: '#FFE5E5',
            color: '#C4613D',
            padding: '8px 20px',
            borderRadius: '50px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            Doporučená úroveň
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '64px',
            fontWeight: 700,
            color: level.color,
            marginBottom: '8px',
          }}>
            {resultLevel}
          </h1>

          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#1f2937',
            marginBottom: '4px',
          }}>
            {level.name}
          </h2>

          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            color: '#6b7280',
            fontSize: '18px',
            marginBottom: '24px',
          }}>
            {level.spanish}
          </p>

          <p style={{
            color: '#4b5563',
            fontSize: '16px',
            lineHeight: 1.7,
            marginBottom: '32px',
            padding: '0 16px',
          }}>
            {level.description}
          </p>

          {/* Matching Courses */}
          {matchingCourses.length > 0 && (
            <div style={{
              background: '#f9fafb',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
              textAlign: 'left',
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Doporučené kurzy pro vás ({matchingCourses.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {matchingCourses.slice(0, 4).map((course, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '16px',
                      border: course.isHighlighted ? '2px solid #E07B53' : '1px solid #e5e7eb',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#1f2937', textTransform: 'capitalize' }}>
                        {course.uroven}
                      </span>
                      {course.badge && (
                        <span style={{
                          background: '#E07B53',
                          color: 'white',
                          padding: '4px 10px',
                          borderRadius: '50px',
                          fontSize: '10px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}>
                          {course.badge}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280', flexWrap: 'wrap' }}>
                      <span>{course.type === 'morning' ? '🌅' : '🌇'} {course.den}</span>
                      <span>🕐 {course.cas}</span>
                      <span style={{ fontWeight: 600, color: '#1f2937' }}>{course.cena}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div style={{
            background: '#f9fafb',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '32px',
            textAlign: 'left',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Vaše údaje
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Jméno:</span>
                <span style={{ fontWeight: 600, color: '#1f2937' }}>{formData.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>E-mail:</span>
                <span style={{ fontWeight: 600, color: '#1f2937' }}>{formData.email}</span>
              </div>
              {formData.phone && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Telefon:</span>
                  <span style={{ fontWeight: 600, color: '#1f2937' }}>{formData.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* CTA - Navigate to courses page with level filter */}
          <button
            onClick={() => {
              const params = new URLSearchParams({
                level: resultLevel,
                name: formData.name,
                email: formData.email,
                phone: formData.phone || '',
              });
              router.push(`/kurzy?${params.toString()}`);
            }}
            style={{
              display: 'block',
              width: '100%',
              background: 'linear-gradient(135deg, #E07B53, #C4613D)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '18px 40px',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 10px 30px -5px rgba(217, 119, 6, 0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              marginBottom: '16px',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 15px 35px -5px rgba(217, 119, 6, 0.5)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px -5px rgba(217, 119, 6, 0.4)';
            }}
          >
            Rezervovat kurz →
          </button>

          <button
            onClick={handleReset}
            style={{
              background: 'transparent',
              color: '#6b7280',
              border: 'none',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.color = '#1f2937'}
            onMouseOut={e => e.currentTarget.style.color = '#6b7280'}
          >
            Zkusit znovu
          </button>
        </div>
      )}
    </div>
  );
}
