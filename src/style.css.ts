import { style } from '@vanilla-extract/css';
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
  textAlign: 'center',
  paddingBottom: '1rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  borderRadius: '24px',
  overflow: 'hidden',
});

const slider = style({
  borderRadius: '1rem !important',
});

const plate = recipe({
  base: {
    padding: '12px 1rem',
    borderRadius: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  variants: {
    ss: {
      g: {
        backgroundColor: '#F0FFED',
      },
      y: {
        backgroundColor: '#FFFDED',
      },
    },
  },
});
const plateIcon = recipe({
  base: {},
  variants: {
    ss: {
      g: {
        backgroundColor: '#23B100',
      },
      y: {
        backgroundColor: '#E5AD1B',
      },
    },
  },
});

const grid = style({
  display: 'grid',
  gridTemplateColumns: '48px 1fr',
  gap: '1rem',
});

const iconCard = style({
  width: '48px',
  height: '48px',
  backgroundColor: '#F2F3F5',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '1rem',
  margin: 'auto 0',
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
    marginRight: '.5rem',
  },
  variants: {
    open: {
      true: {
        transform: 'rotate(180deg)',
      },
    },
  },
});

const btnContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  textAlign: 'left',
  gap: '1rem',
});
const btn = style({
  borderRadius: '24px',
  padding: '1rem',
});

const img = style({
  objectFit: 'cover',
  objectPosition: 'bottom',
});

const slid = style({
  width: 'calc(100% - var(--slider-input-progress-margin-horizontal) * 2) !important',
});

export const appSt = {
  bottomBtn,
  container,
  card,
  slider,
  plate,
  plateIcon,
  grid,
  iconCard,
  collapseAction,
  collapseArrow,
  btnContainer,
  btn,
  img,
  slid,
};
