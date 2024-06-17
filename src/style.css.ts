import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

const bottomBtn = style({
  position: 'fixed',
  zIndex: 2,
  width: 'calc(100% - 2rem)',
  padding: '1rem',
  bottom: 0,
});

const container = style({
  display: 'flex',
  padding: '1rem',
  flexDirection: 'column',
  gap: '1rem',
});

const card = style({
  backgroundColor: '#F2F3F5',
  padding: '12px',
  borderRadius: '8px',
});

const slider = style({
  borderRadius: '10px !important',
});

const slid = style({
  width: 'calc(100% - var(--slider-input-progress-margin-horizontal) * 2) !important',
});

const moneyCard = style({
  border: '2px solid #EDEEF0',
  borderRadius: '8px',
  padding: '1rem',
});

const collapseAction = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
});
const collapseArrow = recipe({
  base: {
    transition: 'all .25s ease',
  },
  variants: {
    open: {
      true: {
        transform: 'rotate(180deg)',
      },
    },
  },
});

const tag = style({
  backgroundColor: '#fff',
  padding: '4px 12px',
  borderRadius: '8px',
  width: 'max-content',
  marginTop: '8px',
});

const check = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const hint = style({});

globalStyle(`${hint} > span > span`, {
  color: 'var(--color-light-text-negative)',
});

export const appSt = {
  bottomBtn,
  container,
  card,
  slider,
  slid,
  moneyCard,
  collapseAction,
  collapseArrow,
  tag,
  check,
  hint,
};
