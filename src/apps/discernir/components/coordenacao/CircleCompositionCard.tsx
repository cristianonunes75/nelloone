/**
 * Card 1080x1620 (retrato 2:3) de composicao de um Circulo do Discernir.
 *
 * Layout elegante: ornamento dourado, numero grande, frase-motor,
 * paragrafo de tom, lista de membros, rodape "Discernir".
 *
 * SEM percentuais. SEM rotulo tecnico (Pastor, Guardiao, etc).
 * SEM hierarquia entre casal e jovens, so rotulo discreto.
 *
 * Usado em tela (preview) e off-screen para export PNG/PDF.
 */

import type { CircleProfilePercentages } from "../../utils/circleProfileCalculation";
import { getCircleMotorPhrase } from "../../utils/circleMotorPhrase";
import { getCircleTone } from "../../utils/circleTone";

export interface CircleCardMember {
  display_name: string;
  participant_type: "casal" | "jovem" | null;
  spouse_user_id?: string | null;
  user_id: string;
  percentages: CircleProfilePercentages;
}

interface Props {
  circleNumber: number;
  members: CircleCardMember[];
  /** id usado para html2canvas localizar o nó no DOM */
  domId?: string;
  /** Sobrescreve o label de cada linha (por índice). Vazio/undefined usa o auto. */
  labelOverrides?: string[];
  /** Sobrescreve o paragrafo de tom. Vazio/undefined usa o auto. */
  toneOverride?: string;
  /** Sobrescreve a frase-motor. Vazio/undefined usa o auto. */
  motorPhraseOverride?: string;
}

const PARTICLES = new Set(["de", "da", "do", "dos", "das", "e"]);

const titleCase = (s: string): string =>
  s
    .toLowerCase()
    .replace(/(^|\s|-)([a-záàâãéèêíïóôõöúüçñ])/g, (_, sep, ch) => sep + ch.toUpperCase());

const firstNameOnly = (full: string): string => {
  const first = (full || "").trim().split(/\s+/)[0] || full;
  return titleCase(first);
};

const firstAndLast = (full: string): string => {
  const parts = (full || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return full;
  if (parts.length === 1) return titleCase(parts[0]);
  let lastIdx = parts.length - 1;
  while (lastIdx > 0 && PARTICLES.has(parts[lastIdx].toLowerCase())) lastIdx--;
  return titleCase(`${parts[0]} ${parts[lastIdx]}`);
};

export const buildRows = (members: CircleCardMember[]): { label: string; tag: string }[] => {
  const rows: { label: string; tag: string }[] = [];
  const used = new Set<string>();

  const casais = members.filter((m) => m.participant_type === "casal");
  for (const m of casais) {
    if (used.has(m.user_id)) continue;
    const spouse = casais.find(
      (s) => s.user_id !== m.user_id && (s.user_id === m.spouse_user_id || m.user_id === s.spouse_user_id),
    );
    if (spouse && !used.has(spouse.user_id)) {
      const a = firstNameOnly(m.display_name);
      const b = firstNameOnly(spouse.display_name);
      rows.push({ label: `${a} e ${b}`, tag: "casal" });
      used.add(m.user_id);
      used.add(spouse.user_id);
    } else {
      rows.push({ label: firstNameOnly(m.display_name), tag: "casal" });
      used.add(m.user_id);
    }
  }

  const jovens = members.filter((m) => m.participant_type === "jovem");
  for (const j of jovens) {
    rows.push({ label: firstAndLast(j.display_name), tag: "jovem" });
  }

  const outros = members.filter(
    (m) => !used.has(m.user_id) && m.participant_type !== "casal" && m.participant_type !== "jovem",
  );
  for (const o of outros) {
    rows.push({ label: firstAndLast(o.display_name), tag: "membro" });
  }

  return rows;
};

// Ornamento decorativo dourado, 3 elementos centrados.
const Ornament = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
    }}
  >
    <span style={{ width: 80, height: 1, background: "#C4A052", opacity: 0.6 }} />
    <span style={{ color: "#C4A052", fontSize: 24, lineHeight: 1 }}>✦</span>
    <span style={{ width: 80, height: 1, background: "#C4A052", opacity: 0.6 }} />
  </div>
);

export function CircleCompositionCard({
  circleNumber,
  members,
  domId,
  labelOverrides,
  toneOverride,
  motorPhraseOverride,
}: Props) {
  const motorPhrase = motorPhraseOverride?.trim() || getCircleMotorPhrase(members);
  const tone = toneOverride?.trim() || getCircleTone(members);
  const rows = buildRows(members).map((r, i) => {
    const ov = labelOverrides?.[i];
    return ov && ov.trim().length > 0 ? { ...r, label: ov.trim() } : r;
  });

  return (
    <div
      id={domId}
      style={{
        width: 1080,
        height: 1620,
        background: "linear-gradient(180deg, #FAF8F5 0%, #F1E9DC 50%, #FAF8F5 100%)",
        fontFamily: "'Crimson Pro', 'Times New Roman', serif",
        color: "#2A2622",
        padding: 80,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Moldura interna sutil */}
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 32,
          right: 32,
          bottom: 32,
          border: "1px solid #C4A052",
          opacity: 0.25,
          pointerEvents: "none",
        }}
      />

      {/* Topo: ornamento + eyebrow + numero */}
      <div style={{ textAlign: "center" }}>
        <div style={{ marginTop: 8, marginBottom: 32 }}>
          <Ornament />
        </div>
        <p
          style={{
            fontSize: 26,
            letterSpacing: 12,
            color: "#A07A2C",
            textTransform: "uppercase",
            fontWeight: 500,
            margin: 0,
            marginBottom: 12,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Círculo
        </p>
        <p
          style={{
            fontSize: 200,
            lineHeight: 1,
            color: "#2A2622",
            margin: 0,
            fontWeight: 400,
            letterSpacing: -6,
            fontFamily: "'Crimson Pro', serif",
          }}
        >
          {circleNumber}
        </p>
      </div>

      {/* Frase-motor */}
      <div
        style={{
          textAlign: "center",
          padding: "40px 32px 32px",
          marginTop: 24,
        }}
      >
        <p
          style={{
            fontSize: 40,
            lineHeight: 1.4,
            fontStyle: "italic",
            color: "#594734",
            margin: 0,
            fontWeight: 400,
            fontFamily: "'Crimson Pro', serif",
          }}
        >
          &ldquo;{motorPhrase}&rdquo;
        </p>
      </div>

      {/* Divisor */}
      <div
        style={{
          height: 1,
          background: "#C4A052",
          opacity: 0.35,
          margin: "16px 64px",
        }}
      />

      {/* Tom (paragrafo descritivo) */}
      <div style={{ padding: "16px 32px", flex: 1 }}>
        <p
          style={{
            fontSize: 28,
            lineHeight: 1.55,
            color: "#3F362C",
            margin: 0,
            textAlign: "justify",
            fontFamily: "'Crimson Pro', serif",
            fontWeight: 400,
          }}
        >
          {tone}
        </p>
      </div>

      {/* Divisor + lista membros */}
      <div>
        <div
          style={{
            height: 1,
            background: "#C4A052",
            opacity: 0.35,
            margin: "16px 64px 24px",
          }}
        />
        <p
          style={{
            fontSize: 18,
            letterSpacing: 8,
            color: "#A07A2C",
            textTransform: "uppercase",
            fontWeight: 500,
            margin: 0,
            marginBottom: 20,
            textAlign: "center",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Quem caminha junto
        </p>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 32px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {rows.map((r, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                fontSize: 32,
                color: "#2A2622",
              }}
            >
              <span style={{ fontWeight: 500, fontFamily: "'Crimson Pro', serif" }}>{r.label}</span>
              <span
                style={{
                  fontSize: 18,
                  fontFamily: "'Inter', sans-serif",
                  color: "#8C7656",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  fontWeight: 400,
                }}
              >
                {r.tag}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Rodape: ornamento + Discernir */}
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <div style={{ marginBottom: 20 }}>
          <Ornament />
        </div>
        <p
          style={{
            fontSize: 22,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#A07A2C",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            margin: 0,
          }}
        >
          Discernir
        </p>
      </div>
    </div>
  );
}

export default CircleCompositionCard;
