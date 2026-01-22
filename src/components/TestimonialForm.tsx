"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send } from "lucide-react";
import { submitTestimonial } from "@/app/actions/testimonials";

const courseTypes = [
  "Skupinový kurz",
  "Individuální výuka",
  "Intenzivní kurz",
  "Příprava na DELE",
  "Obchodní španělština",
  "Konverzace",
];

interface ValidationError {
  field: string;
  message: string;
}

export default function TestimonialForm() {
  const [formData, setFormData] = useState({
    author: "",
    text: "",
    course: "",
    rating: 5,
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const getFieldError = (field: string): string | undefined => {
    return errors.find((e) => e.field === field)?.message;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (!formData.author || formData.author.trim().length < 2) {
      newErrors.push({ field: "author", message: "Jméno musí mít alespoň 2 znaky." });
    }
    if (formData.author && formData.author.length > 100) {
      newErrors.push({ field: "author", message: "Jméno je příliš dlouhé." });
    }

    if (!formData.text || formData.text.trim().length < 20) {
      newErrors.push({ field: "text", message: "Recenze musí mít alespoň 20 znaků." });
    }
    if (formData.text && formData.text.length > 1000) {
      newErrors.push({ field: "text", message: "Recenze je příliš dlouhá (max 1000 znaků)." });
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.push({ field: "rating", message: "Hodnocení musí být mezi 1 a 5." });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const result = await submitTestimonial({
      author: formData.author,
      text: formData.text,
      course: formData.course || undefined,
      rating: formData.rating,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmitted(true);
      setFormData({ author: "", text: "", course: "", rating: 5 });
    } else if (result.errors) {
      setErrors(result.errors);
    } else if (result.error) {
      setErrors([{ field: "general", message: result.error }]);
    }
  }

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1A17] mb-4">
            Přidejte svou{" "}
            <span className="font-[family-name:var(--font-playfair)] italic text-[#C41E3A]">
              referenci
            </span>
          </h2>
          <p className="text-[#6B5D54]">
            Byli jste u nás na kurzu? Podělte se o svou zkušenost s ostatními.
          </p>
        </motion.div>

        {!showForm && !submitted && (
          <div className="text-center">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-[#C41E3A] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#9E1830] hover:-translate-y-1 transition-all duration-200"
            >
              Napsat recenzi
              <Star className="h-5 w-5" />
            </button>
          </div>
        )}

        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FBF9F6] rounded-[32px] p-8 text-center"
          >
            <span className="text-6xl mb-4 block">&#10004;</span>
            <h3 className="text-xl font-bold text-[#1F1A17] mb-2">
              Děkujeme za vaši recenzi!
            </h3>
            <p className="text-[#6B5D54] mb-6">
              Vaše recenze bude zveřejněna po schválení administrátorem.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setShowForm(false);
              }}
              className="text-[#C41E3A] font-semibold hover:underline"
            >
              Napsat další recenzi
            </button>
          </motion.div>
        )}

        {showForm && !submitted && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-[#FBF9F6] rounded-[32px] p-8 space-y-6"
          >
            {/* General error message */}
            {getFieldError("general") && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
                {getFieldError("general")}
              </div>
            )}

            {/* Name field */}
            <div>
              <label
                htmlFor="author"
                className="block text-sm font-semibold text-[#1F1A17] mb-2"
              >
                Vaše jméno *
              </label>
              <input
                type="text"
                id="author"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className={`w-full px-5 py-4 rounded-2xl border-2 ${
                  getFieldError("author")
                    ? "border-red-400 focus:border-red-500"
                    : "border-[#EBE6DF] focus:border-[#C41E3A]"
                } focus:outline-none transition-colors bg-white`}
                placeholder="Jan N."
              />
              {getFieldError("author") && (
                <p className="text-red-500 text-sm mt-1">{getFieldError("author")}</p>
              )}
            </div>

            {/* Course type select */}
            <div>
              <label
                htmlFor="course"
                className="block text-sm font-semibold text-[#1F1A17] mb-2"
              >
                Typ kurzu
              </label>
              <select
                id="course"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors bg-white appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B5D54'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "1.5rem",
                }}
              >
                <option value="">Vyberte typ kurzu...</option>
                {courseTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating stars */}
            <div>
              <label className="block text-sm font-semibold text-[#1F1A17] mb-2">
                Hodnocení *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    aria-label={`Hodnocení ${star} z 5`}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= formData.rating
                          ? "text-[#C41E3A] fill-[#C41E3A]"
                          : "text-[#EBE6DF]"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {getFieldError("rating") && (
                <p className="text-red-500 text-sm mt-1">{getFieldError("rating")}</p>
              )}
            </div>

            {/* Text field */}
            <div>
              <label
                htmlFor="text"
                className="block text-sm font-semibold text-[#1F1A17] mb-2"
              >
                Vaše recenze *
              </label>
              <textarea
                id="text"
                required
                rows={4}
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className={`w-full px-5 py-4 rounded-2xl border-2 ${
                  getFieldError("text")
                    ? "border-red-400 focus:border-red-500"
                    : "border-[#EBE6DF] focus:border-[#C41E3A]"
                } focus:outline-none transition-colors bg-white resize-none`}
                placeholder="Napište, jak se vám u nás líbilo..."
              />
              <div className="flex justify-between items-center mt-1">
                {getFieldError("text") ? (
                  <p className="text-red-500 text-sm">{getFieldError("text")}</p>
                ) : (
                  <p className="text-xs text-[#6B5D54]">Minimálně 20 znaků</p>
                )}
                <p className="text-xs text-[#6B5D54]">
                  {formData.text.length}/1000
                </p>
              </div>
            </div>

            {/* Submit buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#C41E3A] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#9E1830] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "Odesílám..."
                ) : (
                  <>
                    Odeslat recenzi
                    <Send className="h-5 w-5" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setErrors([]);
                }}
                className="px-6 py-4 rounded-full font-semibold text-[#6B5D54] hover:bg-white transition-colors"
              >
                Zrušit
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
}
