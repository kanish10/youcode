"use client";

import { useState } from "react";
import { useLanguage, LANGUAGES } from "@/lib/i18n";

type Recipe = {
  name: string;
  cultural_hint: string;
  time_minutes: number;
  servings: number;
  why_this_one: string;
  noise_level: "quiet" | "medium" | "loud";
  ingredients_used: string[];
  steps: string[];
};

type Stage = "ingredients" | "context" | "results";

const INGREDIENT_GROUPS: { label: string; items: { emoji: string; name: string }[] }[] = [
  {
    label: "Grains & bread",
    items: [
      { emoji: "🍚", name: "Rice" },
      { emoji: "🍝", name: "Pasta" },
      { emoji: "🍞", name: "Bread" },
      { emoji: "🌮", name: "Tortillas" },
      { emoji: "🥣", name: "Oats" },
      { emoji: "🍘", name: "Crackers" },
      { emoji: "🌾", name: "Quinoa" },
    ],
  },
  {
    label: "Proteins",
    items: [
      { emoji: "🥚", name: "Eggs" },
      { emoji: "🫘", name: "Canned beans" },
      { emoji: "🐟", name: "Canned tuna" },
      { emoji: "🍗", name: "Chicken" },
      { emoji: "🫛", name: "Lentils" },
      { emoji: "🥜", name: "Peanut butter" },
      { emoji: "🧀", name: "Tofu" },
    ],
  },
  {
    label: "Vegetables",
    items: [
      { emoji: "🧅", name: "Onion" },
      { emoji: "🧄", name: "Garlic" },
      { emoji: "🍅", name: "Tomato" },
      { emoji: "🥔", name: "Potato" },
      { emoji: "🥕", name: "Carrot" },
      { emoji: "🥬", name: "Spinach" },
      { emoji: "🥦", name: "Frozen veg" },
      { emoji: "🥫", name: "Canned tomato" },
      { emoji: "🌶️", name: "Bell pepper" },
    ],
  },
  {
    label: "Dairy & fridge",
    items: [
      { emoji: "🥛", name: "Milk" },
      { emoji: "🍶", name: "Yogurt" },
      { emoji: "🧈", name: "Butter" },
      { emoji: "🧀", name: "Cheese" },
    ],
  },
  {
    label: "Pantry basics",
    items: [
      { emoji: "🫒", name: "Oil" },
      { emoji: "🥫", name: "Canned soup" },
      { emoji: "🍜", name: "Instant noodles" },
      { emoji: "🍯", name: "Honey" },
      { emoji: "🥣", name: "Flour" },
      { emoji: "🍶", name: "Soy sauce" },
    ],
  },
  {
    label: "Spices & fruit",
    items: [
      { emoji: "🌶️", name: "Chili powder" },
      { emoji: "🟤", name: "Cumin" },
      { emoji: "🟡", name: "Turmeric" },
      { emoji: "🍋", name: "Lemon" },
      { emoji: "🍎", name: "Apple" },
      { emoji: "🍌", name: "Banana" },
      { emoji: "🫐", name: "Frozen berries" },
    ],
  },
];

const TIME_OPTIONS = [
  { minutes: 5, label: "5 min" },
  { minutes: 15, label: "15 min" },
  { minutes: 30, label: "30 min" },
  { minutes: 45, label: "45 min" },
];

const EQUIPMENT_OPTIONS = [
  { id: "microwave", label: "Microwave", icon: "microwave" },
  { id: "kettle", label: "Kettle", icon: "coffee" },
  { id: "stovetop", label: "Stovetop", icon: "local_fire_department" },
  { id: "oven", label: "Oven", icon: "oven_gen" },
  { id: "no-heat", label: "No heat", icon: "block" },
];

const DIET_OPTIONS = [
  { id: "halal", label: "Halal" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "no-pork", label: "No pork" },
  { id: "no-dairy", label: "No dairy" },
  { id: "no-nuts", label: "No nuts" },
  { id: "kid-friendly", label: "Kids eating too" },
  { id: "quiet-cooking", label: "Needs to stay quiet" },
];

export default function PantryToPlate() {
  const { lang } = useLanguage();
  const [stage, setStage] = useState<Stage>("ingredients");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [minutes, setMinutes] = useState(15);
  const [equipment, setEquipment] = useState<Set<string>>(new Set(["stovetop"]));
  const [diet, setDiet] = useState<Set<string>>(new Set());
  const [servings, setServings] = useState(2);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);

  const langLabel =
    LANGUAGES.find((l) => l.code === lang)?.label ?? "English";

  const toggleIngredient = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleEquipment = (id: string) => {
    setEquipment((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleDiet = (id: string) => {
    setDiet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const generateRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pantry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: Array.from(selected),
          minutes,
          equipment: Array.from(equipment).map(
            (id) => EQUIPMENT_OPTIONS.find((e) => e.id === id)?.label ?? id,
          ),
          diet: Array.from(diet).map(
            (id) => DIET_OPTIONS.find((d) => d.id === id)?.label ?? id,
          ),
          servings,
          language: langLabel,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setRecipes([]);
      } else if (data.recipes && Array.isArray(data.recipes)) {
        setRecipes(data.recipes);
        setStage("results");
      } else {
        setError("No recipes returned. Try selecting different ingredients.");
      }
    } catch {
      setError("Could not reach the kitchen helper. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setStage("ingredients");
    setSelected(new Set());
    setRecipes([]);
    setError(null);
  };

  // ── STAGE 1: INGREDIENTS ─────────────────────────────────────────
  if (stage === "ingredients") {
    return (
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-outline-variant/20 bg-white/85 p-8 shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
          <span className="inline-flex rounded-full bg-secondary-container px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-secondary">
            Pantry to plate
          </span>
          <h1 className="mt-4 font-headline text-4xl text-on-surface">
            What&rsquo;s in the kitchen right now?
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-on-surface-variant">
            Tap the items you actually have. We&rsquo;ll find 2 or 3 simple meals you
            can make tonight — no shopping, no guessing.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary-container/40 px-4 py-2 text-sm text-on-secondary-container">
            <span className="material-symbols-outlined text-base">check_circle</span>
            {selected.size} {selected.size === 1 ? "item" : "items"} selected
          </div>
        </div>

        <div className="space-y-5">
          {INGREDIENT_GROUPS.map((group) => (
            <div
              key={group.label}
              className="rounded-[1.75rem] border border-outline-variant/20 bg-white/80 p-5"
            >
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                {group.label}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => {
                  const on = selected.has(item.name);
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => toggleIngredient(item.name)}
                      className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${
                        on
                          ? "border-secondary bg-secondary-container text-on-secondary-container scale-[1.02]"
                          : "border-outline-variant/30 bg-surface-container-low text-on-surface hover:border-secondary/40"
                      }`}
                    >
                      <span className="text-lg leading-none">{item.emoji}</span>
                      <span>{item.name}</span>
                      {on && (
                        <span
                          className="material-symbols-outlined text-sm text-secondary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-4 flex flex-wrap items-center gap-3 rounded-[1.5rem] border border-outline-variant/20 bg-white/95 p-4 shadow-[0_20px_60px_rgba(82,105,94,0.15)] backdrop-blur">
          <p className="flex-1 text-sm text-on-surface-variant">
            {selected.size > 0
              ? `Ready when you are — ${selected.size} picked.`
              : "Tap anything you have to get started."}
          </p>
          <button
            type="button"
            onClick={() => setStage("context")}
            disabled={selected.size === 0}
            className="rounded-2xl bg-secondary px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            Next: when &amp; how
          </button>
        </div>
      </section>
    );
  }

  // ── STAGE 2: CONTEXT ────────────────────────────────────────────
  if (stage === "context") {
    return (
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-outline-variant/20 bg-white/85 p-8 shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
          <span className="inline-flex rounded-full bg-secondary-container px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-secondary">
            Pantry to plate · step 2
          </span>
          <h1 className="mt-4 font-headline text-4xl text-on-surface">
            A few kitchen facts.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-on-surface-variant">
            This helps us stay honest about what you can actually cook right now.
          </p>
        </div>

        {/* Time */}
        <div className="rounded-[1.75rem] border border-outline-variant/20 bg-white/80 p-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">schedule</span>
            <p className="font-semibold text-on-surface">How much time do you have?</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {TIME_OPTIONS.map((opt) => {
              const on = minutes === opt.minutes;
              return (
                <button
                  key={opt.minutes}
                  type="button"
                  onClick={() => setMinutes(opt.minutes)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                    on
                      ? "bg-secondary text-white"
                      : "border border-outline-variant/30 bg-surface-container-low text-on-surface"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Equipment */}
        <div className="rounded-[1.75rem] border border-outline-variant/20 bg-white/80 p-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">kitchen</span>
            <p className="font-semibold text-on-surface">What can you cook on?</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {EQUIPMENT_OPTIONS.map((opt) => {
              const on = equipment.has(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleEquipment(opt.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                    on
                      ? "bg-secondary text-white"
                      : "border border-outline-variant/30 bg-surface-container-low text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{opt.icon}</span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Diet */}
        <div className="rounded-[1.75rem] border border-outline-variant/20 bg-white/80 p-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">restaurant</span>
            <p className="font-semibold text-on-surface">
              Any needs to respect?
              <span className="ml-2 text-sm font-normal text-on-surface-variant">
                Optional
              </span>
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {DIET_OPTIONS.map((opt) => {
              const on = diet.has(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleDiet(opt.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    on
                      ? "bg-secondary-container text-on-secondary-container border-2 border-secondary"
                      : "border-2 border-outline-variant/25 bg-surface-container-low text-on-surface"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Servings */}
        <div className="rounded-[1.75rem] border border-outline-variant/20 bg-white/80 p-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">groups</span>
            <p className="font-semibold text-on-surface">Eating for how many?</p>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-low text-lg font-bold text-on-surface"
              aria-label="Fewer servings"
            >
              −
            </button>
            <span className="font-headline text-4xl text-on-surface w-16 text-center">
              {servings}
            </span>
            <button
              type="button"
              onClick={() => setServings(Math.min(8, servings + 1))}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-low text-lg font-bold text-on-surface"
              aria-label="More servings"
            >
              +
            </button>
            <span className="ml-2 text-sm text-on-surface-variant">
              {servings === 1 ? "person" : "people"}
            </span>
          </div>
        </div>

        <div className="sticky bottom-4 flex items-center gap-3 rounded-[1.5rem] border border-outline-variant/20 bg-white/95 p-4 shadow-[0_20px_60px_rgba(82,105,94,0.15)] backdrop-blur">
          <button
            type="button"
            onClick={() => setStage("ingredients")}
            className="rounded-2xl border border-outline-variant/25 bg-surface-container px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-on-surface"
          >
            Back
          </button>
          <button
            type="button"
            onClick={generateRecipes}
            disabled={loading}
            className="flex-1 rounded-2xl bg-secondary px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white disabled:opacity-45"
          >
            {loading ? "Finding recipes…" : "Show me what I can make"}
          </button>
        </div>

        {error && (
          <div className="rounded-2xl bg-error-container/20 p-4 text-sm text-on-error-container">
            {error}
          </div>
        )}
      </section>
    );
  }

  // ── STAGE 3: RESULTS ────────────────────────────────────────────
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-outline-variant/20 bg-white/85 p-8 shadow-[0_20px_60px_rgba(82,105,94,0.08)]">
        <span className="inline-flex rounded-full bg-secondary-container px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-secondary">
          {recipes.length} recipes you can make now
        </span>
        <h1 className="mt-4 font-headline text-4xl text-on-surface">
          From your kitchen, tonight.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-on-surface-variant">
          Using only what you picked: {Array.from(selected).join(", ")}.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {recipes.map((recipe, idx) => (
          <article
            key={`${recipe.name}-${idx}`}
            className="rounded-[1.75rem] border border-outline-variant/20 bg-white p-6 shadow-[0_10px_30px_rgba(82,105,94,0.08)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="font-headline text-2xl leading-tight text-on-surface">
                  {recipe.name}
                </h2>
                {recipe.cultural_hint && (
                  <p className="mt-1 text-sm italic text-on-surface-variant">
                    {recipe.cultural_hint}
                  </p>
                )}
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-container text-secondary">
                <span className="material-symbols-outlined">restaurant_menu</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-on-surface-variant">
                {recipe.time_minutes} min
              </span>
              <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-on-surface-variant">
                {recipe.servings} {recipe.servings === 1 ? "serving" : "servings"}
              </span>
              {recipe.noise_level && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] ${
                    recipe.noise_level === "quiet"
                      ? "bg-primary-container text-primary"
                      : recipe.noise_level === "medium"
                        ? "bg-secondary-container text-secondary"
                        : "bg-error-container/30 text-on-error-container"
                  }`}
                >
                  {recipe.noise_level} kitchen
                </span>
              )}
            </div>

            {recipe.why_this_one && (
              <p className="mt-4 rounded-2xl bg-secondary-container/25 p-4 text-sm italic leading-relaxed text-on-surface">
                &ldquo;{recipe.why_this_one}&rdquo;
              </p>
            )}

            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                Steps
              </p>
              <ol className="mt-3 space-y-2">
                {recipe.steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <p className="pt-0.5 text-sm leading-relaxed text-on-surface">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setStage("context")}
          className="rounded-2xl border border-outline-variant/25 bg-surface-container px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-on-surface"
        >
          Adjust constraints
        </button>
        <button
          type="button"
          onClick={generateRecipes}
          disabled={loading}
          className="rounded-2xl border border-secondary/30 bg-secondary-container/30 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-secondary disabled:opacity-45"
        >
          {loading ? "Regenerating…" : "Try different recipes"}
        </button>
        <button
          type="button"
          onClick={resetAll}
          className="rounded-2xl bg-secondary px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white"
        >
          Start over
        </button>
      </div>
    </section>
  );
}
