/**
 * Card 1080x1080 de composicao de um Circulo do Discernir.
 *
 * Renderiza visualmente para coordenadores gerais entenderem a formacao
 * SEM expor percentuais nem rotulos tecnicos. Sem hierarquia entre
 * casal e jovens, so rotulos discretos.
 *
 * Usado em tela (preview) e tambem off-screen para export PNG/PDF.
 */

import type { CircleProfilePercentages } from "../../utils/circleProfileCalculation";
import { getCircleMotorPhrase } from "../../utils/circleMotorPhrase";

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
}

// Particulas portuguesas que nao contam como "sobrenome principal".
const PARTICLES = new Set(["de", "da", "do", "dos", "das", "e"]);

/** "JOAQUIM pedro" → "Joaquim Pedro". Preserva acentos. */
const titleCase = (s: string): string =>
  s
    .toLowerCase()
    .replace(/(^|\s|-)([a-záàâãéèêíïóôõöúüçñ])/g, (_, sep, ch) => sep + ch.toUpperCase());

/** Pega so o primeiro nome em Title Case. */
const firstNameOnly = (full: string): string => {
  const first = (full || "").trim().split(/\s+/)[0] || full;
  return titleCase(first);
};

/** Pega "Primeiro Ultimo" em Title Case, ignorando particulas (de/da/dos/etc). */
const firstAndLast = (full: string): string => {
  const parts = (full || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return full;
  if (parts.length === 1) return titleCase(parts[0]);
  let lastIdx = parts.length - 1;
  while (lastIdx > 0 && PARTICLES.has(parts[lastIdx].toLowerCase())) lastIdx--;
  return titleCase(`${parts[0]} ${parts[lastIdx]}`);
};

/**
 * Agrupa um casal numa linha unica "Joaquim e Luzia · casal" e mantem
 * jovens separados (com 1 sobrenome). Ordem: casal primeiro, jovens depois.
 */
export const buildRows = (members: CircleCardMember[]): { label: string; tag: string }[] => {
  const rows: { label: string; tag: string }[] = [];
  const used = new Set<string>();

  // Casais primeiro: parear quem tem spouse_user_id mutuo
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

  // Jovens depois (primeiro nome + 1 sobrenome)
  const jovens = members.filter((m) => m.participant_type === "jovem");
  for (const j of jovens) {
    rows.push({ label: firstAndLast(j.display_name), tag: "jovem" });
  }

  // Quem ficou sem marcacao
  const outros = members.filter(
    (m) => !used.has(m.user_id) && m.participant_type !== "casal" && m.participant_type !== "jovem",
  );
  for (const o of outros) {
    rows.push({ label: firstAndLast(o.display_name), tag: "membro" });
  }

  return rows;
};

export function CircleCompositionCard({ circleNumber, members, domId, labelOverrides }: Props) {
  const motorPhrase = getCircleMotorPhrase(members);
  const rows = buildRows(members).map((r, i) => {
    const ov = labelOverrides?.[i];
    return ov && ov.trim().length > 0 ? { ...r, label: ov.trim() } : r;
  });

  return (
    <div
      id={domId}
      style={{
        width: 1080,
        height: 1080,
        background: "linear-gradient(180deg, #FAF8F5 0%, #F5EFE6 100%)",
        fontFamily: "'Crimson Pro', 'Times New Roman', serif",
        color: "#2A2622",
        padding: 96,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* HEADER: numero do circulo */}
      <div>
        <p
          style={{
            fontSize: 28,
            letterSpacing: 8,
            color: "#A07A2C",
            textTransform: "uppercase",
            fontWeight: 500,
            margin: 0,
            marginBottom: 16,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Círculo
        </p>
        <p
          style={{
            fontSize: 180,
            lineHeight: 1,
            color: "#2A2622",
            margin: 0,
            fontWeight: 400,
            letterSpacing: -4,
          }}
        >
          {circleNumber}
        </p>
      </div>

      {/* FRASE-MOTOR: centro */}
      <div style={{ textAlign: "center", padding: "0 40px" }}>
        <p
          style={{
            fontSize: 44,
            lineHeight: 1.35,
            fontStyle: "italic",
            color: "#594734",
            margin: 0,
            fontWeight: 400,
          }}
        >
          &ldquo;{motorPhrase}&rdquo;
        </p>
      </div>

      {/* MEMBROS: lista */}
      <div>
        <div
          style={{
            height: 1,
            background: "#C4A052",
            opacity: 0.4,
            marginBottom: 36,
          }}
        />
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {rows.map((r, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                fontSize: 36,
                color: "#2A2622",
              }}
            >
              <span style={{ fontWeight: 500 }}>{r.label}</span>
              <span
                style={{
                  fontSize: 22,
                  fontFamily: "'Inter', sans-serif",
                  color: "#8C7656",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontWeight: 400,
                }}
              >
                {r.tag}
              </span>
            </li>
          ))}
        </ul>
        <div
          style={{
            height: 1,
            background: "#C4A052",
            opacity: 0.4,
            marginTop: 36,
          }}
        />
      </div>

      {/* RODAPE */}
      <div
        style={{
          textAlign: "center",
          fontSize: 22,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: "#A07A2C",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
        }}
      >
        Discernir
      </div>
    </div>
  );
}

export default CircleCompositionCard;
