// Minimal SEO "answer pages" — one clean question per URL, funnels into the AI assistant.
// NOT linked in the site nav. Only people who Google the exact question land here.
// Same knowledge that's in Pinecone, published crawlably so it can rank + earn FAQ rich results.

export type AnswerFaq = { q: string; a: string }
export type AnswerPage = {
  slug: string
  emoji: string
  tag: string
  title: string            // the search-query headline (H1 + <title>)
  metaDescription: string
  lead: string             // the direct 2-3 sentence answer up top
  faqs: AnswerFaq[]
}

export const answerPages: AnswerPage[] = [
  {
    slug: 'natural-thyroid-support-for-dogs',
    emoji: '🦋',
    tag: 'Holistic Organ Support',
    title: 'Natural Thyroid Support for Dogs',
    metaDescription:
      "Can you support a dog's thyroid naturally? The honest answer — which nutrients and herbs help hypothyroid dogs, what to avoid, and why medication still matters.",
    lead:
      "You can't cure a truly hypothyroid dog with herbs alone — the proven treatment is thyroid hormone (levothyroxine), and it works. But the right nutrients and a few herbs genuinely support the gland alongside medication. Here's what helps, and what can quietly make things worse.",
    faqs: [
      {
        q: 'What helps a dog’s thyroid naturally?',
        a: 'Support the gland’s machinery, don’t try to replace the hormone: selenium and zinc help convert storage hormone T4 into active T3, tyrosine from quality animal protein is the building block, and omega-3 fish oil helps the skin and coat problems that come with low thyroid. These are an adjunct to medication, never a replacement.',
      },
      {
        q: 'Is kelp or seaweed good for a dog’s thyroid?',
        a: 'It’s double-edged. Kelp is concentrated iodine, which the thyroid needs — but too much can actually worsen hypothyroidism and interfere with medication. Commercial kibble is already fortified with iodine (don’t stack daily kelp on top), while home-cooked or raw diets may genuinely need a measured source. Never free-feed kelp to a medicated dog without your vet.',
      },
      {
        q: 'What herbs support a dog’s thyroid?',
        a: 'For an underactive thyroid, ashwagandha and guggul are traditionally used (human/traditional data, no canine trials) and adaptogens like rhodiola and holy basil support the stress axis. One critical safety point: bugleweed, lemon balm, and motherwort are ANTI-thyroid herbs used for an OVERactive thyroid — giving them to a hypothyroid dog is backwards and can make it worse.',
      },
      {
        q: 'Does feeding kibble vs. fresh food change my dog’s thyroid needs?',
        a: 'Yes. Kibble-fed dogs usually get plenty of iodine (it’s fortified), so the risk is over-supplementing; cheaper kibble also uses less-bioavailable mineral forms. Raw or home-cooked dogs are the ones who may fall short on iodine and trace minerals and need them added. So “should I add iodine?” has almost opposite answers depending on the bowl.',
      },
      {
        q: 'What are the signs of low thyroid in dogs?',
        a: 'Weight gain without eating more, low energy, a dull coat with symmetrical hair loss (the “rat tail”), recurrent skin and ear infections, and seeking out warm spots — most often in middle-aged medium-to-large breeds. It’s confirmed with a blood panel (T4, free T4, TSH), not a single low reading.',
      },
    ],
  },
  {
    slug: 'milk-thistle-for-dogs',
    emoji: '🌿',
    tag: 'Holistic Liver Support',
    title: 'Milk Thistle for Dogs: Liver Benefits, Dosage & Safety',
    metaDescription:
      "Milk thistle (silymarin) is the most evidence-backed liver herb for dogs. What it does, when to give it, safe dosing basics, and what to watch for.",
    lead:
      "Milk thistle — specifically its active compound silymarin — is the most evidence-supported herb for canine liver support. It’s an antioxidant that helps protect and regenerate liver cells, which is why it’s used during and after medications, toxin exposure, or when liver enzymes are elevated. It supports the liver; it isn’t a cure for liver disease, so use it alongside your vet.",
    faqs: [
      {
        q: 'What does milk thistle do for a dog’s liver?',
        a: 'Its active compound, silymarin, is an antioxidant that helps shield liver cells from damage and supports their regeneration. It also supports the liver’s natural detox pathways. That’s why it’s commonly given when a dog is on liver-taxing medications, has been exposed to toxins or pesticides, or has raised liver values — as support, not a replacement for veterinary treatment.',
      },
      {
        q: 'Is milk thistle safe for dogs?',
        a: 'It’s generally well-tolerated, with mild digestive upset the most common effect at higher doses. It’s usually given in courses (during and after a liver stressor) rather than continuously for life unless a vet advises it. Because it can affect how the liver processes certain drugs, tell your vet your dog is on it — especially if they’re taking other medications.',
      },
      {
        q: 'How much milk thistle should I give my dog?',
        a: 'The right amount depends on the product’s silymarin content and your dog’s size, so this is a vet-guided number rather than a one-size dose. Look for standardized extracts (ideally ones that state their silymarin percentage; phosphatidylcholine-bound forms absorb better). Don’t guess with human supplements that contain added ingredients — get the dose confirmed for your dog.',
      },
      {
        q: 'When should I give my dog milk thistle?',
        a: 'The best-supported times are around a liver stressor: during and after a course of medication (including anesthesia, antibiotics, or long-term drugs), after known toxin or pesticide exposure, or when bloodwork shows elevated liver enzymes. Some owners run short supportive courses; it’s not automatically a daily-forever supplement.',
      },
      {
        q: 'Does my dog’s diet change how much liver support they need?',
        a: 'It can. Dogs on ultra-processed, lower-quality diets — or with more exposure to processed foods, chemical preservatives, and environmental toxins — put more day-to-day load on the liver than dogs on fresh, whole-food diets. Milk thistle is supportive either way, but a cleaner diet is the foundation; the herb doesn’t undo a poor one.',
      },
    ],
  },
  {
    slug: 'homemade-dog-toothpaste',
    emoji: '🦷',
    tag: 'Dental Care',
    title: 'Homemade Dog Toothpaste: Safe DIY Recipe',
    metaDescription:
      "A vet-safety-checked homemade dog toothpaste recipe — plus the human-toothpaste ingredients (xylitol, fluoride, essential oils) that are genuinely dangerous for dogs.",
    lead:
      "You can make a safe, effective dog toothpaste at home with just two ingredients — but the bigger issue is what NOT to put in it. Never use human toothpaste on a dog: fluoride and xylitol (a common human-toothpaste sweetener) are both toxic to dogs, and xylitol can be fatal in small amounts. Here's a simple, safe recipe and exactly which \"natural\" additions to avoid.",
    faqs: [
      {
        q: 'What is a safe homemade dog toothpaste recipe?',
        a: 'The simplest safe base is coconut oil plus baking soda: mix roughly 2 tablespoons of coconut oil with 1 teaspoon of baking soda into a paste. Coconut oil has natural antibacterial properties (lauric acid) and dogs generally tolerate the taste; baking soda mildly helps lift plaque. Keep the ratio baking-soda-light — it should taste mostly like coconut oil, not a science-fair volcano. Store in a small sealed container and use a soft dog toothbrush or a finger brush.',
      },
      {
        q: 'Can I just use my own toothpaste on my dog?',
        a: 'No — never use human toothpaste on a dog. Two ingredients make it genuinely dangerous: fluoride, which is toxic to dogs in the amounts found in a tube of human toothpaste, and xylitol, a sugar substitute in many "natural" and sugar-free human toothpastes that causes a rapid, dangerous drop in blood sugar and can lead to liver failure in dogs — even a small lick of a xylitol-containing toothpaste is a genuine emergency. Check ingredient labels carefully; xylitol shows up in unexpected products.',
      },
      {
        q: 'Are essential oils safe to add to dog toothpaste?',
        a: 'Most are not, so it\'s safest to leave them out entirely. Tea tree (melaleuca), wintergreen, clove, and cinnamon essential oils are all established canine toxins even in small concentrated amounts, and dogs are swallowing this paste, not spitting it out like a person would. If you want flavor, a small pinch of finely chopped curly parsley (not spring/wild parsley, which is different and can be toxic) is a safe, breath-freshening addition — skip the essential oil aisle altogether.',
      },
      {
        q: 'Is baking soda safe for dogs in toothpaste?',
        a: 'In the small amount used in a toothpaste recipe (roughly a teaspoon mixed into oil, most of which stays on the brush and gums rather than being swallowed), baking soda is considered safe for occasional dental use. It becomes a real concern only in large ingested quantities, where sodium bicarbonate can cause GI upset or, in extreme cases, electrolyte imbalance — which is a reason to keep any homemade toothpaste stored well out of reach, not left out where a dog could get into the whole batch.',
      },
      {
        q: 'Does homemade toothpaste actually replace brushing or dental chews?',
        a: 'No product — homemade, commercial, or a dental chew — replaces mechanical brushing as the gold standard for canine dental health. Toothpaste (homemade or store-bought) is a flavor/compliance aid that makes brushing tolerable for the dog; the actual plaque removal comes from the brushing action itself, ideally daily. Use a safe homemade paste to make the habit stick, not as a substitute for the brush.',
      },
    ],
  },
  {
    slug: 'can-dogs-eat-apples',
    emoji: '🍎',
    tag: 'Safe & Toxic Foods',
    title: 'Can Dogs Eat Apples?',
    metaDescription:
      "Yes, dogs can eat apples — with one real precaution. What to remove first, how much is safe, and the one part of the apple that's genuinely a hazard.",
    lead:
      "Yes — apples are a safe, healthy snack for most dogs, and a genuinely good one: real fiber, vitamin C, and antioxidants for very few calories. The one rule that matters: always remove the core and seeds first. Apple seeds contain trace amounts of a cyanide-producing compound — harmless in the amount a dog would get from stealing one seed, but not something to feed on purpose.",
    faqs: [
      {
        q: 'Are apple seeds actually dangerous to dogs?',
        a: "Apple seeds contain amygdalin, which breaks down into a small amount of cyanide compound when chewed and digested. In practice, the amount in the few seeds from a slice or two is not enough to cause harm — this isn't an emergency-room scenario for a dog that snags a seed or two. It's still good practice to core an apple before giving it to your dog, both because seeds aren't meant to be eaten in quantity and because a whole core can be a choking or obstruction risk, especially in small dogs.",
      },
      {
        q: 'How much apple can I give my dog?',
        a: "Treat it like any other treat: roughly 10% or less of daily calories. A few slices is plenty for most dogs — this is a snack and enrichment item, not a meal component. Introduce it gradually the first time, like any new food, since a sudden amount of extra fiber can cause loose stool in a dog whose gut isn't used to it.",
      },
      {
        q: "What's actually good about apples for dogs?",
        a: "Real fiber (good for digestion and stool quality), vitamin C and vitamin A, and antioxidants called polyphenols — all for very few calories, which makes apple slices a genuinely better treat option than most commercial dog treats calorie-for-calorie. The skin is fine to leave on (that's where a lot of the fiber and antioxidants are) as long as it's washed.",
      },
      {
        q: 'Can dogs eat applesauce or apple juice?',
        a: "Plain, unsweetened applesauce with no added sugar, cinnamon, or other additives is fine in small amounts, though it lacks the fiber benefit of the whole fruit since it's been processed. Apple juice is mostly sugar and water with the fiber removed — not toxic, but not something worth giving regularly; plain apple slices are the better choice by a wide margin.",
      },
      {
        q: 'Are there dogs that should avoid apples?',
        a: "Diabetic dogs or dogs on a strict low-sugar/low-carb plan should get apples sparingly if at all, given the natural sugar content, and it's worth asking your vet what fits their specific management plan. Otherwise, apples are one of the safer, more universally tolerated fruits for dogs — just always minus the core and seeds.",
      },
    ],
  },

  // ── Batch 1: Toxic & Safe Foods (from qa-toxic-and-safe-foods.json) ──
  {
    slug: 'what-human-foods-are-toxic-to-dogs',
    emoji: '☠️',
    tag: 'Safe & Toxic Foods',
    title: 'What Human Foods Are Toxic to Dogs?',
    metaDescription:
      'The full list of common human foods that are genuinely dangerous for dogs — xylitol, chocolate, grapes, onions, alcohol, caffeine, and more — plus what to do if your dog eats one.',
    lead:
      "The most dangerous, well-documented ones are xylitol, chocolate, grapes and raisins, onions and other allium vegetables, macadamia nuts, alcohol, caffeine, and raw yeast bread dough. Each works by a different mechanism, and some are dangerous in tiny amounts (xylitol, grapes) while others depend on dose and size (chocolate, onions). If your dog eats any of these, call your vet, the ASPCA Animal Poison Control Center, or the Pet Poison Helpline — don't wait for symptoms.",
    faqs: [
      {
        q: 'Why are alcohol and raw bread dough dangerous for dogs?',
        a: 'Both come down to ethanol. Alcohol causes dangerous drops in blood sugar, body temperature, and blood pressure, and can lead to seizures or respiratory failure — dogs are far more sensitive than people. Raw yeast bread dough is a double threat: the warm stomach makes it keep rising (causing painful bloat and possible stomach twisting), and the fermenting yeast produces alcohol absorbed into the bloodstream. Both are emergencies — call your vet or poison control.',
      },
      {
        q: 'Can dogs have caffeine or coffee?',
        a: "No. Caffeine is a stimulant in the same chemical family as chocolate's theobromine, and dogs are very sensitive to it — it can cause restlessness, a racing heart, high blood pressure, tremors, and seizures. A few licks of brewed coffee likely won't harm a large dog, but coffee grounds, beans, or pills are concentrated and dangerous. Keep all caffeine sources out of reach.",
      },
      {
        q: 'Are cooked bones or corn cobs dangerous for dogs?',
        a: "Yes, but as physical hazards rather than poisons. Cooked bones become brittle and splinter into sharp fragments that can damage or puncture the mouth, throat, and digestive tract. Corn cobs are a classic cause of intestinal blockage because dogs swallow chunks that don't break down and lodge in the gut, often requiring surgery.",
      },
      {
        q: 'What should I do if my dog ate something toxic?',
        a: "Act fast and don't wait for symptoms — many toxins (grapes, onions, xylitol) cause delayed damage. Note what was eaten, roughly how much, and when, then call your vet, the ASPCA Animal Poison Control Center at (888) 426-4435, or the Pet Poison Helpline at (855) 764-7661. Do NOT induce vomiting unless a professional tells you to — for some substances it makes things worse.",
      },
    ],
  },
  {
    slug: 'is-xylitol-dangerous-for-dogs',
    emoji: '🚨',
    tag: 'Safe & Toxic Foods',
    title: 'Is Xylitol Dangerous for Dogs?',
    metaDescription:
      "Xylitol is arguably the most dangerous common food toxin for dogs — hidden in gum, peanut butter, and baked goods. Here's the dose, the symptoms, and why it's a real emergency.",
    lead:
      "Yes — xylitol is arguably the most dangerous common food toxin for dogs, because it's potent and hidden in everyday products: sugar-free gum, mints, many peanut butters, baked goods, and 'keto'/low-sugar foods. In dogs it triggers a massive insulin release. A single piece of some sugar-free gum can contain enough to harm a small dog.",
    faqs: [
      {
        q: 'How much xylitol is toxic to a dog?',
        a: 'Hypoglycemia (dangerously low blood sugar) can occur at roughly 0.1 g per kg of body weight, and liver failure at around 0.5 g/kg. Because products vary so much in xylitol content, there\'s no safe "just a little" — treat any known ingestion as an emergency.',
      },
      {
        q: 'What products commonly contain xylitol?',
        a: 'Sugar-free gum and mints are the most concentrated common sources, but it also turns up in many peanut butters, baked goods, some toothpastes, and low-sugar/keto-marketed foods. Always check the label before giving your dog peanut butter or anything sugar-free.',
      },
      {
        q: 'What should I do if my dog ate xylitol?',
        a: 'Call your vet or poison control immediately — this is a genuine emergency, not a wait-and-see situation. Symptoms (vomiting, weakness, collapse, seizures) come from a sudden insulin surge and can appear within 30-60 minutes.',
      },
    ],
  },
  {
    slug: 'how-much-chocolate-is-toxic-to-dogs',
    emoji: '🍫',
    tag: 'Safe & Toxic Foods',
    title: 'How Much Chocolate Is Toxic to a Dog?',
    metaDescription:
      "It depends on the type of chocolate and your dog's weight. The theobromine thresholds for symptoms, cardiac effects, and seizures — and how urgently to act.",
    lead:
      "It depends on the type of chocolate and the dog's weight, because the toxic agent is theobromine (plus caffeine). The darker the chocolate, the more theobromine: baker's and dark chocolate are far more dangerous than milk chocolate, and white chocolate has almost none. A few M&Ms won't hurt a large dog, but a bar of dark chocolate can seriously harm a small one.",
    faqs: [
      {
        q: 'What are the theobromine thresholds for dogs?',
        a: 'As a rough guide, signs start around 20 mg of theobromine per kg of body weight, serious cardiac effects around 40–50 mg/kg, and seizures around 60 mg/kg. Darker, more bitter chocolate has far more theobromine per ounce than milk chocolate.',
      },
      {
        q: 'What are the symptoms of chocolate poisoning in dogs?',
        a: "Vomiting, restlessness, a racing heart, and tremors — and symptoms can take 6–12 hours to appear after eating. Call poison control with the type and amount eaten so they can calculate the actual risk for your dog's size.",
      },
    ],
  },
  {
    slug: 'are-grapes-and-raisins-toxic-to-dogs',
    emoji: '🍇',
    tag: 'Safe & Toxic Foods',
    title: 'Are Grapes and Raisins Toxic to Dogs?',
    metaDescription:
      "Yes — even a few grapes or raisins can cause acute kidney failure in dogs, and there's no established safe amount. What the research says and what to do.",
    lead:
      "Yes — grapes, raisins, currants, and foods containing them can cause acute kidney failure in dogs, and the reaction is unpredictable. There is no established 'safe' amount: some dogs eat several with no effect while others have severe reactions to just a few, so all ingestion is treated as a potential emergency.",
    faqs: [
      {
        q: 'What actually makes grapes toxic to dogs?',
        a: 'Recent research points to tartaric acid as the likely toxic component, which dogs handle poorly. Raisins are more concentrated than grapes and considered higher-risk gram for gram.',
      },
      {
        q: 'My dog ate a grape and seems fine — is that normal?',
        a: "It can happen, but it doesn't mean it's safe next time. Because the reaction is so unpredictable dog to dog, vets treat every ingestion the same way: contact your vet or poison control right away. Early treatment is the key factor in outcomes.",
      },
    ],
  },
  {
    slug: 'are-onions-and-garlic-toxic-to-dogs',
    emoji: '🧅',
    tag: 'Safe & Toxic Foods',
    title: 'Are Onions and Garlic Toxic to Dogs?',
    metaDescription:
      "Onions are a clear yes on toxic. Garlic is more contested — including as a flea remedy — here's the honest, evidence-based answer on both.",
    lead:
      "Onions: yes, toxic. Onions, leeks, shallots, and chives are in the allium family and contain compounds that damage red blood cells and cause hemolytic anemia. Garlic is the more contested one — including a popular claim that it repels fleas — and the current evidence leans toward caution rather than the traditional holistic 'safe in small amounts' framing.",
    faqs: [
      {
        q: 'How much onion is toxic to a dog?',
        a: 'Toxic effects are generally seen around 5 grams of onion per kg of body weight, and the effect is cumulative — small amounts over time, or one larger dose, can both cause it. Cooked or powdered onion (common in broths and seasonings) is just as dangerous, often more concentrated. Signs (weakness, pale gums, dark urine, lethargy) can be delayed several days.',
      },
      {
        q: 'Is garlic actually safe and effective to give my dog for fleas?',
        a: "Weak-mixed leaning UNSAFE on safety, and unsupported on efficacy — this is a genuine controversy worth taking seriously. Garlic's organosulfur compounds cause oxidative damage to canine red blood cells; a 2025 in-vitro study found ALL forms of garlic damaged red blood cells, with dried/granulated garlic causing MORE damage than fresh (~15% of cells injured vs. ~5% with fresh vs. ~2% in untreated controls) — meaning the powdered forms used in most supplements are the more concerning ones. On efficacy, a 2020 veterinary evidence review found no in-vivo studies showing garlic prevents, kills, or repels fleas at any life stage in dogs. Certain breeds (Japanese breeds like Akita/Shiba) are extra-sensitive. There are effective, safer flea options — recommending garlic means accepting an unproven benefit against a measurable risk.",
      },
    ],
  },
  {
    slug: 'can-dogs-eat-macadamia-nuts',
    emoji: '🌰',
    tag: 'Safe & Toxic Foods',
    title: 'Can Dogs Eat Macadamia Nuts?',
    metaDescription:
      'No — macadamia nuts are uniquely toxic to dogs, even though the exact mechanism is unknown. Symptoms, dose, and what other nuts to watch for.',
    lead:
      'No — macadamia nuts are uniquely toxic to dogs, though the exact mechanism is unknown. Signs can appear at doses as low as about 2 grams per kg of body weight and include weakness (especially in the hind legs), tremors, vomiting, depression, and hyperthermia.',
    faqs: [
      {
        q: 'Is macadamia nut poisoning fatal in dogs?',
        a: "It's rarely fatal and dogs usually recover within 24–48 hours, but it's distressing and warrants a call to your vet. Watch out for macadamias hidden in cookies and trail mix.",
      },
      {
        q: 'Are other nuts safe for dogs?',
        a: "Most other nuts aren't 'toxic' in the macadamia sense, but they're high-fat (pancreatitis risk) and a choking/obstruction hazard, so they're not a great regular treat either.",
      },
    ],
  },
  {
    slug: 'can-dogs-eat-avocado',
    emoji: '🥑',
    tag: 'Safe & Toxic Foods',
    title: 'Can Dogs Eat Avocado?',
    metaDescription:
      "Mostly yes — avocado toxicity in dogs is often overstated. What's actually risky (the pit, the fat) versus what's fine in small amounts.",
    lead:
      "Mostly yes, with caveats — this one is often overstated. Avocado contains persin, which is highly toxic to birds and some livestock, but dogs are fairly resistant, and the flesh in small amounts is generally fine (it's even in some dog foods).",
    faqs: [
      {
        q: 'What part of the avocado is actually dangerous?',
        a: 'The large pit is the real hazard — a serious choking and intestinal-obstruction risk, not a poison risk. The skin isn\'t meant to be eaten either. The high fat content of the flesh can also trigger stomach upset or pancreatitis in sensitive dogs if overdone.',
      },
      {
        q: 'How much avocado can I give my dog?',
        a: "A little plain avocado flesh is okay for most dogs as an occasional treat, but skip the pit and skin and don't make it a fatty daily habit.",
      },
    ],
  },
  {
    slug: 'can-dogs-have-peanut-butter',
    emoji: '🥜',
    tag: 'Safe & Toxic Foods',
    title: 'Can Dogs Have Peanut Butter?',
    metaDescription:
      'Yes, but check the label first — some peanut butters contain xylitol, which is deadly to dogs. What to look for and how to use it safely.',
    lead:
      'Yes — but you must check the label for xylitol first, because some peanut butters use that sweetener and it can be deadly to dogs. Choose a plain peanut butter whose only ingredient is peanuts, with no added sugar, salt, or sweeteners.',
    faqs: [
      {
        q: 'How can I tell if a peanut butter is safe for my dog?',
        a: 'Read the ingredient list: it should say just "peanuts" (sometimes with a small amount of salt). If it lists xylitol, sorbitol substitutes, or anything marketed as "sugar-free" or "keto," don\'t use it — see our xylitol page for why that matters.',
      },
      {
        q: 'Is peanut butter healthy for dogs?',
        a: "In moderation, yes — it's a useful high-value treat and a great way to give pills or stuff a frozen enrichment toy. Keep portions small since it's calorie- and fat-dense; it shouldn't become a daily habit for a dog watching its weight.",
      },
    ],
  },
  {
    slug: 'can-dogs-eat-dairy',
    emoji: '🧀',
    tag: 'Safe & Toxic Foods',
    title: 'Can Dogs Eat Dairy Like Milk, Cheese, and Yogurt?',
    metaDescription:
      'It depends on the dog and the type. Plain yogurt and kefir are usually fine and even beneficial — milk and heavy cheese are more likely to cause trouble.',
    lead:
      'It depends on the dog and the type. Many adult dogs are somewhat lactose intolerant, so milk and heavy cheese can cause gas, loose stools, or upset. Plain unsweetened yogurt and kefir are usually well tolerated and even beneficial.',
    faqs: [
      {
        q: "Why is yogurt okay if milk usually isn't?",
        a: 'Fermentation reduces the lactose content and adds gut-friendly probiotics, which is why plain yogurt and kefir are typically better tolerated than straight milk — and can be a genuine holistic addition for gut health.',
      },
      {
        q: 'What dairy should I avoid giving my dog?',
        a: 'Avoid sweetened or flavored yogurts (watch for xylitol) and go easy on fatty cheeses, especially in dogs prone to pancreatitis. Start with a small amount of any dairy to see how your dog handles it before making it a regular thing.',
      },
    ],
  },
  {
    slug: 'what-human-foods-can-dogs-eat-safely',
    emoji: '🥕',
    tag: 'Safe & Toxic Foods',
    title: 'What Human Foods Can Dogs Eat Safely?',
    metaDescription:
      "Blueberries, eggs, pumpkin, carrots, and more — the whole-food human foods that make genuinely healthy additions to a dog's bowl, and the portion rule to follow.",
    lead:
      "Plenty of whole foods make excellent, healthy additions to a dog's diet. Great options include blueberries, carrots, plain cooked pumpkin, eggs, plain yogurt or kefir, apple slices (no seeds), green beans, and watermelon (no seeds or rind). The general rule: keep additions to about 10% of daily calories, introduce one new thing at a time, and serve them plain.",
    faqs: [
      {
        q: 'Can dogs eat blueberries?',
        a: "Yes — blueberries are one of the best treats you can give. They're low in sugar and calories and packed with antioxidants, vitamin C, and fiber. Serve fresh or frozen — frozen makes a great crunchy hot-weather treat.",
      },
      {
        q: 'Can dogs eat eggs?',
        a: 'Yes — eggs are a fantastic whole-food protein, rich in highly digestible amino acids plus biotin, riboflavin, and selenium. Cooked plain (no butter or salt) is the safe default. An egg a few times a week is a great topper for most dogs.',
      },
      {
        q: 'Can dogs eat pumpkin?',
        a: "Yes — plain cooked pumpkin (not pie filling) is a holistic staple. Its soluble fiber helps with both diarrhea and constipation, and it provides beta-carotene and potassium. A common amount is roughly a teaspoon to a tablespoon per meal depending on the dog's size.",
      },
      {
        q: 'Are fatty or salty foods bad for dogs?',
        a: "Yes, in their own way — not 'toxic' like xylitol, but they cause real problems. High-fat foods can trigger pancreatitis, especially in prone breeds and overweight dogs. Very salty foods can cause excessive thirst and, in extreme cases, sodium ion poisoning.",
      },
      {
        q: 'What other fruits and veggies are safe for dogs?',
        a: 'Carrots, green beans, cucumber, celery, watermelon (no seeds or rind), and small amounts of banana are all good options. Stick to plain, washed, appropriately sized pieces, and remember pits and large seeds are choking/obstruction hazards.',
      },
    ],
  },

  // ── Batch 2: Condition & symptom pages (from condition Q&A packs) ──
  {
    slug: 'how-to-help-a-dogs-itchy-skin-naturally',
    emoji: '🐾',
    tag: 'Skin & Allergies',
    title: "How to Help a Dog's Itchy Skin Naturally",
    metaDescription:
      "Why your dog is itchy and how to calm it holistically — the diet, omega-3s, gut support, and supplements that address the root inflammation, not just the symptom.",
    lead:
      "Chronic itching almost always traces back to inflammation, and the four biggest drivers are diet, environmental allergens, yeast overgrowth, and fleas. The skin is a mirror of what's happening inside — a dog on a heavily processed, high-omega-6 diet runs 'hot' and inflamed. Rather than just suppressing the itch, the goal is to find and remove the root irritant (often the food) and calm the whole system with anti-inflammatory whole foods and omega-3s.",
    faqs: [
      {
        q: "Is my dog's itching from a food allergy or an environmental allergy?",
        a: "A rough rule: itching that's year-round and steady often points to food, while itching that flares seasonally (spring/fall, after walks in grass) points to environmental allergens like pollen, mold, and dust mites. Food-related issues frequently show up as itchy paws, recurring ear infections, and rear-end irritation. The only way to truly confirm a food trigger is a strict elimination diet — blood and saliva food-allergy tests are notoriously unreliable in dogs.",
      },
      {
        q: "Can omega-3s help my dog's itchy skin?",
        a: 'Yes — omega-3s (EPA and DHA) are one of the best-supported tools for itchy, inflamed skin because they directly lower the inflammatory cascade. Most kibble is loaded with omega-6 and very little omega-3, tipping dogs into a pro-inflammatory state; adding a quality whole-food omega-3 helps rebalance that. Good sources are sardines, anchovies, and a clean fish or krill oil, dosed to weight. Give it time — skin and coat improvements usually take 6 to 12 weeks.',
      },
      {
        q: "What natural supplements help with a dog's itchy skin?",
        a: "The core stack is omega-3s (to lower inflammation), a quality probiotic (to heal the gut where allergies start), and quercetin — often called 'nature's Benadryl' — for histamine response. Many owners also add coconut oil, local honey for seasonal allergies, and functional mushrooms (reishi, turkey tail) to modulate an overactive immune system. Introduce one thing at a time so you can tell what's working.",
      },
    ],
  },
  {
    slug: 'why-does-my-dog-keep-getting-ear-and-yeast-infections',
    emoji: '👂',
    tag: 'Skin & Allergies',
    title: 'Why Does My Dog Keep Getting Ear and Yeast Infections?',
    metaDescription:
      'Recurrent ear and yeast infections are almost always a symptom of an underlying allergy. What actually causes the overgrowth, the most proven treatment, and how to stop the cycle.',
    lead:
      "Recurrent ear infections and yeast overgrowth are one of the biggest tells of an underlying allergy. Malassezia yeast is normal on healthy dog skin — it only becomes a problem when something (usually a food or environmental allergy) disrupts the skin's balance and lets it bloom. That's why yeast keeps coming back if you only treat the yeast: the fix is finding and managing the trigger underneath, not more cleaning.",
    faqs: [
      {
        q: 'What are the signs of a yeast problem in my dog?',
        a: "Yeast overgrowth classically shows up as itchy, red, greasy skin with a musty or 'corn chip' smell, often with brown/black waxy buildup in skin folds and ears. Common spots are the paws (lots of licking, with reddish-brown saliva staining), ears (waxy, smelly, recurrent), armpits, groin, and folds. It frequently looks just like allergies — which is no coincidence.",
      },
      {
        q: "What's the most proven way to treat yeast on a dog's skin?",
        a: 'The strongest evidence is for topical antifungal washing: a shampoo with 2% miconazole and 2% chlorhexidine, used about twice weekly, has good clinical evidence for clearing Malassezia — let it sit ~10 minutes before rinsing. Severe cases may add oral antifungals under a vet. Even within a holistic plan, regular medicated bathing is the practical workhorse while you address the root cause.',
      },
      {
        q: "How do I clean my dog's ears safely?",
        a: "Use a proper dog ear cleaner, wet the canal, gently massage the base for a few seconds (you'll hear a squish), let your dog shake, then wipe out the loosened debris with a cotton pad. Never push cotton swabs down into the canal. Don't over-clean healthy ears, and keep them dry after swimming. If the ear is very painful, swollen, or bleeding, stop and see a vet.",
      },
    ],
  },
  {
    slug: 'how-to-help-dog-arthritis-naturally',
    emoji: '🦴',
    tag: 'Joints & Mobility',
    title: "How to Help a Dog's Arthritis and Joint Pain Naturally",
    metaDescription:
      "The evidence-based holistic plan for canine arthritis — weight, omega-3s, exercise, and diet — plus an honest take on glucosamine, turmeric, and CBD.",
    lead:
      "The best results come from a multimodal approach, not one magic supplement. The pillars with the strongest support are: keeping your dog lean (weight management is huge for joints), omega-3 fatty acids (the best-evidenced supplement for OA pain), appropriate low-impact exercise, and an anti-inflammatory whole-food diet. Stacking several proven levers beats relying on any single product.",
    faqs: [
      {
        q: 'Do omega-3s really help dogs with arthritis?',
        a: 'Yes — this is one of the best-supported nutritional interventions for canine osteoarthritis. Systematic reviews found strong evidence that omega-3 (EPA/DHA)-enriched diets and supplements provide real clinical pain relief, and they\'re now recommended as a first-line non-drug option. Use a quality fish, krill, or green-lipped mussel source dosed to weight, and give it weeks to build. This is the joint supplement to reach for first.',
      },
      {
        q: 'Does glucosamine and chondroitin actually work for dogs?',
        a: "Honestly, the evidence is mixed — it's more popular than proven. Some trials show improvements in pain and weight-bearing by around day 70, but at least one systematic review found no significant overall effect. It may help some dogs, it's very safe, and it takes 6–8 weeks to judge — but it's not the reliable performer that omega-3 and green-lipped mussel are. Treat it as a low-risk add-on, not the foundation.",
      },
      {
        q: 'How much does weight matter for a dog with arthritis?',
        a: "Enormously — keeping your dog lean is arguably the single most powerful thing you can do for arthritic joints, and it's free. Every extra pound adds mechanical load, and body fat also produces inflammatory signals, so excess weight hurts on two fronts. Many dogs improve meaningfully from weight loss alone — feed to a lean body condition where you can easily feel the ribs.",
      },
      {
        q: 'Can turmeric or CBD help dog arthritis?',
        a: 'Both are reasonable to consider. Turmeric/curcumin is a genuine anti-inflammatory but needs a bioavailable formulation (with black pepper/fat) and rigorous canine trials are limited. CBD has more promising early data — a few small controlled studies reported improved comfort and activity — but product quality varies widely and it can interact with other medications. Use quality products, dose conservatively, and loop in a holistic vet.',
      },
    ],
  },
  {
    slug: 'best-diet-for-a-dog-with-kidney-disease',
    emoji: '🫘',
    tag: 'Organ Health',
    title: 'The Best Diet for a Dog with Kidney Disease',
    metaDescription:
      'Phosphorus restriction — not low protein — is the most proven dietary change for canine kidney disease. What the research actually shows and how to feed a kidney dog.',
    lead:
      'The most evidence-backed change is phosphorus restriction — it\'s the single most important nutritional modification and has been shown to slow the progression of canine kidney disease. Therapeutic renal diets combine moderately restricted phosphorus, protein, and sodium with added omega-3s and potassium, and studies show these diets can roughly double survival time.',
    faqs: [
      {
        q: 'Should I feed a low-protein diet to a dog with kidney disease?',
        a: "This is genuinely controversial. Severe protein restriction is no longer favored, because too little protein causes muscle wasting. The current thinking is a moderate amount of HIGH-QUALITY, highly digestible protein combined with the other modifications — enough to maintain muscle while reducing the protein-waste burden. So it's not 'low protein,' it's 'the right amount of the right protein.' Phosphorus control matters more than aggressive protein cutting.",
      },
      {
        q: 'Why is phosphorus restriction so important?',
        a: "Damaged kidneys can't clear phosphorus well, so it builds up in the blood, which accelerates further kidney damage and drives the mineral imbalances that make dogs feel sick. Controlling dietary phosphorus is the most proven way to slow that spiral — limiting high-phosphorus ingredients (organ meats, bones, dairy, some fish) and sometimes adding phosphate binders under vet guidance.",
      },
      {
        q: "What supports a dog's liver, and do milk thistle and SAMe help?",
        a: "For the liver, a well-balanced, energy-rich diet with enough high-quality protein supports healing (severe protein restriction is only needed with hepatic encephalopathy). Milk thistle (silymarin) and SAMe are the two most-used liver-support supplements, with reasonable backing — both are antioxidants that protect liver cells and are generally safe. Honest caveat: they support the liver rather than cure the underlying disease. Both kidney and liver disease need veterinary diagnosis and monitoring.",
      },
    ],
  },
  {
    slug: 'natural-thyroid-support-for-hypothyroid-dogs',
    emoji: '🦋',
    tag: 'Organ Health',
    title: 'Natural Support for a Hypothyroid Dog (Alongside Medication)',
    metaDescription:
      "The honest answer on holistic thyroid support for dogs — what genuinely helps alongside levothyroxine, what to avoid, and why medication still matters.",
    lead:
      "Here's the honest take: true hypothyroidism cannot be cured or safely managed by natural remedies alone. The standard, evidence-based treatment is lifelong thyroid hormone replacement (levothyroxine), and it works well — most dogs return to normal on it. Holistic support is genuinely useful, but as an ADJUNCT to support the gland, skin, and overall health alongside medication, not to replace it.",
    faqs: [
      {
        q: 'What are the signs of hypothyroidism in dogs?',
        a: "The classic signs are weight gain without eating more, low energy, a dull or thinning coat, symmetrical hair loss (the 'rat tail'), dry skin, recurrent skin/ear infections, and cold intolerance (seeking warm spots). It's most common in middle-aged, medium-to-large breeds. These signs overlap with other conditions, so a blood test (T4/free T4 + TSH) is the only way to confirm.",
      },
      {
        q: "What's the best natural support alongside medication?",
        a: "Think 'support the gland's machinery,' not 'replace the hormone.' The thyroid needs specific nutrients: selenium and zinc (to convert storage hormone T4 into active T3), tyrosine (a building block), and iodine (the raw material — but don't over-supplement). A whole-food, minimally-processed diet with quality protein covers most of this. Omega-3 fish oil and vitamin E help the skin and coat problems. Introduce one thing at a time — supplements can shift how much medication your dog needs.",
      },
      {
        q: 'Is kelp or seaweed good for a hypothyroid dog?',
        a: "It's double-edged. Kelp is concentrated iodine, which the thyroid needs — but too much can worsen hypothyroidism and interfere with medication. Kibble-fed dogs usually already get plenty of fortified iodine, so the risk is over-supplementing; raw or home-cooked diets may genuinely need a measured source. Never free-feed kelp to a medicated dog without your vet.",
      },
    ],
  },
  {
    slug: 'dog-urinary-health-utis-and-bladder-stones',
    emoji: '💧',
    tag: 'Organ Health',
    title: "Dog Urinary Health: UTIs, Bladder Stones, and Diet",
    metaDescription:
      "The signs of a urinary problem, why the stone type completely changes the plan, and the single most important at-home factor for a dog's urinary health.",
    lead:
      "Watch for frequent urination or straining, only small amounts passed, blood in the urine, accidents in a house-trained dog, or excessive genital licking. A UTI can ascend to the kidneys, and straining could mean stones or, in male dogs, a dangerous blockage. Inability to pass urine is an emergency. For anything beyond mild, get a urinalysis rather than guessing.",
    faqs: [
      {
        q: 'Can diet dissolve my dog\'s bladder stones?',
        a: 'It depends on the stone type — and this distinction is crucial. Struvite stones (usually caused by UTIs) are the ONLY common stone that can be completely dissolved with a therapeutic diet, no surgery, over a few weeks to about three months. Calcium oxalate stones CANNOT be dissolved by any diet and must be removed; for these, diet is about preventing recurrence. Always identify the stone type with your vet first — it completely changes the plan.',
      },
      {
        q: 'Do cranberry or D-mannose help with dog UTIs?',
        a: "They have a modest, mainly preventive role — helping keep bacteria like E. coli from adhering to the bladder wall in UTI-prone dogs. Two honest caveats: they're supportive, not a reliable treatment for an established infection (which usually needs a culture-based antibiotic), and cranberry should NOT be given to dogs that form calcium oxalate stones, because it raises urinary oxalate.",
      },
      {
        q: 'How important is water and hydration for urinary health?',
        a: "It's arguably the single most important at-home factor. Dilute urine is protective urine — plenty of water flushes out bacteria and mineral crystals before they build into infections or stones. Feed moisture-rich food (canned, fresh, or rehydrated), offer multiple water sources or a fountain, and add water or a splash of low-sodium broth to meals. It fits the fresh-food approach perfectly.",
      },
    ],
  },

  // ── Batch 3: Supplement pages (from probiotics & supplement-evidence packs) ──
  {
    slug: 'do-probiotics-help-dogs',
    emoji: '🦠',
    tag: 'Supplements',
    title: 'Do Probiotics Help Dogs? Gut Health, Allergies & Digestion',
    metaDescription:
      "What probiotics genuinely do for dogs — the research on diarrhea, the gut-skin allergy link, the best natural sources, and how long they take to work.",
    lead:
      "Probiotics are one of the most evidence-supported supplements in dogs, especially for stress- and antibiotic-related diarrhea, and there's real research behind the gut-skin link to allergies too. They work best as a support alongside a less-processed diet — not a magic cure, but a genuinely useful tool for digestion, immune balance, and itchy skin.",
    faqs: [
      {
        q: "Can probiotics actually help my dog's allergies and itchy skin?",
        a: 'Yes — this link is real and backed by research. Studies show dogs with allergic skin disease have lower gut microbial diversity, and probiotic blends have measurably reduced itching, skin inflammation, and blood markers of allergy. The mechanism is the gut-skin axis: a healthier gut calms the overactive immune response that drives allergies. They work best alongside diet changes that remove the root irritant.',
      },
      {
        q: 'What are the best natural sources of probiotics for dogs?',
        a: "Whole-food probiotics are excellent and gentle: plain unsweetened kefir, fermented goat's milk, a spoonful of plain live-culture yogurt, and green tripe (which brings both probiotics and digestive enzymes). Small amounts of fermented vegetables help too. Start small and slow so the gut adjusts without loose stools.",
      },
      {
        q: 'How long do probiotics take to work in dogs?',
        a: 'For acute digestive upset, you may see firmer stools within a few days. For deeper goals like calming allergies and rebalancing the microbiome, give it several weeks to a couple of months of consistent daily use. The gut rebuilds gradually, so consistency matters more than a high one-time dose.',
      },
    ],
  },
  {
    slug: 'green-lipped-mussel-for-dogs',
    emoji: '🦪',
    tag: 'Supplements',
    title: 'Does Green-Lipped Mussel Work for Dog Joints?',
    metaDescription:
      "The honest, trial-by-trial evidence on green-lipped mussel for canine joint pain — what works, the form that matters, and how it compares to drugs.",
    lead:
      "The evidence is real but mixed. A randomized, double-blinded trial (Hielm-Björkman et al., 2009) in 45 dogs with osteoarthritis found the green-lipped mussel group improved more than placebo on pain and mobility — but a 2022 crossover trial found improvement over baseline without beating placebo. So several trials show benefit, not all beat placebo. Confidence: MEDIUM — it's one of the better-evidenced joint options, worth trying alongside omega-3 and weight management.",
    faqs: [
      {
        q: 'How long does green-lipped mussel take to help a dog\'s joints?',
        a: "It's slow-acting, like most joint nutraceuticals — give it a solid 8 or more weeks of consistent daily use before judging whether it's helping. Pair it with the higher-confidence levers (weight management and omega-3s) rather than relying on it alone.",
      },
      {
        q: 'Does the form of green-lipped mussel matter?',
        a: 'It can. The active anti-inflammatory components are marine lipids, so cold-processed or oil-extract forms that preserve those lipids are generally preferred over heat-treated powders that may degrade them. Look for products that specify a stabilized or lipid-rich extract.',
      },
      {
        q: 'Is green-lipped mussel safe for dogs?',
        a: "It's generally very well tolerated, which is part of its appeal as a low-risk add-on. The main caution is shellfish allergy. As always, dose to your dog's weight and introduce it on its own so you can tell whether it's helping.",
      },
    ],
  },
  {
    slug: 'does-l-theanine-calm-anxious-dogs',
    emoji: '🧘',
    tag: 'Supplements',
    title: 'Does L-Theanine Calm Anxious Dogs?',
    metaDescription:
      "L-theanine is among the better-studied calming supplements for dogs — here's the honest evidence, what kind of anxiety it suits, and whether it sedates.",
    lead:
      "L-theanine is among the better-studied calming supplements, with consistent positive owner reports but weak study designs. Owners of storm-sensitive and noise-phobic dogs report reduced drooling, pacing, panting, and hiding. It's non-sedating — a key appeal, since the dog stays responsive enough to keep training through triggers. Confidence: LOW-to-MEDIUM, best used as part of a plan.",
    faqs: [
      {
        q: 'What kind of anxiety is L-theanine best for?',
        a: 'Situational, predictable anxiety — thunderstorms, fireworks, noise phobia — rather than severe generalized anxiety. It works best as part of a plan with behavioral training, and sustained daily use (leading into anxiety season) tends to beat a single last-minute dose.',
      },
      {
        q: 'Does L-theanine make dogs sleepy or sedated?',
        a: "No — that's the main appeal. It promotes a calm-but-alert state rather than sedation, so the dog stays responsive. That makes it useful for working through triggers with training, unlike a sedative that just knocks the edge off.",
      },
      {
        q: 'Is L-theanine safe for dogs?',
        a: 'It has a wide safety margin and is generally very well tolerated. Match the dose to your dog\'s size (some chews underdose big dogs), and it can be combined with other calming approaches like melatonin for nighttime or a DAP pheromone diffuser. Loop in your vet for a dog on other medications.',
      },
    ],
  },

  // ── Batch 4: Urgent conditions (pancreatitis, bloat, anxiety, cancer) ──
  {
    slug: 'what-to-feed-a-dog-with-pancreatitis',
    emoji: '🔥',
    tag: 'Digestive Health',
    title: 'What to Feed a Dog with Pancreatitis',
    metaDescription:
      'Low fat is the cornerstone of managing canine pancreatitis. The diet rules, the outdated fasting advice you should ignore, and how to prevent the next attack.',
    lead:
      "Low fat is the cornerstone — dietary fat is the main stimulant of pancreatic enzyme secretion, so reducing it lets the inflamed pancreas rest. The general target is under ~10% fat on a dry-matter basis (5–8% for severe or recurrent cases), paired with moderate, digestible protein. Pancreatitis ranges from mild to life-threatening, so an acute attack is a vet emergency.",
    faqs: [
      {
        q: 'What are the signs of pancreatitis in dogs?',
        a: "Classic signs are vomiting, loss of appetite, abdominal pain (a dog may take a 'praying' position with front end down, rear up), lethargy, diarrhea, and sometimes fever. It's often triggered by a fatty meal or treat. If you see repeated vomiting plus pain and your dog won't eat, get to a vet promptly.",
      },
      {
        q: 'Should I fast my dog during a pancreatitis attack?',
        a: "The old advice to fast for days is now outdated. Current evidence favors EARLY feeding — appropriate low-fat nutrition sooner is well tolerated and linked to fewer complications than prolonged fasting. But this is a hospital-level decision during an acute attack: don't force-feed a vomiting dog at home, get veterinary care where controlled early feeding is managed with anti-nausea meds and fluids.",
      },
      {
        q: 'How do I prevent pancreatitis?',
        a: "Prevention is mostly about fat and weight. Keep your dog lean, avoid fatty table scraps and rich treats entirely (no bacon grease or greasy leftovers), and make diet changes gradual. Be extra vigilant around holidays and the grill. Higher-risk breeds (like Miniature Schnauzers) or dogs with a prior episode should hold a consistently low-fat diet.",
      },
    ],
  },
  {
    slug: 'signs-of-bloat-in-dogs',
    emoji: '🚑',
    tag: 'Digestive Health',
    title: 'Signs of Bloat (GDV) in Dogs — and How to Prevent It',
    metaDescription:
      'Bloat/GDV is a minutes-matter emergency. The warning signs that can save your dog, plus the raised-bowl and kibble-swelling myths the research has reversed.',
    lead:
      "Know these signs — they can save your dog's life: unproductive retching (trying to vomit but nothing comes up), a swollen or hard belly, restlessness and pacing, drooling, and a hunched posture. The combination of retching with nothing coming up plus a bloating abdomen in a large dog is a red-alert emergency. Do not wait to 'see if it passes' — get to an emergency vet immediately. Minutes matter.",
    faqs: [
      {
        q: 'Do raised food bowls prevent bloat?',
        a: "No — and the advice actually reversed. Older guidance recommended elevated bowls, but later research found the opposite: feeding from a raised bowl was associated with INCREASED GDV risk, particularly in large and giant breeds. Feed at-risk dogs from floor level. (Raised bowls may still be fine for arthritis/mobility, just not as bloat prevention.)",
      },
      {
        q: 'Does dry kibble swell in the stomach and cause bloat?',
        a: "This is one of the most common bloat myths, and research disproves it. GDV is driven by GAS accumulation and the stomach twisting, NOT food physically swelling. Moistening kibble to 'pre-expand' it doesn't reliably help and can backfire. The real diet-related risk factors are fat or oil among the first four ingredients, one large daily meal, and fast/gulping eating. Grain does not increase bloat risk either.",
      },
      {
        q: "How can I reduce my dog's risk of bloat?",
        a: "You can't eliminate it (much is anatomy and genetics), but sensible feeding helps: feed 2–3 smaller meals instead of one large one, slow down fast eaters with a slow-feeder bowl, feed from floor level, and avoid vigorous exercise about an hour before and after meals. For high-risk breeds, the most effective prevention is a surgical one — a gastropexy — worth discussing with your vet.",
      },
    ],
  },
  {
    slug: 'how-to-calm-an-anxious-dog-naturally',
    emoji: '🐕',
    tag: 'Behavior & Anxiety',
    title: 'How to Calm an Anxious Dog Naturally',
    metaDescription:
      'The evidence-based foundation for canine anxiety — exercise, enrichment, and routine — plus the best-supported calming aids and when to get professional help.',
    lead:
      "Build from the foundation up: the most effective base is plenty of physical exercise, mental enrichment (sniff walks, puzzle feeders, training), and a predictable routine — these address the root and have the strongest support. On top of that, the best-evidenced calming aids are L-theanine, dog-appeasing pheromones (Adaptil), alpha-casozepine (Zylkene), and gut-brain probiotics. Think of supplements as adjuncts, not cures.",
    faqs: [
      {
        q: 'Does exercise and enrichment really help an anxious dog?',
        a: "Yes — this is foundational and the most reliably effective natural anxiety tool. Physical exercise burns off nervous energy and releases feel-good neurochemicals, while mental enrichment (sniff walks, lick mats, nose work, training games) tires the brain and builds confidence. A tired, mentally-satisfied dog is a calmer dog. Add a predictable daily routine and you've addressed the root more powerfully than any supplement.",
      },
      {
        q: 'Do calming pheromones like Adaptil work for dogs?',
        a: "Yes — dog-appeasing pheromone (DAP, sold as Adaptil) has reasonable evidence. It's a synthetic copy of the pheromone a mother dog releases while nursing, which signals safety, and studies show it can reduce anxiety around being home alone, thunderstorms, and vet visits. It comes as a diffuser, collar, or spray, is drug-free, and is safe to layer with training. Effects are usually modest.",
      },
      {
        q: 'When does my dog\'s anxiety need professional help?',
        a: "For severe anxiety — panic, self-harm, destructive behavior, or a dog that truly can't be left alone — natural aids usually aren't enough, and it's time for a vet or veterinary behaviorist. Match the tool to the severity: foundational work plus mild calming aids for mild-to-moderate anxiety, professional help (which may include medication) for severe cases.",
      },
    ],
  },
  {
    slug: 'can-diet-prevent-cancer-in-dogs',
    emoji: '🎗️',
    tag: 'Cancer & Prevention',
    title: 'Can Diet or Natural Approaches Prevent Cancer in Dogs?',
    metaDescription:
      'The honest answer on diet and canine cancer — what genuinely reduces risk (lean weight, omega-3s), what\'s promising but unproven (keto, mushrooms), and why nothing replaces oncology.',
    lead:
      "Here's the honest framing: nutrition and holistic care can help REDUCE risk and SUPPORT a dog through cancer, but no diet, supplement, or natural remedy is a proven cure, and none should replace veterinary oncology. What genuinely has support: keeping your dog lean, an anti-inflammatory whole-food diet, omega-3s, and reducing carcinogen exposure. Anyone promising a natural cure is not being straight with you.",
    faqs: [
      {
        q: 'Does keeping my dog lean reduce cancer risk?',
        a: "Yes — this is one of the better-supported, and freest, preventive levers. Obesity is a well-established cancer risk factor because excess fat tissue drives chronic low-grade inflammation and altered hormonal signaling that create a pro-tumor environment. Keeping your dog at a lean body condition (you should easily feel the ribs) reduces that inflammatory burden. Of all the things you can control, maintaining a lean weight is near the top for cancer-risk reduction.",
      },
      {
        q: "Does a keto or low-carb diet 'starve' cancer in dogs?",
        a: "Be honest about where the science is: there is NO evidence a ketogenic diet prevents cancer in the first place. The 'tumors rely on glucose' theory is plausible and being studied, and keto may help slow progression alongside standard therapy, but it's unproven and emerging in dogs. It's also high-fat (a concern for pancreatitis-prone dogs). A lower-carb whole-food diet is reasonable, but don't treat keto as a proven treatment or a replacement for oncology.",
      },
      {
        q: 'Does turkey tail mushroom help dogs with cancer?',
        a: "This one has a real (if small) study behind it. University of Pennsylvania researchers gave PSP — the active compound in turkey tail — to dogs with hemangiosarcoma; dogs on high-dose PSP (100 mg/kg daily) had a median survival of ~199 days, longer than lower doses and typical historical comparisons. It's about 15 dogs, so promising rather than proven, but genuine evidence for an immune-modulating mushroom — best as a complement to veterinary care, not a replacement.",
      },
    ],
  },

  // ── Batch 5: Flea/tick & parasites (high search intent) ──
  {
    slug: 'natural-flea-and-tick-prevention-for-dogs',
    emoji: '🌿',
    tag: 'Parasite Prevention',
    title: 'Natural Flea and Tick Prevention for Dogs',
    metaDescription:
      'How to repel fleas and ticks before they bite — a natural repellent spray recipe, yard control, and when environmental methods are enough versus when you need more.',
    lead:
      "The holistic goal is to repel insects before they bite, rather than kill them after they've already fed. That means a layered approach: a natural repellent spray on the dog, environmental control in the yard, and regular grooming with a flea comb. For low-risk, healthy dogs without flea-allergic dermatitis, these methods are often sufficient on their own.",
    faqs: [
      {
        q: 'How do I make a natural flea and tick repellent spray?',
        a: 'Mix 5 tablespoons (75ml) witch hazel with aloe vera, 2 tablespoons (30ml) liquid coconut oil, 1ml neem oil, and 1ml (about 20 drops) turmeric essential oil in a spray bottle. Apply twice weekly and use a flea comb to distribute it. This roughly 1% essential-oil barrier repels insects before they bite, unlike systemic pesticides that only kill after feeding. Always patch-test a small area first and stop if any irritation occurs.',
      },
      {
        q: 'Do you need year-round flea prevention or only in warm months?',
        a: "It depends on climate and exposure. In warm regions fleas are active all year; in cold climates, outdoor activity drops in winter, though indoor fleas survive in heated homes. For an indoor-only dog in a cold climate, winter prevention may be unnecessary. And 'prevention' doesn't require neurotoxic systemic drugs — environmental control (yard nematodes), grooming, and natural repellents are often enough for a low-risk dog.",
      },
      {
        q: 'What about flea control in the yard?',
        a: "Beneficial nematodes (microscopic organisms applied to the yard) prey on flea larvae and pupae in the soil, targeting the ~95% of the flea population that isn't the adult fleas on your dog. Combined with regular vacuuming indoors and washing bedding, this attacks the life cycle at the source without a systemic chemical — a strong complement to an on-dog repellent.",
      },
    ],
  },
  {
    slug: 'are-flea-and-tick-medications-safe-for-dogs',
    emoji: '⚠️',
    tag: 'Parasite Prevention',
    title: 'Are Flea and Tick Medications Safe? (Isoxazolines Explained)',
    metaDescription:
      'What isoxazolines like NexGard, Bravecto, and Simparica actually are, the honest adverse-event data, which dogs are highest-risk, and what to do after a reaction.',
    lead:
      "Isoxazolines (Bravecto, NexGard, Simparica) are systemic neurotoxic pesticides designed to stay in a dog's bloodstream for 1–12 months. They block nerve-signal channels to paralyze and kill insects. They're meant to affect only insects, but research shows they can cross the blood-brain barrier in mammals, creating a risk of neurological toxicity in some dogs. This is a real risk-vs-benefit conversation, not a simple 'safe' or 'dangerous.'",
    faqs: [
      {
        q: 'What are the real adverse event rates for isoxazolines?',
        a: "Companies cite '0.01%' rates, but U.S. reporting is voluntary. FDA data from 2013–2017 documented 1,728 seizures and 801 deaths. The Project Jake survey (2,751 respondents, 2020) found that of 1,594 treated dogs, 66.6% experienced an adverse event including tremors, ataxia, or seizures. Europe's mandatory reporting showed 7–10 times higher death and seizure rates than U.S. voluntary reports, suggesting significant underreporting.",
      },
      {
        q: 'Do these medications repel fleas and ticks, or kill them after they bite?',
        a: "They don't repel — they only kill after the parasite has already bitten and fed on medicated blood. The label states parasites 'need to start feeding to become exposed to the medication.' For a dog with flea-allergic dermatitis, that's a failure of the point of treatment, because a single bite triggers weeks of inflammation. And for ticks, disease transmission can occur before the tick dies.",
      },
      {
        q: 'What should I do if my dog has a reaction?',
        a: "There's no antidote. If your dog shows tremors, ataxia, seizures, or behavioral changes: (1) contact your vet or an emergency clinic immediately; (2) seek neurological evaluation; (3) begin supportive care; (4) report it to the FDA (1-888-FDA-VETS); (5) do not re-administer that product or its class. Screening high-risk breeds (see MDR1 testing) before the first dose is the best prevention.",
      },
    ],
  },
  {
    slug: 'natural-dewormer-for-dogs',
    emoji: '🪱',
    tag: 'Parasite Prevention',
    title: 'Natural Dewormers for Dogs (and How to Use Them Safely)',
    metaDescription:
      'The holistic approach to worms — pumpkin seeds, the herbal deworming triad, and diatomaceous earth — with honest safety cautions and when to still see a vet.',
    lead:
      "The holistic philosophy is that a strong immune system and clean gut make the body inhospitable to parasites — the focus is proactive daily support rather than only reacting to an infestation with harsh chemicals. Several food- and herb-based dewormers can help, but potency and dosing matter, and some carry real safety cautions, so this is best done with holistic-vet guidance.",
    faqs: [
      {
        q: 'Do pumpkin seeds get rid of worms in dogs?',
        a: "Pumpkin seeds are the most recommended natural dewormer. They contain cucurbitin, credited with paralyzing worms (especially tapeworms and roundworms) so the body can expel them. The catch: they must be raw, organic, and ground fine — whole seeds often pass straight through undigested. A common approach is adding ground seeds to food for a stretch of days. Gentle and food-based, which is why it's a holistic favorite.",
      },
      {
        q: "What is the herbal deworming 'triad'?",
        a: "The triad of wormwood, black walnut, and cloves is a classic, potent natural dewormer: wormwood kills adult parasites, black walnut hull helps expel various worms, and cloves contain eugenol, which destroys parasite eggs to break the life cycle. Because it's potent, dosing matters a lot — wormwood and black walnut can be hard on the liver and kidneys at the wrong dose, so use it with a holistic vet rather than freelancing.",
      },
      {
        q: 'Does diatomaceous earth work for deworming, and how do I use it safely?',
        a: "Food-grade diatomaceous earth (DE) acts as a mechanical dewormer — its microscopic fragments irritate parasites so they lose grip on the intestinal wall — often used daily for about 30 days. Two safety rules are essential: only ever use FOOD-GRADE DE (never pool-grade), and always mix it thoroughly into wet food, because inhaling the dry powder can irritate the lungs.",
      },
    ],
  },

  // ── Batch 6: Myths & dental ──
  {
    slug: 'does-grain-free-dog-food-cause-heart-disease',
    emoji: '❤️',
    tag: 'Nutrition Myths',
    title: 'Does Grain-Free Dog Food Cause Heart Disease (DCM)?',
    metaDescription:
      'The honest, current state of the grain-free DCM question — what the FDA data actually shows, why legumes matter more than grain, and what causation has and hasn\'t been proven.',
    lead:
      "This is widely misunderstood, so here's the current state of the evidence. In 2018 the FDA flagged a spike in dilated cardiomyopathy (DCM) reports; over 90% of the diets were grain-free and ~93% contained peas or lentils. So there IS a real signal — but it points more at legumes/formulation than at the absence of grain itself. Causation has NOT been proven, the mechanism is still unknown, and taurine deficiency turned out not to be the primary cause.",
    faqs: [
      {
        q: 'So should I avoid grain-free food entirely?',
        a: "The practical takeaway is to be cautious of legume-heavy boutique kibbles (the 'BEG' pattern: boutique, exotic, grain-free, legume-heavy) — not to panic about the word 'grain-free' itself. A well-formulated whole-food or fresh diet is a very different thing from a pea-protein-loaded grain-free kibble. It's an association under active investigation, not a settled 'grain-free equals heart disease' fact.",
      },
      {
        q: "Does 'complete and balanced' mean a food is healthy?",
        a: "Not necessarily. 'Complete and balanced' means the food meets AAFCO's minimum nutrient profile on paper, but says nothing about ingredient quality, digestibility, processing, or whether nutrients come from whole foods or cheap synthetics. A highly processed kibble full of fillers can be 'complete and balanced' and still mediocre. Think of it as a floor (won't cause deficiency), not a ceiling (optimal nutrition).",
      },
      {
        q: 'Are dogs carnivores or omnivores?',
        a: "In between, and both extremes are wrong. Dogs aren't obligate carnivores like cats — they evolved extra copies of the AMY2B gene to digest starch better than wolves, so they CAN use some carbohydrates. But they're not true omnivores either; they're best described as scavenging carnivores that thrive on a meat-forward diet with no actual carbohydrate requirement. Build the diet around quality animal protein and fat, while recognizing they can handle some whole-food carbs.",
      },
    ],
  },
  {
    slug: 'how-to-prevent-dental-disease-in-dogs',
    emoji: '🦷',
    tag: 'Dental Care',
    title: 'How to Prevent Dental Disease in Dogs',
    metaDescription:
      'Daily brushing is the gold standard for canine dental health. What actually works (VOHC-approved products), the raw-bone myth, and what bad breath is really telling you.',
    lead:
      "Daily tooth brushing is the gold standard — the single most effective, best-evidenced way to prevent plaque, tartar, and periodontal disease. Use a dog-specific toothpaste (never human toothpaste — xylitol and fluoride are unsafe) and build it up gradually as a positive routine. If daily isn't realistic, even every-other-day brushing meaningfully helps. Consistency beats intensity.",
    faqs: [
      {
        q: 'Do dental chews and products actually work?',
        a: "The good ones do — the key is the VOHC seal. The Veterinary Oral Health Council independently reviews dental products and awards its Seal of Acceptance only to those proven to reduce plaque and/or tartar. Without that seal, 'dental' on the package is just marketing. VOHC-approved chews are a legitimate helper, not a full substitute for brushing — and watch the calories.",
      },
      {
        q: 'Do raw bones clean a dog\'s teeth?',
        a: "This is a popular belief, and the honest evidence is thin. Chewing may knock off some surface tartar, but it's not well-proven, and bones carry real risks: fractured teeth (common, painful, expensive), choking, and obstruction. Cooked bones should never be given — they splinter. If you choose raw meaty bones, use appropriately sized softer ones and supervise. For proven benefit with less risk, brushing and VOHC products are the better bet.",
      },
      {
        q: 'Why does my dog have bad breath?',
        a: "The most common cause by far is dental disease — plaque, tartar, and gum infection produce that foul odor, so persistent bad breath usually means the mouth needs attention (check for red gums, brown tartar, loose teeth). But breath is also a window into the body: a sweet/fruity smell can signal diabetes, a urine-like odor can point to kidney issues. Don't just mask it — treat bad breath as a diagnostic clue.",
      },
    ],
  },

  // ── Batch 7: Home & Household — dog-safe products (from household-chemicals & fragrance packs) ──
  {
    slug: 'dog-safe-laundry-detergent',
    emoji: '🧺',
    tag: 'Home & Household',
    title: 'Dog-Safe Laundry Detergent: What to Wash Bedding With',
    metaDescription:
      "Detergent residue on bedding is a common hidden cause of dog itching. The best 'free and clear' choice, why to skip dryer sheets, and the ingredients to avoid.",
    lead:
      "Choose a 'free and clear' detergent — fragrance-free, dye-free, and free of optical brighteners. Use less than you think you need (excess detergent is what gets trapped in fibers), and run an extra rinse cycle to flush residue out. Dog beds and blankets are in constant contact with skin, so detergent residue is one of the most common hidden triggers for itching.",
    faqs: [
      {
        q: "Can laundry detergent on my dog's bedding cause itching or allergies?",
        a: "Absolutely — the laundry your dog lies on is in constant contact with their skin, and detergent residue is a very common hidden trigger for irritation. The biggest offenders are added fragrances, dyes, and optical brighteners, which stay in the fibers after washing and rub against the skin all night. If your dog is itchy with no obvious food cause, switching to a fragrance-free detergent and re-washing their bedding is a cheap, fast thing to test — many owners see less scratching within a week or two.",
      },
      {
        q: 'Are dryer sheets and fabric softener safe to use on dog bedding?',
        a: "Best to skip them on anything your dog uses. Dryer sheets and liquid fabric softeners coat fabric with fragrances and waxy chemicals that sit right against the skin and can trigger contact irritation. They offer no benefit for your dog. A great natural swap is wool dryer balls — they soften and reduce static with zero chemicals or scent.",
      },
      {
        q: 'What ingredients in detergents should I avoid for my dog?',
        a: "Watch for added 'fragrance' or 'parfum' (a catch-all that can hide many undisclosed chemicals), artificial dyes, optical brighteners, and harsh sulfates. The cleaner-rinsing and more fragrance-free a product is, the less residue ends up on your dog's skin and paws. Simpler ingredient lists are almost always safer.",
      },
    ],
  },
  {
    slug: 'is-dish-soap-safe-for-dog-bowls',
    emoji: '🧼',
    tag: 'Home & Household',
    title: "Is Dish Soap Safe for Your Dog's Bowls?",
    metaDescription:
      "Soap residue on a dog's bowl gets eaten with every meal. Why it can cause irritation, how to wash bowls properly, and natural alternatives that rinse clean.",
    lead:
      "Soap film left on a bowl gets eaten with every meal, and the fragrances, dyes, and surfactants in conventional dish soap add to a dog's daily chemical load — which can show up as lip and chin irritation, upset stomach, or general inflammation in a sensitive dog. The fix is simple: rinse bowls thoroughly until there's zero slick or smell, and switch to a fragrance-free, dye-free dish soap.",
    faqs: [
      {
        q: "What's the best way to wash my dog's food and water bowls?",
        a: "Wash them daily with hot water and a fragrance-free, dye-free dish soap, then rinse until completely free of any soapy film or scent. Water bowls build an invisible slimy biofilm fast, so scrub them too, not just the food bowl. Once a week, sanitize naturally with a baking soda scrub or a soak in equal parts white vinegar and water, then rinse well. Letting bowls air-dry fully also discourages bacteria and yeast.",
      },
      {
        q: 'What natural alternatives can I use to clean bowls?',
        a: "Baking soda makes a great gentle scrub, and a soak in equal parts white vinegar and water naturally sanitizes and cuts biofilm — just rinse well afterward. These clean effectively while keeping your dog's chemical exposure low, which matters most for itchy or allergy-prone dogs.",
      },
      {
        q: 'Should I use a stainless steel or plastic bowl?',
        a: "Stainless steel is generally the better choice — it doesn't scratch and harbor bacteria the way plastic does over time, and it won't leach or hold onto soap residue and odors. Plastic bowls can also cause contact irritation on the chin in some dogs. Whatever the material, the daily-wash-and-rinse habit matters more than anything.",
      },
    ],
  },
  {
    slug: 'are-household-cleaners-safe-around-dogs',
    emoji: '🧹',
    tag: 'Home & Household',
    title: 'Are Household Cleaners and Floor Cleaners Safe Around Dogs?',
    metaDescription:
      "Dogs walk on floors then lick their paws, so cleaner residue gets ingested. Which cleaning ingredients to avoid, safer swaps, and how to lower your dog's chemical load.",
    lead:
      "Yes, household cleaners can affect your dog — dogs walk on floors and then lick their paws, so whatever residue is left behind gets ingested, and low paws and bellies contact it directly. Strong disinfectants, fragranced multi-surface sprays, and 'quat' cleaners can irritate paws and airways, especially in small dogs close to the ground. Choose fragrance-free or simple natural cleaners, and let floors dry fully before letting your dog back on them.",
    faqs: [
      {
        q: 'What cleaning ingredients should I avoid around my dog?',
        a: "Watch for added 'fragrance'/'parfum,' artificial dyes, harsh sulfates, antibacterial agents like triclosan, and quaternary ammonium 'quat' disinfectants. Around pets these are the ones most worth avoiding. The more fragrance-free and simple-ingredient a product is, the less residue ends up on your dog's paws and in the air they breathe.",
      },
      {
        q: 'What are safer natural cleaning options?',
        a: "Diluted white vinegar works for many hard surfaces, and simple fragrance-free cleaners cover most jobs. Let floors dry fully before letting the dog back on them, and keep concentrated products stored well away. This is part of lowering the overall chemical load for a sensitive or itchy dog.",
      },
      {
        q: 'How does household chemical exposure affect my dog overall?',
        a: "It adds up. Every small residue source — bowl soap, bedding detergent, floor cleaner, fragranced sprays — contributes to a dog's total daily chemical load, which can drive low-grade inflammation and show up as itchy skin, irritation, or general sensitivity. Reducing these hidden exposures is one of the cheapest levers for an allergy-prone dog.",
      },
    ],
  },
  {
    slug: 'fragrance-free-dog-products',
    emoji: '🌸',
    tag: 'Home & Household',
    title: 'Fragrance-Free vs Unscented Dog Products: What to Look For',
    metaDescription:
      "'Unscented' and 'fragrance-free' aren't the same thing. Why fragrance is a labeling loophole, how it can cause skin problems, and which label claim to actually trust.",
    lead:
      "The safest default is fragrance-free wherever you can find it — shampoo, toys, bedding, cleaning products. Two real reasons it matters: 'fragrance' is a legal labeling loophole where one word can hide dozens of undisclosed chemicals, and a dog's sense of smell is dramatically more sensitive than ours, so a scent level a person finds mild can be genuinely overwhelming at nose-level for a dog.",
    faqs: [
      {
        q: "What's the difference between 'unscented' and 'fragrance-free'?",
        a: "They are not the same, and this trips people up. 'Fragrance-free' means no fragrance ingredients were added at all. 'Unscented' often means a masking fragrance WAS added specifically to cancel out the base smell — so an 'unscented' product can still contain fragrance chemicals under that undisclosed 'fragrance' label term. To minimize fragrance exposure for a sensitive dog, look specifically for 'fragrance-free,' not 'unscented.'",
      },
      {
        q: 'Can fragranced dog shampoo actually cause skin problems?',
        a: "Yes — synthetic fragrance is a recognized cause of allergic contact dermatitis in dogs, showing up as itching, redness, or a dog rubbing and scratching right after a bath. Fragrance mixtures often use phthalates as fixatives to make the scent last, which are established endocrine disruptors in toxicology literature. If your dog scratches or gets red skin/ears after a bath, fragrance is one of the first ingredients worth ruling out — try a fragrance-free shampoo and see if the reaction stops.",
      },
      {
        q: "Why is 'fragrance' allowed to be just one word on a label?",
        a: "It's a real regulatory gap — the same loophole that exists in human cosmetics. Regulators generally let manufacturers list 'fragrance' or 'parfum' as a single ingredient without disclosing the individual chemicals, treating the blend as a protected trade secret. That one word can legally represent dozens of compounds, including synthetic musks and phthalate fixatives. This is exactly why 'fragrance-free' is the more reliable label claim to look for.",
      },
    ],
  },

  // ── Batch 8: Health (diabetes, heat, GI, bone broth) + individual foods ──
  {
    slug: 'can-i-manage-my-dogs-diabetes-with-diet',
    emoji: '🩸',
    tag: 'Organ Health',
    title: "Can You Manage a Dog's Diabetes with Diet?",
    metaDescription:
      "The honest answer on canine diabetes and diet — why insulin is almost always required, how diet and weight genuinely help, and why 'natural cure' claims are dangerous.",
    lead:
      "Here's the honest truth: no — canine diabetes is almost always insulin-dependent (similar to Type 1 in people), so the pancreas can't make enough insulin, and food can't replace it. Diet and weight management are powerful SUPPORTS that make blood sugar easier to control and reduce insulin needs, but nearly every diabetic dog requires insulin for life. Be very cautious of anything promising a natural cure — skipping insulin can be dangerous.",
    faqs: [
      {
        q: "What's the best diet for a diabetic dog?",
        a: "For dogs, consistency matters more than any 'magic' food — eating the same thing in the same amount on the same schedule is essential so insulin can be matched to nutrient absorption. The commonly recommended profile is balanced, with moderate-to-high insoluble fiber (which slows glucose absorption and blunts post-meal spikes), modest fat, and complex rather than simple-sugar carbohydrates. A whole-food, lower-glycemic diet fits well — the key is keeping it consistent meal to meal.",
      },
      {
        q: 'Can canine diabetes be reversed naturally?',
        a: "No — and this matters for safety. It's typically a permanent, insulin-dependent condition, and no diet, herb, or supplement reliably restores insulin production. Stopping insulin for a 'natural cure' can cause life-threatening ketoacidosis. What holistic management genuinely does: a consistent high-fiber whole-food diet, a lean weight, and exercise improve control and can lower insulin needs — alongside insulin, never instead of it.",
      },
      {
        q: 'What are the signs of diabetes in dogs?',
        a: "The classic early signs are increased thirst, increased urination, increased appetite but weight loss, and sometimes cloudy eyes (cataracts). These warrant a prompt vet visit. After diagnosis, contact your vet urgently for not eating, repeated vomiting, weakness or collapse, disorientation, or seizures — these can signal dangerously low blood sugar or ketoacidosis, both emergencies.",
      },
    ],
  },
  {
    slug: 'signs-of-heatstroke-in-dogs',
    emoji: '🌡️',
    tag: 'Safety',
    title: 'Signs of Heatstroke in Dogs — and What to Do',
    metaDescription:
      "Heatstroke can kill within minutes. The warning signs, the right way to cool a dog down (never ice-cold), and which dogs overheat most easily.",
    lead:
      "Heatstroke is a true emergency, so know the signs: frantic or excessive panting, thick drooling, bright red or dark/bluish gums, glassy eyes, weakness, stumbling, vomiting, disorientation, and eventually collapse or seizures. Normal dog temperature is about 101–102.5°F; above ~104°F is dangerous and above ~106°F is critical. If you see these signs, act immediately — heatstroke can damage organs and kill within minutes.",
    faqs: [
      {
        q: 'What should I do if my dog overheats?',
        a: "Cool him down, then get to a vet. Move him to shade or AC, offer small amounts of cool water, and cool his body with COOL (not ice-cold) water over the belly, groin, armpits, and paws, using a fan to boost evaporation. Do NOT use ice or ice-cold water — it can constrict blood vessels and trap heat. Then see a vet even if he seems to bounce back, because heatstroke can cause delayed internal organ damage.",
      },
      {
        q: 'How can I exercise my dog safely in hot weather?',
        a: "Work with your dog's cooling limits. Exercise in the cooler parts of the day and skip midday heat; on hot or humid days, trade sprints for steady low-intensity activity or swimming. Bring water, take shade breaks, and check the pavement — if it's too hot for your palm for 5 seconds, it'll burn paw pads. Let your dog set the pace; a self-imposed break is smart self-preservation, not laziness.",
      },
      {
        q: 'Which dogs overheat most easily?',
        a: "Flat-faced (brachycephalic) breeds like Bulldogs, Pugs, and Boxers are highest risk because their airways make panting inefficient. Dark-coated and thick double-coated dogs trap more heat; overweight dogs, seniors, puppies, and dogs with heart or breathing conditions all struggle more. If your dog fits any of these, be especially conservative — shorter sessions, more shade and water, and lean on swimming as the safest hot-weather exercise.",
      },
    ],
  },
  {
    slug: 'dog-sensitive-stomach-and-chronic-diarrhea',
    emoji: '🤢',
    tag: 'Digestive Health',
    title: 'Dog with a Sensitive Stomach or Chronic Diarrhea: Where to Start',
    metaDescription:
      "Most dogs with chronic GI issues are 'food-responsive' — diet alone resolves them. The elimination-diet approach, whether pumpkin helps, and what to avoid.",
    lead:
      "Start with diet — it's the single highest-yield step with the best evidence. Most dogs with chronic GI issues fall under 'chronic enteropathy,' and the largest group are 'food-responsive,' meaning a proper diet change alone resolves them without drugs. The approach is a strict diet trial (a single novel or hydrolyzed protein) for several weeks, supported by probiotics and fiber. Rule out the simple stuff first (parasites, abrupt changes, table scraps).",
    faqs: [
      {
        q: "What's the best diet for a dog with chronic diarrhea or IBD?",
        a: "The evidence points to an elimination diet built on a single protein the dog has never eaten (novel protein) or a hydrolyzed protein, fed exclusively for 6–8+ weeks with zero treats or extras. Holistically, a fresh, gently cooked or raw novel-protein diet (rabbit, venison, or another new-to-them protein with a simple digestible carb) accomplishes the elimination while cutting the ultra-processed load. Strict consistency is everything — one cheat treat can invalidate the trial.",
      },
      {
        q: 'Does pumpkin or added fiber help with dog diarrhea?',
        a: "Yes — fiber is genuinely useful, especially for large-bowel diarrhea. Plain cooked pumpkin is the easy at-home version: its soluble fiber helps regulate stool in both directions (firming up diarrhea, easing constipation). Start with about a teaspoon to a tablespoon depending on size. Fiber works best as part of the picture (with diet and probiotics), not as a sole fix for a chronic problem.",
      },
      {
        q: 'What should I avoid for a dog with a sensitive stomach?',
        a: "Cut the things most likely to irritate: ultra-processed kibble with lots of fillers, fatty foods and rich table scraps (which can inflame the gut or trigger pancreatitis), and the dog's known or suspected allergen protein (often one it's eaten for years, like chicken or beef). Abrupt diet changes and a parade of different treats also keep a sensitive gut stirred up. Simplify: one clean novel protein, minimal extras, consistent feeding.",
      },
    ],
  },
  {
    slug: 'bone-broth-for-dogs',
    emoji: '🍲',
    tag: 'Nutrition',
    title: 'Bone Broth for Dogs: Benefits and How to Make It',
    metaDescription:
      "Bone broth is one of the best whole-food additions for a dog — gut-supporting collagen and glycine, hydrating, and gentle for sick or fasting dogs. How to make it safely.",
    lead:
      "Bone broth is one of the best whole-food additions you can give. It's rich in collagen, gelatin, and glycine that support the gut lining (great for leaky gut and digestion), supplies joint-supporting compounds, and is wonderfully hydrating and palatable. It's gentle enough for sick, recovering, or fasting dogs, and a great way to get fluids into a dog that's off its food. Keep it plain and unsalted, with no onion or garlic.",
    faqs: [
      {
        q: 'How do I make a frozen bone broth treat for my dog?',
        a: "It's easy: use plain, unsalted bone broth (homemade or a clean store-bought one with no onion, garlic, or added salt), pour it into an ice cube tray, silicone mold, or a lick-friendly toy, and freeze. Give one when your dog is restless or needs something to do. Freezing it in a stuffable toy makes it last longer — hydrating, gut-supporting, and low-impact enough to use during fasting windows.",
      },
      {
        q: 'Why would I fast my dog, and is it healthy?',
        a: "Short, intermittent fasting (skipping a meal or a longer overnight gap) gives the digestive system a rest, helps lower insulin, and supports natural repair. Many healthy adult dogs do well on it. But fasting is NOT for puppies, pregnant or nursing dogs, diabetic dogs, or very small/toy breeds prone to low blood sugar. When in doubt, check with a holistic vet before starting.",
      },
    ],
  },
  {
    slug: 'can-dogs-eat-blueberries',
    emoji: '🫐',
    tag: 'Safe & Toxic Foods',
    title: 'Can Dogs Eat Blueberries?',
    metaDescription:
      'Yes — blueberries are one of the best treats for dogs: low in sugar, packed with antioxidants and fiber. How to serve them and how much is safe.',
    lead:
      "Yes — blueberries are one of the best treats you can give. They're low in sugar and calories and packed with antioxidants (anthocyanins), vitamin C, and fiber that support the immune system and fight inflammation, which fits a holistic anti-inflammatory approach perfectly. A genuinely healthy, dog-safe superfood.",
    faqs: [
      {
        q: 'How should I serve blueberries to my dog?',
        a: 'Fresh or frozen both work — frozen makes a great crunchy hot-weather treat. Serve them plain, and for small dogs you can halve them to be safe. Keep the quantity reasonable as part of the roughly 10%-of-daily-calories treat allowance.',
      },
      {
        q: 'Can dogs have too many blueberries?',
        a: "As a treat they're very safe, but too many at once can cause loose stool simply from the extra fiber, and they still count toward daily calories. A small handful for most dogs is plenty — they're a topper and snack, not a meal component.",
      },
    ],
  },
  {
    slug: 'can-dogs-eat-eggs',
    emoji: '🥚',
    tag: 'Safe & Toxic Foods',
    title: 'Can Dogs Eat Eggs?',
    metaDescription:
      'Yes — eggs are a fantastic whole-food protein for dogs. Cooked vs raw, the shell as a calcium source, and how much to feed by size.',
    lead:
      "Yes — eggs are a fantastic whole-food protein for dogs, rich in highly digestible amino acids plus biotin, riboflavin, and selenium. Cooked plain (no butter or salt) is the safe default. An egg a few times a week is a great topper for most dogs — scale the amount to your dog's size.",
    faqs: [
      {
        q: 'Can dogs eat raw eggs?',
        a: "Some raw-feeders give raw eggs, which is generally fine from a clean source, though it carries a small salmonella consideration, and large amounts of raw egg white over time can affect biotin absorption. Cooked plain is the lower-risk default; occasional raw from a trusted source is a personal choice.",
      },
      {
        q: 'Can dogs eat eggshells?',
        a: "Yes — finely ground eggshell adds calcium and is sometimes used to balance home-cooked diets. It must be ground fine (a coarse shell can be a GI irritant), and it's only relevant if you're intentionally balancing minerals; a dog on a complete diet doesn't need extra.",
      },
    ],
  },
  {
    slug: 'can-dogs-eat-pumpkin',
    emoji: '🎃',
    tag: 'Safe & Toxic Foods',
    title: 'Can Dogs Eat Pumpkin?',
    metaDescription:
      "Yes — plain cooked pumpkin is a holistic staple for dogs. How its fiber helps both diarrhea and constipation, how much to give, and what to avoid (pie filling).",
    lead:
      "Yes — plain cooked pumpkin (not pie filling, which has sugar and spices) is a holistic staple. Its soluble fiber helps with both diarrhea and constipation, it's gentle on the stomach, and it provides beta-carotene and potassium. Canned 100% pumpkin or fresh-cooked both work — just make sure there are no added sweeteners.",
    faqs: [
      {
        q: 'How much pumpkin should I give my dog?',
        a: "A common amount is roughly a teaspoon to a tablespoon per meal depending on the dog's size. It's also a good carrier for supplements. Start on the smaller side and adjust — too much fiber too fast can loosen stool.",
      },
      {
        q: 'What kind of pumpkin is safe — and is pie filling okay?',
        a: "Use plain canned 100% pumpkin or fresh-cooked pumpkin with nothing added. Avoid canned pumpkin pie filling — it contains sugar and spices (and sometimes xylitol in 'sugar-free' versions) that aren't appropriate for dogs.",
      },
    ],
  },

  // ── Batch 9: Essential oils (web-verified) + more foods ──
  {
    slug: 'are-essential-oils-safe-for-dogs',
    emoji: '🌿',
    tag: 'Home & Household',
    title: 'Are Essential Oils and Diffusers Safe for Dogs?',
    metaDescription:
      'Which essential oils are toxic to dogs, why tea tree oil is especially dangerous, and how to use a diffuser safely around pets. Based on ASPCA and Merck veterinary guidance.',
    lead:
      "Some are genuinely dangerous, so this needs real caution. Essential oils toxic to dogs include tea tree (melaleuca), pennyroyal, wintergreen, pine, sweet birch, cinnamon, citrus, peppermint, eucalyptus, and ylang ylang. They can cause anything from drooling and vomiting to tremors, and pennyroyal, tea tree, and eucalyptus have been linked to seizures or liver injury. Dogs are far more sensitive than people — never apply concentrated oils to a dog or let them ingest them.",
    faqs: [
      {
        q: 'Why is tea tree oil so dangerous for dogs?',
        a: "Tea tree (melaleuca) oil is one of the most frequently reported essential-oil poisonings in pets. Per the ASPCA, as few as 7 to 8 drops of concentrated (100%) tea tree oil can cause serious toxicity in a dog — including weakness, tremors, and difficulty walking. It's often in 'natural' shampoos and skin products, so check labels; a product safe for you can be harmful applied to or licked by your dog. (Source: ASPCA; Merck Veterinary Manual.)",
      },
      {
        q: 'Is it safe to run an essential-oil diffuser around my dog?',
        a: "It depends on the type. Passive/reed diffusers are generally safer because they don't release actual oil droplets into the air — the main risk is if a dog knocks one over and contacts the liquid directly. Active/nebulizing diffusers disperse micro-droplets that can land on the coat (then get licked) and irritate airways, especially for flat-faced dogs or those with breathing issues. If you use one, keep it in a room your dog can't access, run it briefly, and ventilate well. (Source: ASPCA.)",
      },
      {
        q: 'What are the signs my dog reacted to an essential oil?',
        a: "Watch for drooling, vomiting, lethargy, wobbliness or difficulty walking, tremors, low body temperature, or scent/fragrance on the coat or breath. If you suspect exposure — especially tea tree, pennyroyal, wintergreen, or eucalyptus — call your vet or the ASPCA Animal Poison Control Center (888-426-4435). Don't wait for it to pass; some effects are delayed, and there's no home antidote.",
      },
    ],
  },
  {
    slug: 'can-dogs-eat-carrots',
    emoji: '🥕',
    tag: 'Safe & Toxic Foods',
    title: 'Can Dogs Eat Carrots?',
    metaDescription:
      'Yes — carrots are a crunchy, low-calorie favorite that many dogs love, and good for teeth. How to serve them safely and why frozen carrots make a great chew.',
    lead:
      "Yes — carrots are one of the safest, most dog-friendly vegetables: a crunchy, low-calorie favorite that's good for the teeth and packed with beta-carotene and fiber. They make an excellent low-guilt training treat or chew, raw or lightly cooked.",
    faqs: [
      {
        q: 'How should I serve carrots to my dog?',
        a: "Wash them and cut into appropriately sized pieces or sticks — for small dogs, smaller pieces to avoid a choking risk. Raw carrots give a satisfying crunch (a frozen carrot can even soothe a teething puppy), and lightly steamed makes the nutrients a bit more available. Serve plain, no butter or seasoning.",
      },
      {
        q: 'Are carrots good for a dog on a diet?',
        a: "Very much — they're low in calories and high in fiber, so they're a great swap for richer treats when you're managing weight. Still count them toward the roughly 10%-of-daily-calories treat allowance, but as far as treats go, carrots are one of the better choices.",
      },
    ],
  },
  {
    slug: 'can-dogs-eat-watermelon',
    emoji: '🍉',
    tag: 'Safe & Toxic Foods',
    title: 'Can Dogs Eat Watermelon?',
    metaDescription:
      'Yes — watermelon is a hydrating hot-weather treat for dogs, with one rule: no seeds and no rind. How to serve it safely and how much is okay.',
    lead:
      "Yes — watermelon is a great hydrating summer treat, mostly water with vitamins A and C. The one rule that matters: remove the seeds and never give the rind. The rind is tough to digest and a real obstruction risk, and the seeds can cause blockage in quantity, especially in small dogs.",
    faqs: [
      {
        q: 'How should I serve watermelon to my dog?',
        a: "Cut seedless (or de-seeded) flesh into bite-sized chunks and skip the rind entirely. Frozen chunks make a great crunchy hot-weather treat. Serve plain — no watermelon candy, juice, or anything with added sugar.",
      },
      {
        q: 'Can watermelon upset my dog\'s stomach?',
        a: "In large amounts, the water and natural sugar can cause loose stool, so keep it to a treat-sized portion within the roughly 10%-of-daily-calories rule. Introduce it in a small amount the first time, like any new food.",
      },
    ],
  },
  {
    slug: 'can-dogs-eat-bananas',
    emoji: '🍌',
    tag: 'Safe & Toxic Foods',
    title: 'Can Dogs Eat Bananas?',
    metaDescription:
      "Yes — bananas are a safe treat for dogs in small amounts, but they're higher in sugar than most fruit. How much is okay and the best way to serve them.",
    lead:
      "Yes — bananas are safe for dogs and many love them, offering potassium, vitamin B6, and fiber. The one caveat is sugar: bananas are higher in natural sugar than most dog-safe fruit, so they're a small-portion, occasional treat rather than an everyday snack — especially for overweight or diabetic dogs.",
    faqs: [
      {
        q: 'How much banana can I give my dog?',
        a: "A few small slices for most dogs, less for small breeds — keep it within the roughly 10%-of-daily-calories treat allowance. Because of the sugar, bananas are better as an occasional treat than a daily one.",
      },
      {
        q: 'What\'s a good way to serve banana to a dog?',
        a: "Plain slices are simplest. You can also mash a little into a stuffable toy or freeze slices for a longer-lasting treat. Skip the peel — it isn't toxic but it's hard to digest and can cause an upset stomach or blockage.",
      },
    ],
  },

  // ── Batch 10: Lipomas / fatty lumps (from the evidence-based lipoma pack) ──
  {
    slug: 'how-to-shrink-a-dogs-lipoma',
    emoji: '🔬',
    tag: 'Lumps & Growths',
    title: "How to Shrink a Dog's Lipoma — What Actually Works",
    metaDescription:
      "The honest, evidence-based answer on shrinking a dog's fatty tumor — why no herb or 'detox' dissolves one, what weight loss really does, and the injection most owners are never offered.",
    lead:
      "Here's the honest version: no supplement, herb, oil, or 'detox' has any evidence of dissolving a canine lipoma — and the popular turmeric rationale doesn't even fit the biology, because a lipoma is a benign growth of fat cells, not an inflammatory lesion. What genuinely helps: keeping your dog lean shrinks the volume (though not the tumor itself), and there's a rarely-offered injection that can actually regress small ones. But step one is never skipped — get the lump aspirated first.",
    faqs: [
      {
        q: 'Can you dissolve a dog\'s lipoma naturally with turmeric or herbs?',
        a: "No — there's no trial, case series, or even a case report showing turmeric, bromelain, chickweed, apple cider vinegar, or castor oil shrinks a lipoma in dogs. The usual claim is that turmeric's anti-inflammatory effect dissolves it, but a lipoma isn't inflamed tissue — it's a mass of normal fat cells, so reducing inflammation has no route to removing it. These supplements are mostly harmless, but the real risks are diagnostic delay (treating an undiagnosed lump that's actually a mast cell tumor) and false credit (a dog who starts turmeric and loses weight gets attributed to the turmeric).",
      },
      {
        q: 'Does weight loss get rid of a lipoma?',
        a: "It reduces the volume, not the tumor. Fat cells inside a lipoma lose their lipid when a dog slims down, so the lump often gets smaller and softer — genuinely useful, and it may shrink below the size where it interferes with movement. But the cells and capsule remain, and it re-expands if the weight comes back. Keeping your dog at a body condition score of 4–5/9 is the single best-supported step for both preventing and managing lipomas.",
      },
      {
        q: 'Is there a way to shrink a lipoma without surgery?',
        a: "Yes, and most owners are never told about it: an intralesional steroid injection. In a 2012 study, 15 dogs got ultrasound-guided triamcinolone injected directly into the lipoma — 9 regressed completely and the rest shrank, with the only side effect being extra drinking/urinating for about two weeks. It works best on small lipomas (under 3 cm). It's a single small study, not a guarantee, but worth asking your vet about, since the options usually offered are just 'monitor' or 'surgery.'",
      },
      {
        q: 'When does a lipoma need surgery?',
        a: "When it's mechanical — in the armpit or groin restricting leg movement, or anywhere it's getting in the way — or when it's growing fast or the diagnosis is uncertain. Surgery is curative for that mass (though new ones can still form elsewhere), and earlier is easier: a small lipoma in an awkward spot is a much simpler operation than a large one.",
      },
    ],
  },
  {
    slug: 'is-my-dogs-lump-a-lipoma',
    emoji: '⚠️',
    tag: 'Lumps & Growths',
    title: "Is My Dog's Lump a Lipoma? Why You Can't Tell by Feel",
    metaDescription:
      "Soft, movable lumps aren't automatically harmless — some cancers feel exactly like a lipoma. Why a quick needle test matters, the red flags, and whether lipomas are dangerous.",
    lead:
      "This is the most important thing to know about fatty lumps: you can't tell a lipoma by feel, and neither can your vet. Some genuinely malignant cancers — especially mast cell tumors — frequently feel exactly like a lipoma: soft, movable, painless, slow-growing. The only way to know is a quick needle test (a fine needle aspirate). It's fast, usually needs no sedation, and it's the reason no lump should ever be assumed to be 'just a fatty tumor.'",
    faqs: [
      {
        q: 'How do vets tell if a lump is a lipoma?',
        a: "With a fine needle aspirate (FNA): a small needle draws cells from the lump onto a slide to be examined under a microscope. A lipoma gives mature fat cells (often a greasy smear); a mast cell tumor gives a very distinctive picture of round cells packed with purple granules. It's quick, inexpensive, usually done without sedation, and it's the standard first step for any new lump. Every month spent treating an undiagnosed lump 'naturally' is a month a mast cell tumor could be growing — the needle test isn't the risky part, the delay is.",
      },
      {
        q: 'Are lipomas dangerous in dogs?',
        a: "A classic (simple) lipoma isn't dangerous in itself — it's benign, doesn't spread, and doesn't turn into cancer. It only causes problems mechanically, by getting in the way when it sits in a joint area like the armpit or groin. The danger is never that your confirmed lipoma will 'become' cancer — it's that a lump you assumed was a lipoma might have been something else from the start. Diagnose it once, correctly, and a confirmed lipoma can be monitored with confidence.",
      },
      {
        q: 'What are the warning signs a lump needs re-checking?',
        a: "Get prompt re-evaluation (and re-aspiration) if a lump grows rapidly, changes from soft to firm, becomes fixed in place instead of freely movable, ulcerates or changes the skin over it, becomes painful, or waxes and wanes in size — mast cell tumors can swell and shrink as they release their granules, and a true lipoma shouldn't do that. Map and measure every lump (location, size, date) and photograph it with a coin for scale, since many dogs get several and that's the only reliable way to spot one behaving differently.",
      },
      {
        q: 'Which dogs are most prone to lipomas?',
        a: "Overweight and older dogs most of all — in a large UK study, heavier dogs had roughly 2× the odds and dogs aged 9–12 far higher odds than younger ones, with about 1.94% of all dogs affected in a year. Breed matters too: Weimaraners, Dobermanns, German Pointers, Springer Spaniels, and Labradors all sit well above average. Keeping your dog lean is the one risk factor you can actually control.",
      },
    ],
  },
]

export const getAnswer = (slug: string) => answerPages.find((a) => a.slug === slug)
export const getAnswerSlugs = () => answerPages.map((a) => a.slug)

// Contextual internal links — same-tag pages first (topical relevance for SEO +
// keeps a searcher moving deeper into the site), backfilled with others so every
// page has a few links out. No nav wall; these live only at the bottom of a page.
export const getRelatedAnswers = (slug: string, limit = 3) => {
  const current = getAnswer(slug)
  if (!current) return []
  const sameTag = answerPages.filter((a) => a.slug !== slug && a.tag === current.tag)
  const rest = answerPages.filter((a) => a.slug !== slug && a.tag !== current.tag)
  return [...sameTag, ...rest].slice(0, limit)
}

// ── Directory categories (powers the browsable /answers hub) ──
// Every page tag maps into exactly one top-level category. When you add a new
// tag, add it to a category's `tags` list so its pages appear in the directory.
export type AnswerCategory = {
  key: string
  label: string
  emoji: string
  blurb: string
  tags: string[]
}

export const answerCategories: AnswerCategory[] = [
  {
    key: 'food',
    label: 'Food & Ingredients',
    emoji: '🍖',
    blurb: "What's safe in the bowl — and what isn't.",
    tags: ['Safe & Toxic Foods', 'Nutrition', 'Nutrition Myths'],
  },
  {
    key: 'household',
    label: 'Home & Household',
    emoji: '🏠',
    blurb: 'Detergents, cleaners, oils, and everyday products around your dog.',
    tags: ['Home & Household'],
  },
  {
    key: 'health',
    label: 'Health & Conditions',
    emoji: '🩺',
    blurb: 'Common conditions and how diet and holistic care actually help.',
    tags: [
      'Skin & Allergies',
      'Joints & Mobility',
      'Organ Health',
      'Digestive Health',
      'Behavior & Anxiety',
      'Cancer & Prevention',
      'Dental Care',
      'Safety',
      'Lumps & Growths',
      'Holistic Organ Support',
      'Holistic Liver Support',
    ],
  },
  {
    key: 'supplements',
    label: 'Supplements',
    emoji: '💊',
    blurb: 'What the evidence actually shows, supplement by supplement.',
    tags: ['Supplements'],
  },
  {
    key: 'parasites',
    label: 'Parasites & Prevention',
    emoji: '🐛',
    blurb: 'Fleas, ticks, and worms — conventional and natural options.',
    tags: ['Parasite Prevention'],
  },
]

// Groups every answer page under its category (alphabetized within each), and
// drops any empty category. Orphan-safe: pages whose tag isn't in any category
// are collected under a fallback so nothing silently disappears from the hub.
export const getAnswersByCategory = () => {
  const mapped = answerCategories.map((c) => ({
    ...c,
    pages: answerPages
      .filter((p) => c.tags.includes(p.tag))
      .sort((a, b) => a.title.localeCompare(b.title)),
  }))
  const claimed = new Set(answerCategories.flatMap((c) => c.tags))
  const orphans = answerPages.filter((p) => !claimed.has(p.tag))
  if (orphans.length) {
    mapped.push({
      key: 'more',
      label: 'More Topics',
      emoji: '📋',
      blurb: 'Everything else.',
      tags: [],
      pages: orphans.sort((a, b) => a.title.localeCompare(b.title)),
    })
  }
  return mapped.filter((c) => c.pages.length > 0)
}
