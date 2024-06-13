import { style } from "@vanilla-extract/css";

const bottomBtn = style({
  position: "fixed",
  zIndex: 2,
  width: "calc(100% - 2rem)",
  padding: "1rem",
  bottom: 0,
});

const container = style({
  display: "flex",
  padding: "1rem",
  flexDirection: "column",
  gap: "1rem",
});

const card = style({
  backgroundColor: "#F2F3F5",
  padding: "12px",
  borderRadius: "8px",
});

const slider = style({
  borderRadius: "10px !important",
});

const btn = style({
  borderRadius: "24px",
  padding: "1rem",
});

const slid = style({
  width:
    "calc(100% - var(--slider-input-progress-margin-horizontal) * 2) !important",
});

const moneyCard = style({
  border: "2px solid #EDEEF0",
  borderRadius: "8px",
  padding: "1rem",
});

export const appSt = {
  bottomBtn,
  container,
  card,
  slider,
  btn,
  slid,
  moneyCard,
};
