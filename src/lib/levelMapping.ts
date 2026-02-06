/**
 * Mapping between quiz result levels and course schedule levels
 * Quiz levels: A1, A2, A2-B1, B1, B1+, B2+
 * Course levels: začátečníci A1, začátečnický A1+, začátečníci A2, mírně pokročilí B1, mírně pokročilí B1 plus, pokročilí B2, pokročilí B2+
 */

export interface LevelMapping {
  quizLevel: string;
  coursePatterns: string[];
  displayName: string;
  description: string;
}

export const levelMappings: LevelMapping[] = [
  {
    quizLevel: "A1",
    coursePatterns: ["začátečníci a1", "začátečnický a1"],
    displayName: "Začátečník A1",
    description: "Kurzy pro úplné začátečníky",
  },
  {
    quizLevel: "A2",
    coursePatterns: ["začátečníci a2", "a1+", "začátečnický a1+"],
    displayName: "Mírně pokročilý začátečník A2",
    description: "Kurzy pro ty, kdo znají základy",
  },
  {
    quizLevel: "A2-B1",
    coursePatterns: ["začátečníci a2", "mírně pokročilí b1"],
    displayName: "Přechodová úroveň A2-B1",
    description: "Kurzy pro přechod k pokročilejší španělštině",
  },
  {
    quizLevel: "B1",
    coursePatterns: ["mírně pokročilí b1"],
    displayName: "Středně pokročilý B1",
    description: "Kurzy pro středně pokročilé",
  },
  {
    quizLevel: "B1+",
    coursePatterns: ["mírně pokročilí b1 plus", "b1+", "b1 plus"],
    displayName: "Vyšší středně pokročilý B1+",
    description: "Kurzy pro vyšší středně pokročilé",
  },
  {
    quizLevel: "B2+",
    coursePatterns: ["pokročilí b2", "b2+", "b2 plus"],
    displayName: "Pokročilý B2+",
    description: "Kurzy pro pokročilé studenty",
  },
];

/**
 * Get course patterns for a given quiz level
 */
export function getCoursePatterns(quizLevel: string): string[] {
  const mapping = levelMappings.find((m) => m.quizLevel === quizLevel);
  return mapping?.coursePatterns || [];
}

/**
 * Check if a course matches a quiz level
 */
export function courseMatchesLevel(courseLevel: string, quizLevel: string): boolean {
  const patterns = getCoursePatterns(quizLevel);
  const normalizedCourse = courseLevel.toLowerCase().trim();

  return patterns.some((pattern) => normalizedCourse.includes(pattern.toLowerCase()));
}

/**
 * Get display info for a quiz level
 */
export function getLevelInfo(quizLevel: string): LevelMapping | undefined {
  return levelMappings.find((m) => m.quizLevel === quizLevel);
}

/**
 * Normalize course level string for comparison
 */
export function normalizeCourseLevel(level: string): string {
  return level
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .trim();
}
