// Deterministic legal disclaimer appended to every successful AI response
// (coach + chat). Guarantees the framing on every reply regardless of what the
// model says — and it renders in both the website chat and the app's coach
// screen, since both just display the API's `message`.
export const DISCLAIMER =
  '\n\n—\n*⚕️ Educational information only — not a diagnosis or a substitute for professional veterinary care. For health concerns, symptoms, or before major diet or medication changes, consult a holistic or integrative veterinarian.*'
