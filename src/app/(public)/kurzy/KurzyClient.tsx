"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Calendar,
  Clock,
  Target,
  Zap,
  User,
  Trophy,
  Briefcase,
  Castle,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CourseTable, { type ScheduleCourse } from "@/components/CourseTable";
import CalendarReservationModal from "@/components/CalendarReservationModal";
import { type CalendarCourse } from "@/components/MonthlyCalendar";
import { courseMatchesLevel, getLevelInfo } from "@/lib/levelMapping";
import { staticSemesterCourses } from "@/lib/db/seedSemesterCourses";
import { submitSemesterEnrollment } from "@/app/actions/semester-enrollment";

// ============ JARNÍ KURZY DATA ============

const morningCourses: ScheduleCourse[] = [
  { uroven: "začátečníci A1", den: "Dle domluvy", cas: "09:00–10:30", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč" },
  { uroven: "začátečníci A2", den: "Dle domluvy", cas: "08:00–13:00", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč" },
  { uroven: "mírně pokročilí B1", den: "čtvrtek", cas: "09:00–10:30", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč" },
  { uroven: "mírně pokročilí B1 plus", den: "pátek", cas: "08:30–10:00", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč" },
  { uroven: "začátečníci A1", den: "sobota", cas: "09:00–10:30", popis: "1x90min, max 4 studenti", lekci: 19, cena: "7 600 Kč", isHighlighted: true, badge: "novinka" },
];

const afternoonCourses: ScheduleCourse[] = [
  { uroven: "začátečníci A1", den: "čtvrtek / dle domluvy", cas: "14:30–20:15", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč" },
  { uroven: "začátečnický A1+", den: "úterý", cas: "13:00–14:30", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč" },
  { uroven: "začátečníci A2", den: "čtvrtek", cas: "14:00–15:30", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč" },
  { uroven: "mírně pokročilí B1", den: "středa", cas: "17:00–18:30", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč" },
  { uroven: "pokročilí B2", den: "pondělí", cas: "18:45–20:15", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč" },
  { uroven: "pokročilí B2", den: "čtvrtek", cas: "17:00–18:30", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč" },
  { uroven: "pokročilí B2+", den: "pondělí", cas: "18:45–20:15", popis: "1x90min, max 4 studenti", lekci: 19, cena: "6 175 Kč" },
];

// Course images mapping - by category
const courseImagesByCategory: Record<string, string> = {
  skupinove: "/images/kurzy/skupinove.avif",
  individualni: "/images/kurzy/individualni.jpg",
  intenzivni: "/images/kurzy/intenzivni.avif",
  specializovane: "/kurzy/dele.jpg",
};

// Course images mapping - by specific course title (overrides category)
const courseImagesByTitle: Record<string, string> = {
  "Erasmus v Telči": "/images/kurzy/erasmus.jpg",
  "Obchodní španělština": "/kurzy/obchodni.jpg",
};

// Helper to get course image
function getCourseImage(title: string, category: string): string | undefined {
  return courseImagesByTitle[title] || courseImagesByCategory[category];
}

const filters = [
  { id: "all", label: "Všechny kurzy" },
  { id: "skupinove", label: "Skupinové" },
  { id: "individualni", label: "Individuální" },
  { id: "intenzivni", label: "Intenzivní" },
  { id: "specializovane", label: "Specializované" },
];

const iconMap: Record<string, React.ElementType> = {
  Users,
  Calendar,
  Clock,
  Target,
  Zap,
  User,
  Trophy,
  Briefcase,
  Castle,
};

interface Course {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  icon: string | null;
  badge: string | null;
  category: string;
  featured: boolean | null;
}

interface PricingPlan {
  id: number;
  icon: string | null;
  name: string;
  description: string | null;
  price: string;
  period: string | null;
  features: string[];
  featured: boolean | null;
}

interface ContentMap {
  [section: string]: { [key: string]: string };
}

interface KurzyClientProps {
  courses: Course[];
  pricing: PricingPlan[];
  content: ContentMap;
}

const courseDetails: Record<string, Array<{ icon: string; text: string }>> = {
  skupinove: [
    { icon: "Users", text: "Max 4 studenti" },
    { icon: "Calendar", text: "Zimní semestr od 15.9.2025" },
    { icon: "Clock", text: "2× týdně 90 min" },
    { icon: "Target", text: "Všechny úrovně" },
  ],
  intenzivni: [
    { icon: "Zap", text: "Intenzivní" },
    { icon: "Calendar", text: "4.8. – 12.9.2025" },
    { icon: "Clock", text: "Dvoutýdenní cykly" },
  ],
  individualni: [
    { icon: "User", text: "1 na 1" },
    { icon: "Clock", text: "Flexibilní termíny" },
    { icon: "Target", text: "Na míru" },
  ],
  specializovane: [
    { icon: "Trophy", text: "Certifikát" },
    { icon: "Target", text: "Specializace" },
  ],
};

// Helper to get content with fallback
function c(content: ContentMap, section: string, key: string, fallback: string): string {
  return content[section]?.[key] || fallback;
}

// Combine all courses for the modal dropdown
const allScheduleCourses: ScheduleCourse[] = [...morningCourses, ...afternoonCourses];

// Convert static semester courses to CalendarCourse format
const calendarCourses: CalendarCourse[] = staticSemesterCourses.map((course) => ({
  id: course.id,
  level: course.level,
  dayOfWeek: course.dayOfWeek,
  timeStart: course.timeStart,
  timeEnd: course.timeEnd,
  description: course.description,
  lessonsCount: course.lessonsCount,
  priceCzk: course.priceCzk,
  maxStudents: course.maxStudents,
  currentStudents: course.currentStudents,
  availableSpots: course.availableSpots,
  type: course.type as "morning" | "afternoon",
  isHighlighted: course.isHighlighted || false,
  badge: course.badge || null,
  isFull: course.isFull,
  almostFull: course.almostFull,
  semesterStart: course.semesterStart,
  semesterEnd: course.semesterEnd,
}));

export default function KurzyClient({ courses, pricing, content }: KurzyClientProps) {
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [quizUserData, setQuizUserData] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [quizLevel, setQuizLevel] = useState<string | null>(null);
  const [showQuizBanner, setShowQuizBanner] = useState(false);

  // Handle URL parameters from quiz
  useEffect(() => {
    const level = searchParams.get("level");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");

    if (level && name && email) {
      setQuizLevel(level);
      setQuizUserData({
        name: decodeURIComponent(name),
        email: decodeURIComponent(email),
        phone: phone ? decodeURIComponent(phone) : "",
      });
      setShowQuizBanner(true);

      // Find matching calendar courses
      const matchingCourses = calendarCourses.filter((course) =>
        courseMatchesLevel(course.level, level) && !course.isFull
      );

      if (matchingCourses.length > 0) {
        // Small delay to ensure smooth transition
        setTimeout(() => {
          setSelectedCourseId(matchingCourses[0].id);
          setIsModalOpen(true);
        }, 500);
      } else {
        setTimeout(() => {
          setIsModalOpen(true);
        }, 500);
      }
    }
  }, [searchParams]);

  // Get courses filtered by quiz level
  const getRecommendedCourses = () => {
    if (!quizLevel) return calendarCourses;
    const recommended = calendarCourses.filter((course) =>
      courseMatchesLevel(course.level, quizLevel)
    );
    // If no recommended courses, return all
    return recommended.length > 0 ? recommended : calendarCourses;
  };

  const recommendedCourses = getRecommendedCourses();
  const levelInfo = quizLevel ? getLevelInfo(quizLevel) : null;

  const handleReserveCourse = (course: ScheduleCourse) => {
    // Find matching calendar course
    const calendarCourse = calendarCourses.find(
      (c) => c.level.toLowerCase() === course.uroven.toLowerCase() &&
             c.dayOfWeek.toLowerCase().includes(course.den.toLowerCase().split(" ")[0])
    );
    if (calendarCourse) {
      setSelectedCourseId(calendarCourse.id);
    } else {
      setSelectedCourseId(null);
    }
    setIsModalOpen(true);
  };

  const handleOpenModalWithoutCourse = () => {
    setSelectedCourseId(null);
    setIsModalOpen(true);
  };

  const handleEnrollmentSubmit = async (data: {
    courseId: number;
    name: string;
    email: string;
    phone: string;
    message: string;
    quizLevel?: string;
  }) => {
    return submitSemesterEnrollment(data);
  };

  const filteredCourses =
    activeFilter === "all"
      ? courses
      : courses.filter((course) => course.category === activeFilter);

  // Get dynamic content with fallbacks
  const heroTitle = c(content, "hero", "title", "Vyberte si svůj kurz");
  const heroSubtitle = c(content, "hero", "subtitle", "kurz");
  const heroDescription = c(content, "hero", "description", "Od prvních slov po plynulou konverzaci. Najdeme cestu, která sedí právě vám – ať už preferujete skupinu nebo individuální výuku.");
  const ctaTitle = c(content, "cta", "title", "Nevíte, který kurz vybrat?");
  const ctaDescription = c(content, "cta", "description", "Přijďte na bezplatnou konzultaci. Probereme vaše cíle, úroveň a najdeme kurz, který vám bude sedět.");

  return (
    <div className="bg-[#FBF9F6]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#FFE5E5] to-transparent opacity-40 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-white text-[#E07B53] px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm mb-6 uppercase tracking-wider">
              <span>📚</span> Nabídka kurzů
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1F1A17] leading-tight mb-6"
          >
            {heroTitle.replace(heroSubtitle, "").trim()}{" "}
            <span className="font-[family-name:var(--font-playfair)] italic font-medium text-[#E07B53]">
              {heroSubtitle}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-[#6B5D54] leading-relaxed max-w-2xl mx-auto"
          >
            {heroDescription}
          </motion.p>

          {/* User type selection - only show if not coming from quiz */}
          {!quizLevel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              {/* New student - go to quiz */}
              <Link
                href="/kviz"
                className="group flex items-center gap-4 bg-white border-2 border-[#EBE6DF] hover:border-[#E07B53] rounded-2xl px-6 py-4 transition-all duration-200 hover:shadow-lg"
              >
                <span className="text-3xl">🎯</span>
                <div className="text-left">
                  <p className="font-bold text-[#1F1A17] group-hover:text-[#E07B53] transition-colors">
                    Jsem nový student
                  </p>
                  <p className="text-sm text-[#6B5D54]">
                    Nevím jakou mám úroveň
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#6B5D54] group-hover:text-[#E07B53] transition-colors ml-2" />
              </Link>

              {/* Existing student - scroll to courses */}
              <button
                onClick={() => {
                  document.getElementById("jarni-kurzy")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group flex items-center gap-4 bg-white border-2 border-[#EBE6DF] hover:border-[#E07B53] rounded-2xl px-6 py-4 transition-all duration-200 hover:shadow-lg"
              >
                <span className="text-3xl">📚</span>
                <div className="text-left">
                  <p className="font-bold text-[#1F1A17] group-hover:text-[#E07B53] transition-colors">
                    Již navštěvuji kurzy
                  </p>
                  <p className="text-sm text-[#6B5D54]">
                    Znám svou úroveň
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#6B5D54] group-hover:text-[#E07B53] transition-colors ml-2" />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Quiz Result Banner */}
      {showQuizBanner && quizLevel && levelInfo && (
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pb-8"
        >
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-[#E07B53] to-[#C4613D] rounded-3xl p-6 text-white relative overflow-hidden">
              <button
                onClick={() => setShowQuizBanner(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <span className="sr-only">Zavřít</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="text-6xl">🎉</div>
                <div className="flex-1 text-center md:text-left">
                  <p className="text-white/80 text-sm uppercase tracking-wider mb-1">
                    Váš výsledek z testu
                  </p>
                  <h3 className="text-2xl font-bold mb-2">
                    Doporučená úroveň: {quizLevel} – {levelInfo.displayName}
                  </h3>
                  <p className="text-white/90">
                    {quizUserData?.name}, našli jsme pro vás {recommendedCourses.length} vhodných kurzů.
                    Vyberte si termín, který vám vyhovuje.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (recommendedCourses.length > 0 && !recommendedCourses[0].isFull) {
                      setSelectedCourseId(recommendedCourses[0].id);
                    } else {
                      setSelectedCourseId(null);
                    }
                    setIsModalOpen(true);
                  }}
                  className="bg-white text-[#E07B53] px-6 py-3 rounded-full font-bold hover:bg-white/90 transition-colors whitespace-nowrap"
                >
                  Rezervovat kurz
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Filter Tabs */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="px-6 mb-12"
      >
        <div className="flex flex-wrap justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 border-2 ${
                activeFilter === filter.id
                  ? "bg-[#E07B53] border-[#E07B53] text-white"
                  : "bg-white border-[#EBE6DF] text-[#6B5D54] hover:border-[#E07B53] hover:text-[#E07B53]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </motion.section>

      {/* Courses Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredCourses.map((course, index) => {
              const details = courseDetails[course.category] || courseDetails.specializovane;
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-white rounded-[32px] overflow-hidden border-2 border-transparent hover:border-[#E07B53] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                    course.featured ? "lg:col-span-2" : ""
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Image */}
                    <div className="relative bg-gradient-to-br from-[#FFE5E5] to-[#EBE6DF] flex items-center justify-center min-h-[280px]">
                      {getCourseImage(course.title, course.category) ? (
                        <Image
                          src={getCourseImage(course.title, course.category)!}
                          alt={course.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <span className="text-7xl">{course.icon}</span>
                      )}
                      {course.badge && (
                        <span className="absolute top-4 left-4 bg-[#E07B53] text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide z-10">
                          {course.badge}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-8 flex flex-col">
                      <h3 className="text-2xl font-bold text-[#1F1A17] mb-1">
                        {course.title}
                      </h3>
                      <p className="font-[family-name:var(--font-playfair)] italic text-[#E07B53] mb-4">
                        {course.subtitle}
                      </p>
                      <p className="text-[#6B5D54] leading-relaxed mb-6 flex-grow">
                        {course.description}
                      </p>

                      {/* Details */}
                      <div className="flex flex-wrap gap-4 mb-6 pt-6 border-t border-[#EBE6DF]">
                        {details.map((detail, i) => {
                          const IconComponent = iconMap[detail.icon] || Target;
                          return (
                            <span
                              key={i}
                              className="flex items-center gap-2 text-sm text-[#6B5D54]"
                            >
                              <IconComponent className="w-4 h-4" />
                              {detail.text}
                            </span>
                          );
                        })}
                      </div>

                      <Link
                        href="/kontakt"
                        className="inline-flex items-center justify-center gap-2 bg-[#FBF9F6] text-[#1F1A17] px-6 py-3 rounded-full font-semibold hover:bg-[#E07B53] hover:text-white transition-all duration-200 self-start"
                      >
                        Více informací
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Spring Semester Schedule */}
      <section id="jarni-kurzy" className="py-20 px-6 scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          {/* Semester heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 bg-white text-[#E07B53] px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm mb-6 uppercase tracking-wider">
              <span>📅</span> Jarní semestr 2026
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1A17] mb-4">
              Jarní{" "}
              <span className="font-[family-name:var(--font-playfair)] italic font-medium text-[#E07B53]">
                kurzy
              </span>
            </h2>
            <p className="text-lg text-[#6B5D54]">
              16. 2. 2026 – 26. 6. 2026
            </p>
          </motion.div>

          {/* Morning courses */}
          <div className="mb-12">
            <CourseTable
              title="Dopolední kurzy"
              icon="🌅"
              courses={morningCourses}
              onReserveCourse={handleReserveCourse}
            />
          </div>

          {/* Afternoon courses */}
          <div className="mb-12">
            <CourseTable
              title="Odpolední kurzy"
              icon="🌇"
              courses={afternoonCourses}
              onReserveCourse={handleReserveCourse}
            />
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <button
              onClick={handleOpenModalWithoutCourse}
              className="inline-flex items-center justify-center gap-2 bg-[#E07B53] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-[#E07B53]/30 hover:bg-[#C4613D] hover:-translate-y-1 transition-all duration-200"
            >
              Mám zájem o kurz
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-[#1F1A17]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Transparentní{" "}
              <span className="font-[family-name:var(--font-playfair)] italic font-medium text-[#FFE5E5]">
                ceník
              </span>
            </h2>
            <p className="text-lg text-white/70">
              Žádné skryté poplatky. Víte přesně, co platíte.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-[32px] p-8 text-center text-white transition-all duration-300 hover:-translate-y-1 ${
                  plan.featured
                    ? "bg-[#E07B53] scale-105"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                <span className="text-5xl mb-4 block">{plan.icon}</span>
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm opacity-80 mb-6">{plan.description}</p>

                <p className="font-[family-name:var(--font-playfair)] text-4xl font-bold mb-1">
                  {plan.price}
                </p>
                <p className="text-sm opacity-70 mb-8">{plan.period}</p>

                <ul className="text-left mb-8 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/kontakt"
                  className={`block w-full py-4 rounded-full font-semibold transition-all duration-200 hover:scale-105 ${
                    plan.featured
                      ? "bg-[#1F1A17] text-white"
                      : "bg-white text-[#1F1A17]"
                  }`}
                >
                  Mám zájem
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-[#FBF9F6]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1A17] mb-4">
              Co u nás{" "}
              <span className="font-[family-name:var(--font-playfair)] italic text-[#E07B53]">
                získáte
              </span>
            </h2>
            <p className="text-lg text-[#6B5D54]">
              Nejen kvalitní výuku, ale i příjemné zázemí
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: "🎁", text: "První hodina zdarma" },
              { icon: "☕", text: "Káva a čaj zdarma" },
              { icon: "🅿️", text: "Možnost parkování" },
              { icon: "📚", text: "Zapůjčení učebnic" },
              { icon: "👥", text: "Max 4 studenti" },
              { icon: "👨‍🏫", text: "2 lektoři střídavě" },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <span className="text-3xl mb-2 block">{benefit.icon}</span>
                <p className="text-sm font-medium text-[#1F1A17]">{benefit.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1A17] mb-4">
              {ctaTitle.includes(" ") ? (
                <>
                  {ctaTitle.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="font-[family-name:var(--font-playfair)] italic text-[#E07B53]">
                    {ctaTitle.split(" ").slice(-1)}
                  </span>
                </>
              ) : ctaTitle}
            </h2>
            <p className="text-lg text-[#6B5D54] mb-8 max-w-xl mx-auto">
              {ctaDescription}
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center gap-2 bg-[#E07B53] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-[#E07B53]/30 hover:bg-[#C4613D] hover:-translate-y-1 transition-all duration-200"
            >
              Domluvit konzultaci zdarma
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Calendar Reservation Modal */}
      <CalendarReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courses={quizLevel ? recommendedCourses : calendarCourses}
        preselectedCourseId={selectedCourseId}
        prefillData={quizUserData}
        quizLevel={quizLevel}
        onSubmit={handleEnrollmentSubmit}
      />
    </div>
  );
}
